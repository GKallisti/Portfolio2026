import { Section, SectionHeading } from '@/components/layout/Section'
import { credentials, education, profile } from '@/content/profile'
import { useT } from '@/i18n'
import { ui } from '@/content/ui'

export function About() {
  const { t } = useT()

  return (
    <Section id="about">
      <SectionHeading index="04">{t(ui.sections.aboutTitle)}</SectionHeading>

      <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4 text-base leading-relaxed">
          {profile.photo && (
            <img
              src={profile.photo}
              alt={t(profile.photoAlt)}
              width={160}
              height={160}
              loading="lazy"
              // Hides itself if the file is missing, rather than leaving a
              // broken-image icon in the middle of the bio.
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
              className="border-border float-right ml-5 mb-3 h-28 w-28 rounded-xl border object-cover sm:h-36 sm:w-36"
            />
          )}
          <p>{t(profile.intro)}</p>
          <p className="text-muted">{t(profile.introSecondary)}</p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-accent mb-3 font-mono text-xs tracking-wide uppercase">
              {t(ui.sections.credentialsTitle)}
            </h3>
            <ul className="space-y-3">
              {credentials.map((credential) => (
                <li key={credential.id} className="text-sm leading-snug">
                  <span>{credential.name}</span>
                  <span className="text-muted block font-mono text-xs">
                    {credential.issuer} ·{' '}
                    {credential.pending ? t(ui.credentials.inPreparation) : credential.year}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-accent mb-3 font-mono text-xs tracking-wide uppercase">
              {t(ui.sections.educationTitle)}
            </h3>
            <ul className="space-y-3">
              {education.map((entry) => (
                <li key={entry.id} className="text-sm leading-snug">
                  <span>{t(entry.degree)}</span>
                  <span className="text-muted block font-mono text-xs">
                    {entry.institution} · {t(entry.period)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  )
}
