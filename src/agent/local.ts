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
    patterns: [/\b(experience|experiencia|cv|resume|curriculum)\b/],
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
  {
    // Offline, the hint is all we can offer — the local router has no way to
    // judge whether someone has "earned" it, so it points and steps back.
    patterns: [
      /\b(cheat|code|codigo|truco|trucos|secret|secreto|konami|abacabb)\b/,
      /\b(hidden|oculto|escondido)\b/,
    ],
    action: null,
    reply: {
      en: 'Two of them work here. One is the code everybody tries on everything. The other is seven letters, and if you played Mortal Kombat on a Genesis you already know it. Type either one anywhere on the page.',
      es: 'Acá funcionan dos. Uno es el código que todo el mundo prueba en todos lados. El otro son siete letras, y si jugaste Mortal Kombat en una Genesis ya lo sabés. Escribí cualquiera de los dos en cualquier parte de la página.',
    },
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
