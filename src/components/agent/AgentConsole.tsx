import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useAgent } from '@/agent/useAgent'
import { useT } from '@/i18n'
import { ui } from '@/content/ui'
import { PipelineTrace } from './PipelineTrace'

/**
 * The assistant, presented as an arcade console.
 *
 * This is the site's centrepiece: it operates the page rather than describing
 * it. The retro framing is deliberate and skin-deep — pixel type on the label,
 * monospace in the transcript — over an otherwise plain, accessible dialog.
 */
export function AgentConsole() {
  const { t, language } = useT()
  const { messages, stage, busy, send } = useAgent()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Keep the newest turn in view as tokens stream in.
  useEffect(() => {
    const el = transcriptRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, stage])

  // Escape closes and returns focus to the trigger, per dialog convention.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const text = draft
    setDraft('')
    void send(text)
  }

  const ask = (text: string) => {
    setDraft('')
    void send(text)
  }

  const suggestions = ui.agent.suggestions[language]

  if (!open) {
    return (
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t(ui.agent.open)}
        className="bg-accent text-on-accent glow-accent fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full px-5 py-3 font-medium shadow-lg transition-transform hover:scale-105 focus-visible:scale-105"
      >
        <span aria-hidden="true" className="text-pixel text-[10px]">
          ▶
        </span>
        <span className="text-sm">{t(ui.agent.label)}</span>
      </button>
    )
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-label={t(ui.agent.label)}
      className="bg-surface fx-scanlines fixed right-4 bottom-4 z-50 flex max-h-[min(32rem,calc(100dvh-2rem))] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border shadow-2xl"
    >
      <header className="border-border flex items-center justify-between border-b px-4 py-3">
        <div className="flex flex-col gap-1">
          <span className="text-pixel text-accent text-[9px]">
            {t(ui.agent.label).toUpperCase()}
          </span>
          <PipelineTrace stage={stage} />
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            triggerRef.current?.focus()
          }}
          aria-label={t(ui.agent.close)}
          className="text-muted hover:text-text shrink-0 rounded p-1 text-lg leading-none transition-colors"
        >
          ×
        </button>
      </header>

      <div
        ref={transcriptRef}
        className="relative z-1 flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm"
      >
        {messages.length === 0 && (
          <p className="text-muted leading-relaxed">{t(ui.agent.greeting)}</p>
        )}

        {messages.map((message) => (
          <div key={message.id} className={message.role === 'user' ? 'text-right' : ''}>
            <div
              className={[
                'inline-block max-w-[85%] rounded-lg px-3 py-2 text-left',
                message.role === 'user'
                  ? 'bg-accent text-on-accent'
                  : 'bg-raised text-text font-mono text-[13px] leading-relaxed',
              ].join(' ')}
            >
              {message.text || (
                <span className="text-muted">{t(ui.agent.thinking)}…</span>
              )}
            </div>

            {message.actions && message.actions.length > 0 && (
              <ul className="mt-1 flex flex-wrap gap-1">
                {message.actions.map((action, index) => (
                  <li
                    key={`${action.name}-${index}`}
                    className={[
                      'rounded border px-2 py-0.5 font-mono text-[10px]',
                      action.ok
                        ? 'border-accent/40 text-accent'
                        : 'border-muted/40 text-muted',
                    ].join(' ')}
                    title={action.error}
                  >
                    {action.ok ? '✓' : '✕'} {action.name}
                  </li>
                ))}
              </ul>
            )}

            {message.failure && (
              <p className="text-muted mt-1 text-xs">
                {t(
                  message.failure === 'rate_limited'
                    ? ui.agent.rateLimited
                    : message.failure === 'error'
                      ? ui.agent.error
                      : ui.agent.offline,
                )}
              </p>
            )}
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="relative z-1 flex flex-wrap gap-1.5 px-4 pb-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => ask(suggestion)}
              className="border-border-interactive text-muted hover:border-accent hover:text-accent rounded-full border px-3 py-1 text-xs transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="border-border relative z-1 flex gap-2 border-t p-3">
        <input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          // Submitting explicitly rather than relying on the browser's
          // implicit submission, which is skipped whenever the only submit
          // button is disabled — which it is on every empty-to-typed keystroke.
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
          placeholder={t(ui.agent.placeholder)}
          aria-label={t(ui.agent.placeholder)}
          className="bg-raised border-border-interactive text-text placeholder:text-muted min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={busy || draft.trim().length === 0}
          className="bg-accent text-on-accent rounded-lg px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-40"
        >
          {t(ui.agent.send)}
        </button>
      </form>
    </div>
  )
}
