import { useEffect, useRef, useState } from 'react'
import { Section, SectionHeading } from '@/components/layout/Section'
import { profile } from '@/content/profile'
import { useT } from '@/i18n'
import { ui } from '@/content/ui'
import { useUIState } from '@/store/ui'

const LINKS = [
  { label: 'GitHub', href: profile.github },
  { label: 'LinkedIn', href: profile.linkedin },
] as const

/** How long the agent's pointer at the CV stays lit. */
const CV_HIGHLIGHT_MS = 2600

export function Contact() {
  const { t, language } = useT()
  const { cvNonce } = useUIState()

  const otherLanguage = language === 'en' ? 'es' : 'en'
  const [cvHighlighted, setCVHighlighted] = useState(false)

  // Driven by the nonce, not by a boolean in the store: the highlight is a
  // transient piece of presentation, and expiring it here keeps a timer out of
  // the reducer, which has to stay pure.
  const seenNonce = useRef(cvNonce)
  useEffect(() => {
    if (cvNonce === seenNonce.current) return
    seenNonce.current = cvNonce

    setCVHighlighted(true)
    const timer = setTimeout(() => setCVHighlighted(false), CV_HIGHLIGHT_MS)
    return () => clearTimeout(timer)
  }, [cvNonce])

  return (
    <Section id="contact">
      <SectionHeading index="05">{t(ui.sections.contactTitle)}</SectionHeading>
      <p className="text-muted mb-8 max-w-xl">{t(ui.sections.contactLead)}</p>

      {/* Email over a contact form on purpose: a form needs a mail service and
          a spam story, and gives the visitor nothing the address doesn't. */}
      <a
        href={`mailto:${profile.email}`}
        className="text-accent inline-block font-mono text-lg break-all hover:underline sm:text-2xl"
      >
        {profile.email}
      </a>

      {/* `download` rather than a plain link: Chrome and Firefox render a PDF
          inline and leave the visitor on a viewer with a machine-named tab,
          which is a worse place to be than with the file already saved. */}
      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
        <a
          href={t(profile.cv)}
          download={t(profile.cvFilename)}
          className={[
            'bg-accent text-on-accent inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium',
            // Same reasoning as the project cards: only the highlight
            // properties transition, never `all`, or the button keeps the old
            // theme's colours after a palette change.
            'transition-[box-shadow,transform] duration-300 hover:scale-[1.02]',
            cvHighlighted ? 'glow-accent' : '',
          ].join(' ')}
        >
          <span aria-hidden="true">↓</span>
          {t(ui.cv.download)}
        </a>

        <span className="text-muted font-mono text-xs">{t(ui.cv.format)}</span>

        <a
          href={profile.cv[otherLanguage]}
          download={profile.cvFilename[otherLanguage]}
          hrefLang={otherLanguage}
          className="text-muted hover:text-accent text-sm underline underline-offset-4 transition-colors"
        >
          {t(ui.cv.otherLanguage)}
        </a>
      </div>

      <ul className="mt-8 flex flex-wrap gap-3">
        {LINKS.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="border-border-interactive hover:border-accent hover:text-accent inline-block rounded-lg border px-4 py-2 text-sm transition-colors"
            >
              {link.label} ↗
            </a>
          </li>
        ))}
      </ul>

      <p className="text-muted mt-8 font-mono text-xs">{t(profile.location)}</p>
    </Section>
  )
}
