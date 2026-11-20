import { Suspense, useEffect, useRef } from 'react'
import { UIProvider, useUIState } from '@/store/ui'
import { useT } from '@/i18n'
import { ui } from '@/content/ui'
import { Nav } from '@/components/layout/Nav'
import { Hero } from '@/components/sections/Hero'
import { Work } from '@/components/sections/Work'
import { Experience } from '@/components/sections/Experience'
import { Skills } from '@/components/sections/Skills'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { AgentConsole } from '@/components/agent/AgentConsole'
import { DeepDivePages } from '@/components/pages/registry'
import { deepDives, type PageId } from '@/content/pages'

/**
 * Scrolls when a navigation is *requested*, not when one is merely observed.
 * The nonce is what separates the two — see `UIState.navigationNonce`.
 */
function useNavigationEffect() {
  const { activeSection, navigationNonce, page } = useUIState()
  const lastNonce = useRef(navigationNonce)
  const lastPage = useRef<PageId>(page)

  useEffect(() => {
    const pageChanged = page !== lastPage.current
    lastPage.current = page

    if (navigationNonce === lastNonce.current) return
    lastNonce.current = navigationNonce

    // Opening an in-depth page starts at its top, like any other page load.
    if (page !== 'home') {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    // Arriving from another page there is nothing on screen to scroll *from*;
    // a smooth scroll would animate through half the home page first.
    document
      .getElementById(activeSection)
      ?.scrollIntoView({ behavior: pageChanged ? 'instant' : 'smooth', block: 'start' })
  }, [activeSection, navigationNonce, page])
}

/** The title in index.html belongs to the home page; in-depth pages get their own. */
const HOME_TITLE = typeof document === 'undefined' ? '' : document.title

function useDocumentTitle() {
  const { page } = useUIState()
  const { t } = useT()

  useEffect(() => {
    document.title =
      page === 'home' ? HOME_TITLE : `${t(deepDives[page].title)} · Gisella Gonzalez`
  }, [page, t])
}

/**
 * A note for whoever opens DevTools — which, on this particular site, is most
 * of the audience worth talking to.
 */
function useConsoleGreeting() {
  useEffect(() => {
    const accent = 'color:#FF9200;font-weight:bold'
    const muted = 'color:#9AA7B8'

    console.log('%c▶ G.KALLISTI', accent)
    console.log(
      '%cYou opened the console. Good instinct.\n' +
        'The assistant on this page is real — it validates every action against a Zod\n' +
        'schema before touching the UI, and the same schema generates the function\n' +
        'definitions the model sees. Source: github.com/GKallisti',
      muted,
    )
  }, [])
}

function Page() {
  const { t } = useT()
  const { page } = useUIState()
  useNavigationEffect()
  useDocumentTitle()
  useConsoleGreeting()

  const DeepDive = page === 'home' ? null : DeepDivePages[page]

  return (
    <>
      <a
        href={DeepDive ? '#content' : '#work'}
        className="bg-accent text-on-accent sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:px-4 focus:py-2"
      >
        {t(DeepDive ? ui.controls.skipToContent : ui.nav.work)}
      </a>

      <Nav />

      {DeepDive ? (
        // Keyed by page so moving between the two in-depth pages remounts
        // cleanly instead of reconciling one long document into the other.
        <main id="content" key={page}>
          {/* A bare min-height rather than a spinner: the chunks are small, and
              a flashing loader reads worse than a beat of empty page. */}
          <Suspense fallback={<div className="min-h-[80dvh]" />}>
            <DeepDive />
          </Suspense>
        </main>
      ) : (
        <main>
          <Hero />
          <Work />
          <Experience />
          <Skills />
          <About />
          <Contact />
        </main>
      )}

      <footer className="border-border text-muted mx-auto max-w-5xl border-t px-6 py-10 text-xs sm:px-8">
        <p>{t(ui.footer.builtWith)}</p>
      </footer>

      <AgentConsole />
    </>
  )
}

export default function App() {
  return (
    <UIProvider>
      <Page />
    </UIProvider>
  )
}
