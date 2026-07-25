import { Section, SectionHeading } from '@/components/layout/Section'
import { profile } from '@/content/profile'
import { useT } from '@/i18n'
import { ui } from '@/content/ui'

const LINKS = [
  { label: 'GitHub', href: profile.github },
  { label: 'LinkedIn', href: profile.linkedin },
] as const

export function Contact() {
  const { t } = useT()

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
