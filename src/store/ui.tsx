import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import { ACCENTS, THEMES, type Accent, type Action, type SectionId, type Theme } from '@/agent/catalog'
import { LANGUAGES, type Language, type ProjectDomain } from '@/content/types'

/**
 * The UI store is the agent's execution target. Every action in the catalog
 * lands here through `applyAction`, which is a pure function — the agent, the
 * keyboard shortcuts and the ordinary buttons all go through the same path, so
 * there is no "agent-only" code path that can drift from what a human can do.
 */

export interface ProjectFilter {
  domain: ProjectDomain | null
  stack: string[]
}

export interface UIState {
  theme: Theme
  accent: Accent
  language: Language
  effects: boolean
  filter: ProjectFilter
  highlightedProject: string | null
  activeSection: SectionId
  /** Whether the hidden project has been found. Not persisted — the fun is
   *  in finding it again, and a stale unlock makes the site look ordinary. */
  secretUnlocked: boolean
  /**
   * Bumped only by an explicit `navigateTo`, never by the scroll observer.
   * Without it, scrolling would look identical to a navigation request and the
   * two would fight each other in a loop.
   */
  navigationNonce: number
}

const EMPTY_FILTER: ProjectFilter = { domain: null, stack: [] }

/** Only the durable preferences are persisted; filters are per-visit. */
const PERSISTED_KEYS = ['theme', 'accent', 'language', 'effects'] as const
const STORAGE_KEY = 'gk-portfolio-ui'

export function applyAction(state: UIState, action: Action): UIState {
  switch (action.name) {
    case 'setTheme':
      return { ...state, theme: action.input.theme }

    case 'setAccent':
      return { ...state, accent: action.input.accent }

    case 'setLanguage':
      return { ...state, language: action.input.language }

    case 'filterProjects':
      return {
        ...state,
        filter: { domain: action.input.domain, stack: action.input.stack },
      }

    case 'clearFilters':
      return { ...state, filter: EMPTY_FILTER, highlightedProject: null }

    case 'navigateTo':
      return {
        ...state,
        activeSection: action.input.section,
        navigationNonce: state.navigationNonce + 1,
      }

    case 'highlightProject':
      // Highlighting is only useful if the visitor can see it happen, so this
      // also navigates to the work section.
      return {
        ...state,
        highlightedProject: action.input.projectId,
        activeSection: 'work',
        navigationNonce: state.navigationNonce + 1,
      }

    case 'setEffects':
      return { ...state, effects: action.input.enabled }

    case 'revealSecret':
      // Also navigates, so the unlock is visible rather than silently
      // changing a list the visitor is not currently looking at.
      return {
        ...state,
        secretUnlocked: true,
        highlightedProject: 'arg-idle',
        activeSection: 'work',
        navigationNonce: state.navigationNonce + 1,
      }
  }
}

/** Internal events that are not part of the agent's surface. */
type InternalEvent =
  | { type: 'agent-action'; action: Action }
  | { type: 'observed-section'; section: SectionId }
  | { type: 'clear-highlight' }

function reducer(state: UIState, event: InternalEvent): UIState {
  switch (event.type) {
    case 'agent-action':
      return applyAction(state, event.action)
    case 'observed-section':
      // Scroll position updating the nav, not a navigation request.
      return state.activeSection === event.section
        ? state
        : { ...state, activeSection: event.section }
    case 'clear-highlight':
      return { ...state, highlightedProject: null }
  }
}

/**
 * Reads stored preferences, discarding anything that is no longer a valid
 * value. A returning visitor can be carrying an accent or theme that has since
 * been renamed or removed; without this check that survives into the store and
 * the page renders with a colour no stylesheet defines.
 */
function readPreferences(): Partial<UIState> {
  if (typeof window === 'undefined') return {}

  const valid: Record<(typeof PERSISTED_KEYS)[number], (value: unknown) => boolean> = {
    theme: (v) => THEMES.includes(v as Theme),
    accent: (v) => ACCENTS.includes(v as Accent),
    language: (v) => LANGUAGES.includes(v as Language),
    effects: (v) => typeof v === 'boolean',
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown>

    return Object.fromEntries(
      PERSISTED_KEYS.filter((k) => k in parsed && valid[k](parsed[k])).map((k) => [
        k,
        parsed[k],
      ]),
    ) as Partial<UIState>
  } catch {
    // A corrupt or unreadable preference blob should never block the page.
    return {}
  }
}

function initialState(): UIState {
  const prefersLight =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: light)').matches

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const browserLanguage: Language =
    typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('es')
      ? 'es'
      : 'en'

  return {
    theme: prefersLight ? 'light' : 'dark',
    accent: 'orange',
    language: browserLanguage,
    // Someone who asked their OS for less motion did not ask for scanlines.
    effects: !prefersReducedMotion,
    filter: EMPTY_FILTER,
    highlightedProject: null,
    activeSection: 'home',
    navigationNonce: 0,
    secretUnlocked: false,
    ...readPreferences(),
  }
}

interface UIContextValue {
  state: UIState
  /** Runs a validated catalog action. Used by the agent and by the chrome. */
  run: (action: Action) => void
  observeSection: (section: SectionId) => void
  clearHighlight: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  const run = useCallback((action: Action) => {
    dispatch({ type: 'agent-action', action })
  }, [])

  const observeSection = useCallback((section: SectionId) => {
    dispatch({ type: 'observed-section', section })
  }, [])

  const clearHighlight = useCallback(() => {
    dispatch({ type: 'clear-highlight' })
  }, [])

  // Reflect state onto the document so CSS can react to it.
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = state.theme
    root.dataset.accent = state.accent
    root.dataset.fx = state.effects ? 'on' : 'off'
    root.lang = state.language
  }, [state.theme, state.accent, state.effects, state.language])

  // Freeze transitions across a palette change. See the matching CSS rule:
  // a transition on a variable-derived colour never re-targets, so without
  // this the old colour sticks. Two rAFs so the release lands after the
  // browser has recalculated style with the new palette.
  const previousPalette = useRef(`${state.theme}:${state.accent}`)
  useEffect(() => {
    const palette = `${state.theme}:${state.accent}`
    if (palette === previousPalette.current) return
    previousPalette.current = palette

    const root = document.documentElement
    root.dataset.themeSwitching = ''

    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        delete root.dataset.themeSwitching
      })
    })

    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
      delete root.dataset.themeSwitching
    }
  }, [state.theme, state.accent])

  // Destructured so the dependency list is exactly the persisted set — reading
  // `state[k]` inside the effect would work but leaves the linter unable to
  // verify that, and a later field added to PERSISTED_KEYS would silently stop
  // triggering a save.
  const { theme, accent, language, effects } = state
  useEffect(() => {
    const toPersist: Pick<UIState, (typeof PERSISTED_KEYS)[number]> = {
      theme,
      accent,
      language,
      effects,
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist))
    } catch {
      // Private browsing or a full quota; preferences just will not persist.
    }
  }, [theme, accent, language, effects])

  const value = useMemo<UIContextValue>(
    () => ({ state, run, observeSection, clearHighlight }),
    [state, run, observeSection, clearHighlight],
  )

  return <UIContext value={value}>{children}</UIContext>
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>')
  return ctx
}

export function useUIState(): UIState {
  return useUI().state
}
