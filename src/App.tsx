import { useEffect, useRef } from 'react'
import { UIProvider, useUIState } from '@/store/ui'
import { useSecretCodes } from '@/hooks/useSecretCodes'
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

/**
 * Scrolls when a navigation is *requested*, not when one is merely observed.
 * The nonce is what separates the two — see `UIState.navigationNonce`.
 */
function useNavigationEffect() {
  const { activeSection, navigationNonce } = useUIState()
  const lastNonce = useRef(navigationNonce)

  useEffect(() => {
    if (navigationNonce === lastNonce.current) return
    lastNonce.current = navigationNonce

    document
      .getElementById(activeSection)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [activeSection, navigationNonce])
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
        'definitions the model sees. Source: github.com/GKallisti\n\n' +
        'Two cheat codes unlock something. One you already know.',
      muted,
    )
  }, [])
}

function Page() {
  const { t } = useT()
  useNavigationEffect()
  useSecretCodes()
  useConsoleGreeting()

  return (
    <>
      <a
        href="#work"
        className="bg-accent text-on-accent sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:px-4 focus:py-2"
      >
        {t(ui.nav.work)}
      </a>

      <Nav />

      <main>
        <Hero />
        <Work />
        <Experience />
        <Skills />
        <About />
        <Contact />
      </main>

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
