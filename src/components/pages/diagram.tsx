import { useContext, useId, type ReactNode } from 'react'
import { MarkerContext, TECHS, TechContext, type Tech } from './tech'
import { useT } from '@/i18n'
import { ui } from '@/content/ui'

/**
 * Hand-drawn SVG diagrams, coloured entirely from the site's tokens.
 *
 * Every fill and stroke is a Tailwind utility over a `--c-*` variable, never a
 * literal colour, so the diagrams follow the theme toggle and all five accents
 * the same way the rest of the page does. Coordinates are in viewBox units;
 * the drawing scales with its container.
 *
 * `Box` and `Arrow` must stay direct children of `<Diagram>`: the highlight
 * rules in index.css select `.diagram > *`.
 */

export function Diagram({
  width,
  height,
  label,
  children,
}: {
  width: number
  height: number
  /** Read out instead of the drawing's text, so it has to stand on its own. */
  label: string
  children: ReactNode
}) {
  // React's ids can carry characters that are awkward inside url(#…).
  const base = `d${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const markers = { plain: `${base}-head`, accent: `${base}-head-accent` }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className="diagram block h-auto w-full min-w-[44rem] font-mono"
    >
      <defs>
        <marker
          id={markers.plain}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" className="fill-muted" />
        </marker>
        <marker
          id={markers.accent}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" className="fill-accent" />
        </marker>
      </defs>
      <MarkerContext value={markers}>{children}</MarkerContext>
    </svg>
  )
}

type Tone = 'plain' | 'accent' | 'store' | 'group' | 'pending'

const RECT_CLASS: Record<Tone, string> = {
  plain: 'fill-raised stroke-border-interactive',
  accent: 'fill-accent/10 stroke-accent',
  store: 'fill-raised stroke-muted',
  group: 'fill-none stroke-border-interactive',
  pending: 'fill-none stroke-accent',
}

export function Box({
  x,
  y,
  w,
  h,
  title,
  sub,
  caption,
  tone = 'plain',
  tech,
  layout = 'stack',
  titleSize = 11.5,
  subSize = 9.5,
  rx = 6,
}: {
  x: number
  y: number
  w: number
  h: number
  title?: string
  /** One or more secondary lines under the title. */
  sub?: string | string[]
  /** Small caps label in the top-left corner — used by groups. */
  caption?: string
  tone?: Tone
  tech?: Tech
  /** `row` puts the title on the left and the first sub on the right. */
  layout?: 'stack' | 'row'
  titleSize?: number
  subSize?: number
  rx?: number
}) {
  const active = useContext(TechContext)
  const subs = sub === undefined ? [] : Array.isArray(sub) ? sub : [sub]
  const cx = x + w / 2
  const cy = y + h / 2

  let text: ReactNode = null

  if (layout === 'row') {
    text = (
      <>
        {title && (
          <text x={x + 10} y={cy + titleSize * 0.35} fontSize={titleSize} fontWeight={600} className="fill-text">
            {title}
          </text>
        )}
        {subs[0] && (
          <text
            x={x + w - 10}
            y={cy + subSize * 0.35}
            fontSize={subSize}
            textAnchor="end"
            className="fill-muted"
          >
            {subs[0]}
          </text>
        )}
      </>
    )
  } else {
    // Centre the block of lines as a whole, then place each baseline inside
    // it. 0.72em approximates the cap height of the mono face.
    const lines = [
      ...(title ? [{ text: title, size: titleSize, strong: true }] : []),
      ...subs.map((s) => ({ text: s, size: subSize, strong: false })),
    ]
    const gap = 5
    const total = lines.reduce((sum, line) => sum + line.size * 0.72, 0) + gap * (lines.length - 1)
    let cursor = cy - total / 2

    text = lines.map((line, i) => {
      cursor += line.size * 0.72
      const baseline = cursor
      cursor += gap
      return (
        <text
          key={i}
          x={cx}
          y={baseline}
          fontSize={line.size}
          fontWeight={line.strong ? 600 : 400}
          textAnchor="middle"
          className={line.strong ? 'fill-text' : 'fill-muted'}
        >
          {line.text}
        </text>
      )
    })
  }

  return (
    <g data-tech={tech} data-hl={tech && active === tech ? '' : undefined}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        className={`diagram-box ${RECT_CLASS[tone]}`}
        strokeWidth={tone === 'accent' || tone === 'store' || tone === 'pending' ? 1.5 : 1.25}
        strokeDasharray={tone === 'group' ? '4 3' : tone === 'pending' ? '5 4' : undefined}
      />
      {/* A second rule under the top edge: the one cue that says "data store"
          without drawing a cylinder that would not fit the labels. */}
      {tone === 'store' && (
        <line x1={x + 1} x2={x + w - 1} y1={y + 5} y2={y + 5} className="stroke-muted" strokeWidth={1} />
      )}
      {caption && (
        <text x={x + 10} y={y + 15} fontSize={8.5} letterSpacing={1.2} className="fill-muted">
          {caption.toUpperCase()}
        </text>
      )}
      {text}
    </g>
  )
}

export function Arrow({
  d,
  tone = 'plain',
  dashed = false,
  head = true,
}: {
  d: string
  tone?: 'plain' | 'accent'
  dashed?: boolean
  head?: boolean
}) {
  const markers = useContext(MarkerContext)
  return (
    <path
      d={d}
      className={`fill-none ${tone === 'accent' ? 'stroke-accent' : 'stroke-muted'}`}
      strokeWidth={tone === 'accent' ? 1.6 : 1.2}
      strokeDasharray={dashed ? '5 4' : undefined}
      markerEnd={head ? `url(#${tone === 'accent' ? markers.accent : markers.plain})` : undefined}
    />
  )
}

export function Label({
  x,
  y,
  children,
  anchor = 'start',
  tone = 'muted',
  size = 9.5,
  caps = false,
}: {
  x: number
  y: number
  children: string
  anchor?: 'start' | 'middle' | 'end'
  tone?: 'muted' | 'accent' | 'text'
  size?: number
  caps?: boolean
}) {
  const toneClass = tone === 'accent' ? 'fill-accent' : tone === 'text' ? 'fill-text' : 'fill-muted'
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      textAnchor={anchor}
      letterSpacing={caps ? 1.2 : undefined}
      className={toneClass}
    >
      {caps ? children.toUpperCase() : children}
    </text>
  )
}

/** The chip row that singles out one technology across every diagram. */
export function TechBar({
  active,
  onChange,
}: {
  active: Tech | null
  onChange: (tech: Tech | null) => void
}) {
  const { t } = useT()

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <p className="text-muted shrink-0 font-mono text-[11px] tracking-widest uppercase">
        {t(ui.deepDive.highlight)}
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        {TECHS.map((tech) => (
          <button
            key={tech.id}
            type="button"
            aria-pressed={active === tech.id}
            onClick={() => onChange(active === tech.id ? null : tech.id)}
            className={[
              'rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors',
              active === tech.id
                ? 'bg-accent border-accent text-on-accent'
                : 'border-border text-muted hover:border-border-interactive hover:text-text',
            ].join(' ')}
          >
            {tech.label}
          </button>
        ))}
        {active && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-accent px-1.5 font-mono text-[11px] hover:underline"
          >
            {t(ui.deepDive.clearHighlight)}
          </button>
        )}
      </div>
    </div>
  )
}
