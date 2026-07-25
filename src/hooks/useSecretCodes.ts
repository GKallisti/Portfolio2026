import { useEffect, useRef } from 'react'
import { useUI } from '@/store/ui'

/**
 * Listens for the two cheat codes that unlock the hidden project.
 *
 * Both are kept because they reward different memories: the Konami code is the
 * one everybody tries, and ABACABB is the one people who actually played
 * Mortal Kombat on a Genesis had to memorise.
 *
 * Typing is tracked as a rolling buffer rather than an index-and-reset state
 * machine, so a false start does not lock you out — "↑↑↑↓↓←→←→BA" still works,
 * which matters because that is how people actually type these.
 */

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

const ABACABB = ['a', 'b', 'a', 'c', 'a', 'b', 'b']

const LONGEST = Math.max(KONAMI.length, ABACABB.length)

function endsWith(buffer: string[], code: string[]): boolean {
  if (buffer.length < code.length) return false
  const tail = buffer.slice(-code.length)
  return tail.every((key, i) => key === code[i])
}

export function useSecretCodes() {
  const { state, run } = useUI()
  const buffer = useRef<string[]>([])

  // Read through a ref so the listener does not need re-binding on every
  // unlock-state change.
  const unlocked = useRef(state.secretUnlocked)
  unlocked.current = state.secretUnlocked

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (unlocked.current) return

      // Never swallow keystrokes meant for the agent's input box.
      const target = event.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return
      if (target?.isContentEditable) return

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      buffer.current = [...buffer.current, key].slice(-LONGEST)

      if (endsWith(buffer.current, KONAMI) || endsWith(buffer.current, ABACABB)) {
        buffer.current = []
        run({ name: 'revealSecret', input: {} })
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [run])
}
