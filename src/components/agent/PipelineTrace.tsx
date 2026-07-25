import { PIPELINE_STAGES, type PipelineStage } from '@/agent/useAgent'
import { useT } from '@/i18n'
import { ui } from '@/content/ui'

const STAGE_LABELS: Record<PipelineStage, { en: string; es: string }> = {
  route: { en: 'route', es: 'router' },
  plan: { en: 'plan', es: 'plan' },
  resolve: { en: 'resolve', es: 'resolver' },
  execute: { en: 'execute', es: 'ejecutar' },
  present: { en: 'present', es: 'presentar' },
}

/**
 * The pipeline readout.
 *
 * This shows the request's actual position in `useAgent`'s flow, so it is a
 * trace rather than a loading animation — which is the whole reason it is on
 * screen. `aria-live="polite"` announces stage changes without stealing focus.
 */
export function PipelineTrace({ stage }: { stage: PipelineStage | null }) {
  const { t } = useT()
  const activeIndex = stage ? PIPELINE_STAGES.indexOf(stage) : -1

  return (
    <div
      className="flex items-center gap-1 overflow-x-auto py-1"
      aria-live="polite"
      aria-label={t(ui.agent.pipelineLabel)}
    >
      {PIPELINE_STAGES.map((s, index) => {
        const isActive = index === activeIndex

        return (
          <div key={s} className="flex shrink-0 items-center gap-1">
            {/* Only two text treatments, both above 4.5:1 in either theme.
                Fading out the pending stages was the obvious design, but no
                opacity both reads as "dimmer" and clears AA in light mode —
                so the caret carries the state instead, which also keeps it
                from being signalled by colour alone. */}
            <span
              className={[
                'font-mono text-[10px] tracking-wide uppercase transition-colors duration-200',
                isActive ? 'text-accent' : 'text-muted',
              ].join(' ')}
            >
              <span
                className={isActive ? 'mr-1 inline-block animate-pulse' : 'sr-only'}
                aria-hidden={!isActive}
              >
                ▸
              </span>
              {t(STAGE_LABELS[s])}
            </span>
            {index < PIPELINE_STAGES.length - 1 && (
              <span className="text-muted text-[10px] opacity-40" aria-hidden="true">
                ·
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
