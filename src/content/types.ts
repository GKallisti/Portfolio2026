/**
 * Content types.
 *
 * Every piece of copy is a `Localized<T>` rather than living in two parallel
 * dictionaries. The compiler then makes a missing translation a build error
 * instead of a blank space someone notices in production.
 */

export const LANGUAGES = ['en', 'es'] as const
export type Language = (typeof LANGUAGES)[number]

export type Localized<T = string> = Record<Language, T>

/**
 * Copy that may or may not need translating. Proper nouns stay plain strings;
 * anything with real words gets a `Localized`. `resolve()` in `@/i18n` accepts
 * either, so neither case needs a cast at the call site.
 */
export type MaybeLocalized = string | Localized

/** Broad buckets used by the agent's `filterProjects` tool. */
export const PROJECT_DOMAINS = ['ai', 'fullstack', 'mobile', 'web'] as const
export type ProjectDomain = (typeof PROJECT_DOMAINS)[number]

/**
 * `demonstrated` is deliberately distinct from `production`: work that was
 * built, finished and shown to clients, but not adopted. Calling that
 * "production" would be a claim she'd have to walk back in an interview.
 */
export type ProjectStatus = 'production' | 'demonstrated' | 'in-progress' | 'archived'

export interface Project {
  id: string
  /** Proper nouns stay plain; descriptive titles get translated. */
  name: MaybeLocalized
  tagline: Localized
  description: Localized
  /** Longer copy shown when a card is expanded or the agent explains it. */
  detail: Localized
  domains: ProjectDomain[]
  stack: string[]
  status: ProjectStatus
  year: string
  /** Absent when the work is under client confidentiality. */
  href?: string
  repo?: string
  /** Direct download/install page, for projects that ship an app. */
  download?: string
  /** Shown in place of links when there is nothing public to point at. */
  confidentialNote?: Localized
  featured: boolean
  /** Hidden until an easter egg unlocks it. Never listed by default. */
  secret?: boolean
}

export interface ExperienceEntry {
  id: string
  role: Localized
  company: MaybeLocalized
  period: Localized
  summary: Localized
  highlights: Localized<string[]>
  stack: string[]
}

export interface Credential {
  id: string
  name: string
  issuer: string
  year: string
  /** Marks things not yet completed so they never read as finished. */
  pending?: boolean
}

export interface EducationEntry {
  id: string
  degree: Localized
  institution: string
  period: Localized
  inProgress?: boolean
}

export interface SkillGroup {
  id: string
  label: Localized
  items: string[]
}
