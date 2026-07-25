import { useEffect, useMemo, useRef, useState } from 'react'
import { Section, SectionHeading } from '@/components/layout/Section'
import { projects } from '@/content/projects'
import type { Project } from '@/content/types'
import { useT } from '@/i18n'
import { ui } from '@/content/ui'
import { useUI } from '@/store/ui'

function ProjectCard({
  project,
  highlighted,
}: {
  project: Project
  highlighted: boolean
}) {
  const { t } = useT()
  const [expanded, setExpanded] = useState(false)
  const ref = useRef<HTMLElement>(null)

  // When the agent highlights a project, open it and bring it into view.
  useEffect(() => {
    if (!highlighted) return
    setExpanded(true)
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [highlighted])

  return (
    <article
      ref={ref}
      className={[
        // Only the highlight properties transition. `transition-all` looks
        // harmless here but breaks theme switching: a transition on a
        // background-color that comes from a custom property gets stuck on the
        // old colour when the variable changes, so cards keep the previous
        // theme's surface until something forces a repaint.
        'bg-surface rounded-xl border p-6 transition-[border-color,box-shadow] duration-300',
        highlighted ? 'border-accent glow-accent' : 'border-border',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="flex items-center gap-2 text-xl font-semibold">
          {project.secret && (
            <span className="text-pixel text-accent text-[9px]" aria-hidden="true">
              ★
            </span>
          )}
          {t(project.name)}
        </h3>
        <span className="text-muted font-mono text-xs">
          {t(ui.projects.status[project.status])} · {project.year}
        </span>
      </div>

      <p className="text-accent mt-2 text-sm">{t(project.tagline)}</p>
      <p className="mt-3 leading-relaxed">{t(project.description)}</p>

      {expanded && (
        <p className="text-muted mt-4 leading-relaxed">{t(project.detail)}</p>
      )}

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="border-border text-muted rounded-full border px-2.5 py-0.5 font-mono text-[11px]"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="text-accent hover:underline"
        >
          {t(expanded ? ui.projects.readLess : ui.projects.readMore)}
        </button>

        {project.download && (
          <a
            href={project.download}
            target="_blank"
            rel="noreferrer noopener"
            className="text-accent hover:underline"
          >
            {t(ui.projects.download)} ↗
          </a>
        )}

        {project.href && (
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted hover:text-text transition-colors"
          >
            {t(ui.projects.visit)} ↗
          </a>
        )}

        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted hover:text-text transition-colors"
          >
            {t(ui.projects.source)} ↗
          </a>
        )}

        {project.confidentialNote && (
          <span className="text-muted text-xs italic">
            {t(project.confidentialNote)}
          </span>
        )}
      </div>
    </article>
  )
}

export function Work() {
  const { t } = useT()
  const { state, run } = useUI()
  const { filter, highlightedProject } = state

  const visible = useMemo(() => {
    return projects.filter((project) => {
      if (project.secret && !state.secretUnlocked) return false
      if (filter.domain && !project.domains.includes(filter.domain)) return false
      if (filter.stack.length > 0) {
        const stack = project.stack.map((s) => s.toLowerCase())
        const matches = filter.stack.some((wanted) =>
          stack.some((tech) => tech.includes(wanted.toLowerCase())),
        )
        if (!matches) return false
      }
      return true
    })
  }, [filter, state.secretUnlocked])

  const isFiltered = filter.domain !== null || filter.stack.length > 0

  return (
    <Section id="work">
      <SectionHeading index="01">{t(ui.sections.workTitle)}</SectionHeading>
      <p className="text-muted mb-8 max-w-2xl">{t(ui.sections.workLead)}</p>

      {isFiltered && (
        <div className="border-accent/40 mb-6 flex flex-wrap items-center gap-3 rounded-lg border px-4 py-2 text-sm">
          <span className="text-accent font-mono text-xs uppercase">
            {t(ui.projects.filtered)}
          </span>
          <span className="text-muted">
            {[filter.domain, ...filter.stack].filter(Boolean).join(' · ')}
          </span>
          <button
            type="button"
            onClick={() => run({ name: 'clearFilters', input: {} })}
            className="text-accent ml-auto hover:underline"
          >
            {t(ui.projects.clearFilter)}
          </button>
        </div>
      )}

      {visible.length === 0 ? (
        <p className="text-muted">{t(ui.projects.noMatches)}</p>
      ) : (
        <div className="grid gap-5">
          {visible.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              highlighted={highlightedProject === project.id}
            />
          ))}
        </div>
      )}
    </Section>
  )
}
