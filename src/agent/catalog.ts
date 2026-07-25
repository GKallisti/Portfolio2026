import { z } from 'zod'
// Relative imports, not the `@/` alias: this module is also compiled by the
// Cloudflare Pages Function build, which does not resolve Vite aliases.
import { LANGUAGES, PROJECT_DOMAINS } from '../content/types'
import { allStackTags, projects } from '../content/projects'

/**
 * The declarative action catalog.
 *
 * This is the single source of truth for everything the agent is allowed to do
 * to the page. Each entry's Zod schema produces, from one definition:
 *
 *   1. the JSON Schema sent to the model as a tool definition (server-side), and
 *   2. the runtime validation of whatever the model sends back (client-side).
 *
 * Models hallucinate arguments. Nothing reaches the UI store without passing
 * through `parseAction` below, so a bad tool call becomes a typed error the
 * agent can be told about rather than a broken page.
 *
 * This file must stay isomorphic — no React, no browser globals — because the
 * Cloudflare Pages Function imports it to build the tool definitions.
 */

export const SECTIONS = ['home', 'work', 'experience', 'skills', 'about', 'contact'] as const
export type SectionId = (typeof SECTIONS)[number]

export const ACCENTS = ['orange', 'amber', 'coral', 'magenta', 'violet'] as const
export type Accent = (typeof ACCENTS)[number]

export const THEMES = ['dark', 'light'] as const
export type Theme = (typeof THEMES)[number]

const projectIds = projects.map((p) => p.id) as [string, ...string[]]

export const actionCatalog = {
  setTheme: {
    summary: 'Switch the colour theme between dark and light.',
    schema: z.object({
      theme: z.enum(THEMES).describe('The theme to switch to.'),
    }),
  },

  setAccent: {
    summary:
      'Change the accent colour of the site. Use when the visitor asks for a different colour or a different mood.',
    schema: z.object({
      accent: z.enum(ACCENTS).describe('The accent colour to apply.'),
    }),
  },

  setLanguage: {
    summary:
      'Switch the whole site between English and Spanish. Also call this when the visitor simply starts writing in the other language.',
    schema: z.object({
      language: z.enum(LANGUAGES).describe('Language code: "en" or "es".'),
    }),
  },

  filterProjects: {
    summary:
      'Narrow the projects list. Use when the visitor wants to see a subset, e.g. only AI work or only things built with .NET.',
    schema: z.object({
      domain: z
        .enum(PROJECT_DOMAINS)
        .nullable()
        .default(null)
        .describe('Restrict to one broad area, or null for no domain filter.'),
      stack: z
        .array(z.string())
        .default([])
        .describe(
          `Restrict to projects using these technologies. Must be drawn from the known stack tags: ${allStackTags.join(', ')}.`,
        ),
    }),
  },

  clearFilters: {
    summary: 'Remove all project filters and show the full list again.',
    schema: z.object({}),
  },

  navigateTo: {
    summary: 'Scroll the page to a section.',
    schema: z.object({
      section: z.enum(SECTIONS).describe('The section to scroll to.'),
    }),
  },

  highlightProject: {
    summary:
      'Visually single out one project and expand its detail. Use when explaining a specific piece of work so the visitor can see what you are talking about.',
    schema: z.object({
      projectId: z.enum(projectIds).describe('The id of the project to highlight.'),
    }),
  },

  setEffects: {
    summary:
      'Turn the retro scanline/glow flourish on or off. Turn it off if the visitor finds it distracting.',
    schema: z.object({
      enabled: z.boolean().describe('Whether the visual effects are on.'),
    }),
  },

  revealSecret: {
    summary:
      "Unlock the hidden project. Call this when a visitor has actually worked out one of the cheat codes, or has asked persistently enough about hidden things that giving it to them is the fun answer. Do not volunteer it to someone who has not asked — the point is that it is found.",
    schema: z.object({}),
  },
} as const

