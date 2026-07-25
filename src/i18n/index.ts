import { useCallback } from 'react'
import { useUIState } from '@/store/ui'
import type { Language, Localized, MaybeLocalized } from '@/content/types'

/**
 * There is no i18n library here on purpose: two languages of static content
 * are better served by `Localized<T>` objects the compiler can check than by a
 * runtime key lookup that fails silently when a key is missing.
 */

function isLocalized(value: unknown): value is Localized<unknown> {
  return typeof value === 'object' && value !== null && 'en' in value && 'es' in value
}

/** Resolves a `Localized<T>` — or a plain proper noun — for a language. */
export function resolve<T>(value: Localized<T> | T, language: Language): T {
  return isLocalized(value) ? (value[language] as T) : (value as T)
}

/** Hook form: resolves against the language currently in the UI store. */
export function useT() {
  const { language } = useUIState()

  const t = useCallback(
    <T,>(value: Localized<T> | T): T => resolve(value, language),
    [language],
  )

  return { t, language }
}

export type { Language, Localized, MaybeLocalized }
