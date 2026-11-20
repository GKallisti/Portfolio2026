import { parseAction, type Action } from './catalog'
import type { Language } from '@/content/types'

/**
 * The offline router.
 *
 * When the model is unreachable — no API key configured, rate limit hit,
 * network down — the agent still does something useful instead of showing an
 * error box. This is a plain keyword matcher over both languages: no
 * reasoning, but the commands genuinely work, which is the honest fallback for
 * a page whose whole point is that the assistant operates it.
 *
 * It runs through the same `parseAction` validation as the model's tool calls,
 * so there is exactly one path into the UI store.
 */

interface Rule {
  /** Matched against the lowercased, accent-stripped prompt. */
  patterns: RegExp[]
  /** `null` for rules that only answer — a hint, with nothing to execute. */
  action: { name: string; input: unknown } | null
  reply: Record<Language, string>
  /**
   * Other action names this rule makes redundant. "How does EnMoto work
   * inside" also mentions EnMoto, and highlighting the card would drag the
   * visitor back to the home page after opening the page they asked for.
   */
  supersedes?: string[]
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

const RULES: Rule[] = [
  {
    // `\bia\b` / `\bai\b` on their own, because the Spanish suggestion chip
    // reads "Mostrame solo lo de IA" — no "proyectos" to anchor against.
    // Word boundaries keep this off ordinary words: the "ia" in "cambia" is
    // not preceded by one, so "cambia a espanol" does not trip it.
    patterns: [/\b(ai|ia)\b/, /\b(agentic\w*|agente\w*|llm|rag)\b/],
    action: { name: 'filterProjects', input: { domain: 'ai', stack: [] } },
    reply: {
      en: 'Filtered to the AI and agentic systems work.',
      es: 'Filtrado a los sistemas de IA y agénticos.',
    },
  },
  {
    patterns: [/\b(games?|juegos?|videojuegos?|gamedev|unity|godot)\b/],
    action: { name: 'filterProjects', input: { domain: 'games', stack: [] } },
    reply: {
      en: 'Filtered to the games she has made and is making.',
      es: 'Filtrado a los juegos que hizo y que está haciendo.',
    },
  },
  {
    patterns: [/\b(all|every|todos?|todo)\b.*\b(projects?|proyectos?)\b/, /\b(clear|reset|limpiar|quitar)\b/],
    action: { name: 'clearFilters', input: {} },
    reply: { en: 'Cleared the filters.', es: 'Filtros limpiados.' },
  },
  {
    patterns: [/\b(light|claro|dia)\b/],
    action: { name: 'setTheme', input: { theme: 'light' } },
    reply: { en: 'Switched to the light theme.', es: 'Cambié al tema claro.' },
  },
  {
    patterns: [/\b(dark|oscuro|noche)\b/],
    action: { name: 'setTheme', input: { theme: 'dark' } },
    reply: { en: 'Switched to the dark theme.', es: 'Cambié al tema oscuro.' },
  },
  {
    patterns: [/\b(spanish|espanol|castellano)\b/],
    action: { name: 'setLanguage', input: { language: 'es' } },
    reply: { en: 'Switched the site to Spanish.', es: 'Cambié el sitio a español.' },
  },
  {
    patterns: [/\b(english|ingles)\b/],
    action: { name: 'setLanguage', input: { language: 'en' } },
    reply: { en: 'Switched the site to English.', es: 'Cambié el sitio a inglés.' },
  },
  {
    // Both in-depth page rules sit ahead of the plain EnMoto rule, which they
    // supersede, and both require "enmoto" in the prompt: without it, "how
    // does the agent work?" would open a page about a different project.
    patterns: [
      /\benmoto\b.*\b(architecture|arquitectura|under the hood|por dentro|technical|tecnic\w*|diagram\w*|flows?|flujos?|stack|works?|built|funciona|hech[oa]|armad[oa])\b/,
      /\b(architecture|arquitectura|under the hood|technical|tecnic\w*|diagram\w*|flows?|flujos?|stack|works?|built|funciona|hech[oa]|armad[oa])\b.*\benmoto\b/,
    ],
    action: { name: 'openPage', input: { page: 'enmoto-architecture' } },
    supersedes: ['highlightProject'],
    reply: {
      en: 'Opened the page on how EnMoto works inside — seven flows, drawn out.',
      es: 'Abrí la página de cómo funciona EnMoto por dentro — siete flujos dibujados.',
    },
  },
  {
    patterns: [
      /\benmoto\b.*\b(value|business|negocio|solves?|resuelve|problems?|problemas?|para que sirve)\b/,
      /\b(value proposition|propuesta de valor|business|negocio|solves?|resuelve|problems?|problemas?|para que sirve)\b.*\benmoto\b/,
    ],
    action: { name: 'openPage', input: { page: 'enmoto-product' } },
    supersedes: ['highlightProject'],
    reply: {
      en: 'Opened the page on what EnMoto solves, and why each decision was made.',
      es: 'Abrí la página de qué resuelve EnMoto, y por qué se decidió cada cosa.',
    },
  },
  {
    patterns: [/\benmoto\b/],
    action: { name: 'highlightProject', input: { projectId: 'enmoto' } },
    reply: {
      en: 'Highlighted EnMoto — the production mobile platform she built solo.',
      es: 'Resalté EnMoto — la plataforma móvil en producción que construyó sola.',
    },
  },
  {
    patterns: [/\b(contact|contacto|email|mail|hire|contratar)\b/],
    action: { name: 'navigateTo', input: { section: 'contact' } },
    reply: { en: 'Took you to the contact section.', es: 'Te llevé a la sección de contacto.' },
  },
  {
    // Ahead of the experience rule: someone typing "cv" wants the file, not a
    // section that paraphrases it.
    patterns: [/\b(cv|resume|resumen|curriculum|vitae|pdf)\b/],
    action: { name: 'showCV', input: {} },
    reply: {
      en: 'Her CV is right here — the download button below serves the English version, and the link beside it has the Spanish one.',
      es: 'Acá está su CV — el botón de abajo descarga la versión en español, y el link al lado tiene la inglesa.',
    },
  },
  {
    patterns: [/\b(experience|experiencia)\b/],
    action: { name: 'navigateTo', input: { section: 'experience' } },
    reply: { en: 'Took you to the experience section.', es: 'Te llevé a la sección de experiencia.' },
  },
  {
    patterns: [/\b(work|projects?|proyectos?|trabajos?)\b/],
    action: { name: 'navigateTo', input: { section: 'work' } },
    reply: { en: 'Took you to the work section.', es: 'Te llevé a la sección de proyectos.' },
  },
  {
    patterns: [/\b(calm|calmer|quiet|off|tranquilo|apaga|sin efectos)\b/],
    action: { name: 'setEffects', input: { enabled: false } },
    reply: { en: 'Turned the retro effects off.', es: 'Apagué los efectos retro.' },
  },
]

export interface LocalResult {
  actions: Action[]
  reply: string
}

const NO_MATCH: Record<Language, string> = {
  en: "I could not reach the model, so I am on local commands only. Try asking me to filter the AI work, switch language, change the theme, or jump to a section.",
  es: 'No pude conectarme al modelo, así que estoy solo con comandos locales. Probá pedirme que filtre lo de IA, cambie el idioma, cambie el tema o salte a una sección.',
}

/**
 * Best-effort interpretation of a prompt without the model.
 *
 * Every matching rule fires, not just the first, so "switch to Spanish and make
 * it light" does both things. At most one rule per action name wins, which
 * keeps a prompt mentioning two themes from thrashing the store.
 */
export function routeLocally(prompt: string, language: Language): LocalResult {
  const normalized = normalize(prompt)
  const matched: Rule[] = []
  const actions: Action[] = []
  const claimed = new Set<string>()

  for (const rule of RULES) {
    const key = rule.action?.name ?? `reply:${RULES.indexOf(rule)}`
    if (claimed.has(key)) continue
    if (!rule.patterns.some((pattern) => pattern.test(normalized))) continue

    if (rule.action === null) {
      claimed.add(key)
      matched.push(rule)
      continue
    }

    const parsed = parseAction(rule.action.name, rule.action.input)
    // A rule that no longer validates means the catalog changed under it;
    // skip rather than crash, and let a later rule or the fallback answer.
    if (!parsed.ok) continue

    claimed.add(key)
    rule.supersedes?.forEach((name) => claimed.add(name))
    matched.push(rule)
    actions.push(parsed.action)
  }

  // Answer in the language the site will be in once these actions land, not
  // the one it was in when the visitor hit send — otherwise "switch to
  // Spanish" gets confirmed in English on a page that is now Spanish.
  const languageChange = actions.find((action) => action.name === 'setLanguage')
  const replyLanguage = languageChange
    ? (languageChange.input as { language: Language }).language
    : language

  return {
    actions,
    reply:
      matched.length > 0
        ? matched.map((rule) => rule.reply[replyLanguage]).join(' ')
        : NO_MATCH[replyLanguage],
  }
}