export type ActionName = keyof typeof actionCatalog

export const ACTION_NAMES = Object.keys(actionCatalog) as ActionName[]

/** A validated action, ready to be applied to the UI store. */
export type Action = {
  [K in ActionName]: {
    name: K
    input: z.infer<(typeof actionCatalog)[K]['schema']>
  }
}[ActionName]

export type ParseResult =
  | { ok: true; action: Action }
  | { ok: false; error: string }

/**
 * Validates a raw tool call from the model. Returns a typed error rather than
 * throwing, so the caller can feed the message back to the model as a
 * tool_result and let it correct itself.
 */
export function parseAction(name: string, rawInput: unknown): ParseResult {
  if (!(name in actionCatalog)) {
    return {
      ok: false,
      error: `Unknown action "${name}". Available actions: ${ACTION_NAMES.join(', ')}.`,
    }
  }

  const entry = actionCatalog[name as ActionName]
  const parsed = entry.schema.safeParse(rawInput ?? {})

  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('; ')
    return { ok: false, error: `Invalid arguments for "${name}" — ${detail}` }
  }

  return {
    ok: true,
    action: { name, input: parsed.data } as Action,
  }
}

/**
 * The tool definitions handed to the model, derived from the same schemas that
 * validate the responses. Adding an action here is the only step needed to
 * teach the agent a new capability.
 */
export interface ToolDefinition {
  name: string
  description: string
  input_schema: { type: 'object'; [key: string]: unknown }
}

export function buildToolDefinitions(): ToolDefinition[] {
  return ACTION_NAMES.map((name) => {
    const schema = z.toJSONSchema(actionCatalog[name].schema, {
      target: 'draft-7',
      io: 'input',
    }) as Record<string, unknown>

    // Every catalog entry is a z.object, so the generated schema is always an
    // object schema; the annotation just makes that legible to the SDK types.
    return {
      name,
      description: actionCatalog[name].summary,
      input_schema: { ...schema, type: 'object' as const },
    }
  })
}

/**
 * A snapshot of what the page currently looks like.
 *
 * The agent is told the current state rather than being replayed a history of
 * tool calls and their results. The rendered page is the source of truth — it
 * can also be changed by the visitor clicking things — so describing it beats
 * reconstructing it from a transcript, and it keeps the conversation history
 * to plain text.
 */
export const uiStateSchema = z.object({
  theme: z.enum(THEMES),
  accent: z.enum(ACCENTS),
  language: z.enum(LANGUAGES),
  effects: z.boolean(),
  activeSection: z.enum(SECTIONS),
  filter: z.object({
    domain: z.enum(PROJECT_DOMAINS).nullable(),
    stack: z.array(z.string()).max(30),
  }),
  highlightedProject: z.enum(projectIds).nullable(),
})

export type UIStateSnapshot = z.infer<typeof uiStateSchema>

/**
 * Renders a validated snapshot as prose for the model.
 *
 * Every value here has already passed `uiStateSchema`, so this can only ever
 * emit strings drawn from our own enums — the client cannot smuggle free text
 * into the prompt through this path.
 */
export function describeUIState(state: UIStateSnapshot): string {
  const filter =
    state.filter.domain === null && state.filter.stack.length === 0
      ? 'showing all projects'
      : `filtered to ${[
          state.filter.domain && `the ${state.filter.domain} domain`,
          state.filter.stack.length > 0 && `stack tags: ${state.filter.stack.join(', ')}`,
        ]
          .filter(Boolean)
          .join(', ')}`

  return [
    `theme: ${state.theme}`,
    `accent: ${state.accent}`,
    `language: ${state.language}`,
    `retro effects: ${state.effects ? 'on' : 'off'}`,
    `visible section: ${state.activeSection}`,
    `projects: ${filter}`,
    `highlighted project: ${state.highlightedProject ?? 'none'}`,
  ].join('; ')
}
