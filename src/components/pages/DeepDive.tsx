import { useEffect, useRef, useState, type ReactNode } from 'react'
import { deepDiveList, deepDives, type DeepDiveId } from '@/content/pages'
import { PageLink } from '@/components/layout/PageLink'
import { useT } from '@/i18n'
import { ui } from '@/content/ui'
import { useUI } from '@/store/ui'

/**
 * Building blocks for the in-depth pages.
 *
 * Same tokens and type scale as the home page, so an in-depth page reads as
 * part of the site rather than as an embedded document from somewhere else.
 */

export function DeepDiveShell({ page, children }: { page: DeepDiveId; children: ReactNode }) {
  const { t } = useT()
  const { run } = useUI()

  // A direct visit to /enmoto/architecture#sos arrives before this chunk has
  // rendered, so the browser found nothing to scroll to. Do it once mounted —
  // instantly: the page-wide smooth scrolling would animate from the top, and
  // any layout settling underneath (fonts, measured figures) cancels it.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
  }, [])

  const siblings = deepDiveList.filter((p) => p.projectId === deepDives[page].projectId)
  const index = siblings.findIndex((p) => p.id === page)
  const next = siblings[index + 1] ?? null
  const previous = siblings[index - 1] ?? null

  const backToWork = (
    <a
      href="/#work"
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
        event.preventDefault()
        run({ name: 'highlightProject', input: { projectId: deepDives[page].projectId } })
      }}
      className="text-muted hover:text-accent inline-flex items-center gap-2 font-mono text-xs transition-colors"
    >
      <span aria-hidden="true">←</span>
      {t(ui.deepDive.backToWork)}
    </a>
  )

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pb-24 sm:px-8">
      <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
        {backToWork}

        <nav aria-label={t(ui.deepDive.pagesNav)}>
          <ul className="flex flex-wrap gap-2">
            {siblings.map((sibling, i) => (
              <li key={sibling.id}>
                <PageLink
                  page={sibling.id}
                  ariaCurrent={sibling.id === page}
                  className={[
                    'inline-flex items-baseline gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors',
                    sibling.id === page
                      ? 'border-accent text-accent'
                      : 'border-border text-muted hover:border-border-interactive hover:text-text',
                  ].join(' ')}
                >
                  <span className="text-pixel text-[8px]" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {t(sibling.label)}
                </PageLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {children}

      <nav
        aria-label={t(ui.deepDive.pagesNav)}
        className="border-border mt-24 grid gap-4 border-t pt-10 sm:grid-cols-2"
      >
        {previous ? (
          <PagerCard page={previous.id} direction="previous" />
        ) : (
          <div className="hidden sm:block" />
        )}
        {next ? <PagerCard page={next.id} direction="next" /> : <div className="self-center">{backToWork}</div>}
      </nav>
    </div>
  )
}

function PagerCard({ page, direction }: { page: DeepDiveId; direction: 'next' | 'previous' }) {
  const { t } = useT()
  const target = deepDives[page]

  return (
    <PageLink
      page={page}
      className={[
        'group bg-surface border-border hover:border-accent flex flex-col gap-2 rounded-xl border p-5 transition-colors',
        direction === 'next' ? 'sm:col-start-2 sm:text-right' : '',
      ].join(' ')}
    >
      <span className="text-muted font-mono text-[11px] tracking-widest uppercase">
        {direction === 'previous' && <span aria-hidden="true">← </span>}
        {t(direction === 'next' ? ui.deepDive.next : ui.deepDive.previous)}
        {direction === 'next' && <span aria-hidden="true"> →</span>}
      </span>
      <span className="font-display group-hover:text-accent text-xl font-semibold transition-colors">
        {t(target.label)}
      </span>
      <span className="text-muted text-sm leading-snug">{t(target.teaser)}</span>
    </PageLink>
  )
}

export function DeepDiveHeader({
  eyebrow,
  title,
  lead,
  facts,
  children,
}: {
  eyebrow: ReactNode
  title: ReactNode
  lead: ReactNode
  facts?: ReactNode[]
  children?: ReactNode
}) {
  return (
    <header className="pt-14 md:pt-20">
      <p className="text-pixel text-accent text-[10px]">{eyebrow}</p>
      <h1 className="mt-6 max-w-4xl text-4xl leading-[1.05] font-bold sm:text-5xl md:text-6xl">
        {title}
      </h1>
      <p className="text-muted mt-6 max-w-2xl text-lg leading-relaxed">{lead}</p>
      {facts && facts.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-2">
          {facts.map((fact, i) => (
            <li
              key={i}
              className="bg-surface border-border text-muted rounded-full border px-3 py-1 font-mono text-xs"
            >
              {fact}
            </li>
          ))}
        </ul>
      )}
      {children}
    </header>
  )
}

