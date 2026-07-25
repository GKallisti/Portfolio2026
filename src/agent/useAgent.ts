import { useCallback, useRef, useState } from 'react'
import { parseAction, type Action, type UIStateSnapshot } from './catalog'
import { routeLocally } from './local'
import { useUI } from '@/store/ui'

/**
 * The agent loop, client side.
 *
 * The stages below are the real path a request takes through this code, not a
 * decorative animation: routing decides whether the model is even needed,
 * planning is the model reasoning, resolving is Zod validating what came back,
 * executing applies it to the UI store, and presenting streams the reply. It
 * is a small echo of the router → planner → entity resolver → executor →
 * parser → presenter pipeline Gisella built at Accenture, which is the point —
 * the page demonstrates the architecture it describes.
 */

export const PIPELINE_STAGES = ['route', 'plan', 'resolve', 'execute', 'present'] as const
export type PipelineStage = (typeof PIPELINE_STAGES)[number]

export type AgentMode = 'model' | 'local'

export interface AppliedAction {
  name: string
  ok: boolean
  /** Present when validation rejected the model's arguments. */
  error?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  actions?: AppliedAction[]
  /** Set when this reply came from the offline router rather than the model. */
  mode?: AgentMode
  failure?: 'offline' | 'rate_limited' | 'error'
}

/** Conversation turns sent upstream. Text only — see the Pages Function. */
interface Turn {
  role: 'user' | 'assistant'
  content: string
}

const MAX_HISTORY_TURNS = 12

function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

interface StreamEvent {
  type: 'text' | 'action' | 'stage' | 'done' | 'error'
  text?: string
  name?: string
  input?: unknown
  status?: number
}

export function useAgent() {
  const { state, run } = useUI()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [stage, setStage] = useState<PipelineStage | null>(null)
  const [busy, setBusy] = useState(false)

  // History is a ref rather than state: it is never rendered directly, and
  // keeping it out of the render path avoids a stale closure inside `send`.
  const history = useRef<Turn[]>([])
  const abortRef = useRef<AbortController | null>(null)

  /** Validates and applies one tool call from the model. */
  const applyAction = useCallback(
    (name: string, input: unknown): AppliedAction => {
      const parsed = parseAction(name, input)
      if (!parsed.ok) {
        return { name, ok: false, error: parsed.error }
      }
      run(parsed.action as Action)
      return { name, ok: true }
    },
    [run],
  )

  const send = useCallback(
    async (prompt: string) => {
      const trimmed = prompt.trim()
      if (!trimmed || busy) return

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      const userMessage: ChatMessage = { id: newId(), role: 'user', text: trimmed }
      const replyId = newId()

      setMessages((prev) => [
        ...prev,
        userMessage,
        { id: replyId, role: 'assistant', text: '' },
      ])
      setBusy(true)
      setStage('route')

      const snapshot: UIStateSnapshot = {
        theme: state.theme,
        accent: state.accent,
        language: state.language,
        effects: state.effects,
        activeSection: state.activeSection,
        filter: state.filter,
        highlightedProject: state.highlightedProject,
      }

      const patch = (update: Partial<ChatMessage>) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === replyId ? { ...m, ...update } : m)),
        )
      }

      /** Degrades to the offline router, keeping the commands working. */
      const fallBackLocally = (failure: ChatMessage['failure']) => {
        setStage('execute')
        const { actions, reply } = routeLocally(trimmed, state.language)
        for (const action of actions) run(action)
        setStage('present')
        patch({
          text: reply,
          actions: actions.map((action) => ({ name: action.name, ok: true })),
          mode: 'local',
          failure,
        })
      }

      try {
        const response = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            messages: [...history.current, { role: 'user', content: trimmed }],
            uiState: snapshot,
          }),
        })

        if (!response.ok || !response.body) {
          fallBackLocally(response.status === 429 ? 'rate_limited' : 'offline')
          return
        }

        setStage('plan')

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let text = ''
        const applied: AppliedAction[] = []
        let failed = false

        const handle = (event: StreamEvent) => {
          switch (event.type) {
            case 'text':
              // First visible token means the model is past reasoning.
              setStage('present')
              text += event.text ?? ''
              patch({ text, mode: 'model' })
              break

            case 'action': {
              setStage('resolve')
              const result = applyAction(event.name ?? '', event.input)
              setStage('execute')
              applied.push(result)
              patch({ actions: [...applied] })
              break
            }

            case 'error':
              failed = true
              break

            default:
              break
          }
        }

        // Newline-delimited JSON: one event per line, with the tail of a
        // chunk held back until its newline arrives.
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.trim()) continue
            try {
              handle(JSON.parse(line) as StreamEvent)
            } catch {
              // A malformed line is not worth failing the whole turn over.
            }
          }
        }

        if (failed && !text) {
          fallBackLocally('error')
          return
        }

        setStage('present')
        patch({ text, actions: applied, mode: 'model' })

        const nextHistory: Turn[] = [
          ...history.current,
          { role: 'user', content: trimmed },
          { role: 'assistant', content: text },
        ]
        history.current = nextHistory.slice(-MAX_HISTORY_TURNS)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        fallBackLocally('offline')
      } finally {
        setBusy(false)
        setStage(null)
      }
    },
    [applyAction, busy, run, state],
  )

  const reset = useCallback(() => {
    abortRef.current?.abort()
    history.current = []
    setMessages([])
    setStage(null)
    setBusy(false)
  }, [])

  return { messages, stage, busy, send, reset }
}
