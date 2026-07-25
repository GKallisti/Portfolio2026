import { useState } from 'react'
import { SECTIONS, type SectionId } from '@/agent/catalog'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { ui } from '@/content/ui'
import { profile } from '@/content/profile'

/** Sections that get a nav link; `home` is reached via the wordmark. */
const NAV_SECTIONS = SECTIONS.filter((s): s is Exclude<SectionId, 'home'> => s !== 'home')

export function Nav() {
  const { state, run } = useUI()
  const { t } = useT()
  const [menuOpen, setMenuOpen] = useState(false)

  const go = (section: SectionId) => {
    run({ name: 'navigateTo', input: { section } })
    setMenuOpen(false)
  }

  return (
    <header className="bg-bg/85 border-border sticky top-0 z-40 border-b backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3 sm:px-8"
      >
        <button
          type="button"
          onClick={() => go('home')}
          className="text-pixel text-accent shrink-0 text-[10px] transition-opacity hover:opacity-80"
        >
          {profile.handle}
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_SECTIONS.map((section) => (
            <li key={section}>
              <button
                type="button"
                onClick={() => go(section)}
                aria-current={state.activeSection === section ? 'true' : undefined}
                className={[
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  state.activeSection === section
                    ? 'text-accent'
                    : 'text-muted hover:text-text',
                ].join(' ')}
              >
                {t(ui.nav[section])}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              run({
                name: 'setLanguage',
                input: { language: state.language === 'en' ? 'es' : 'en' },
              })
            }
            aria-label={t(ui.controls.language)}
            className="text-muted hover:text-text rounded-md px-2 py-1.5 font-mono text-xs uppercase transition-colors"
          >
            {state.language === 'en' ? 'es' : 'en'}
          </button>

          <button
            type="button"
            onClick={() =>
              run({
                name: 'setTheme',
                input: { theme: state.theme === 'dark' ? 'light' : 'dark' },
              })
            }
            aria-label={t(ui.controls.theme)}
            className="text-muted hover:text-text rounded-md px-2 py-1.5 text-sm transition-colors"
          >
            <span aria-hidden="true">{state.theme === 'dark' ? '☀' : '☾'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={t(ui.controls.menu)}
            aria-expanded={menuOpen}
            className="text-muted hover:text-text rounded-md px-2 py-1.5 md:hidden"
          >
            <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <ul className="border-border border-t px-6 pb-3 md:hidden">
          {NAV_SECTIONS.map((section) => (
            <li key={section}>
              <button
                type="button"
                onClick={() => go(section)}
                className="text-muted hover:text-text w-full py-2 text-left text-sm"
              >
                {t(ui.nav[section])}
              </button>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
