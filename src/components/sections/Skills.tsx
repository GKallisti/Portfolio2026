import { Section, SectionHeading } from '@/components/layout/Section'
import { skillGroups } from '@/content/profile'
import { useT } from '@/i18n'
import { ui } from '@/content/ui'

export function Skills() {
  const { t } = useT()

  return (
    <Section id="skills">
      <SectionHeading index="03">{t(ui.sections.skillsTitle)}</SectionHeading>

      <div className="grid gap-6 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <div key={group.id} className="bg-surface rounded-xl border p-5">
            <h3 className="text-accent mb-3 font-mono text-xs tracking-wide uppercase">
              {t(group.label)}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="border-border rounded-full border px-2.5 py-1 text-xs"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
