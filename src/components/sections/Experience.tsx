import { Section, SectionHeading } from '@/components/layout/Section'
import { experience } from '@/content/profile'
import { useT } from '@/i18n'
import { ui } from '@/content/ui'

export function Experience() {
  const { t } = useT()

  return (
    <Section id="experience">
      <SectionHeading index="02">{t(ui.sections.experienceTitle)}</SectionHeading>

      <ol className="border-border space-y-12 border-l pl-6">
        {experience.map((entry) => (
          <li key={entry.id} className="relative">
            <span
              className="bg-accent absolute top-2 -left-[1.79rem] h-2.5 w-2.5 rounded-full"
              aria-hidden="true"
            />

            <p className="text-muted font-mono text-xs">{t(entry.period)}</p>
            <h3 className="mt-1 text-lg font-semibold">{t(entry.role)}</h3>
            <p className="text-accent text-sm">{t(entry.company)}</p>
            <p className="text-muted mt-3 leading-relaxed">{t(entry.summary)}</p>

            <ul className="mt-4 space-y-2">
              {t(entry.highlights).map((point, index) => (
                <li key={index} className="flex gap-3 leading-relaxed">
                  <span className="text-accent shrink-0" aria-hidden="true">
                    ▸
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-4 flex flex-wrap gap-1.5">
              {entry.stack.map((tech) => (
                <li
                  key={tech}
                  className="border-border text-muted rounded-full border px-2.5 py-0.5 font-mono text-[11px]"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  )
}