/** A figure in a fact chip: `<Fact n="27">controllers</Fact>`. */
export function Fact({ n, children }: { n: ReactNode; children: ReactNode }) {
  return (
    <>
      <b className="text-text font-semibold">{n}</b> {children}
    </>
  )
}

export function Block({
  id,
  index,
  eyebrow,
  title,
  children,
}: {
  id: string
  index: string
  eyebrow?: ReactNode
  title: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="pt-20 md:scroll-mt-16 md:pt-28">
      <p className="flex items-baseline gap-3">
        <span className="text-pixel text-accent text-[10px]" aria-hidden="true">
          {index}
        </span>
        {eyebrow && <span className="text-muted font-mono text-xs">{eyebrow}</span>}
      </p>
      <h2 id={`${id}-title`} className="mt-3 max-w-3xl text-3xl md:text-4xl">
        {title}
      </h2>
      <div className="mt-8 space-y-6">{children}</div>
    </section>
  )
}

export function Prose({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-3xl space-y-4 leading-relaxed ${className}`}>{children}</div>
}

/** The reasoning behind a decision — the part worth reading twice. */
export function Why({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="border-accent bg-accent/5 rounded-r-xl border-l-2 px-5 py-4">
      <p className="text-accent font-mono text-[11px] font-medium tracking-widest uppercase">
        {label}
      </p>
      <div className="mt-2 space-y-3 leading-relaxed">{children}</div>
    </div>
  )
}

export function Panel({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="bg-surface border-border rounded-xl border px-5 py-4">
      <p className="text-muted font-mono text-[11px] font-medium tracking-widest uppercase">
        {label}
      </p>
      <div className="mt-2 space-y-3 leading-relaxed">{children}</div>
    </div>
  )
}

export function Split({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="bg-raised rounded px-1.5 py-0.5 font-mono text-[0.85em] break-words">
      {children}
    </code>
  )
}

export function DataTable({
  caption,
  head,
  rows,
}: {
  caption: string
  head: ReactNode[]
  rows: ReactNode[][]
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {head.map((cell, i) => (
              <th
                key={i}
                scope="col"
                className="border-border-interactive text-muted border-b-2 py-3 pr-5 font-mono text-[11px] font-medium tracking-widest uppercase"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-border border-b">
              {row.map((cell, c) =>
                c === 0 ? (
                  <th key={c} scope="row" className="w-1/4 py-3.5 pr-5 align-top font-semibold">
                    {cell}
                  </th>
                ) : (
                  <td key={c} className="text-muted py-3.5 pr-5 align-top leading-relaxed">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * A diagram in a card. On narrow screens the drawing keeps a readable size
 * and scrolls sideways instead of shrinking its labels to nothing — and only
 * then does the scroller become a tab stop and show the hint, so a desktop
 * keyboard user is not made to tab through seven inert regions.
 */
export function Figure({
  label,
  caption,
  children,
}: {
  label: string
  caption?: ReactNode
  children: ReactNode
}) {
  const { t } = useT()
  const scroller = useRef<HTMLDivElement>(null)
  const [scrollable, setScrollable] = useState(false)

  useEffect(() => {
    const element = scroller.current
    if (!element) return
    const measure = () => setScrollable(element.scrollWidth > element.clientWidth + 1)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <figure className="bg-surface border-border overflow-hidden rounded-xl border">
      <div
        ref={scroller}
        className="overflow-x-auto p-4 sm:p-6"
        tabIndex={scrollable ? 0 : undefined}
        role={scrollable ? 'region' : undefined}
        aria-label={scrollable ? `${t(ui.deepDive.diagram)}: ${label}` : undefined}
      >
        {children}
      </div>
      {scrollable && (
        <p className="text-muted px-4 pb-3 font-mono text-[11px] sm:px-6" aria-hidden="true">
          ↔ {t(ui.deepDive.swipeHint)}
        </p>
      )}
      {caption && (
        <figcaption className="border-border text-muted border-t px-4 py-4 text-sm leading-relaxed sm:px-6">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
