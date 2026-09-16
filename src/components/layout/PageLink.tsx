import type { MouseEvent, ReactNode } from 'react'
import { deepDives, type DeepDiveId } from '@/content/pages'
import { loadDeepDive } from '@/components/pages/registry'
import { useUI } from '@/store/ui'

/**
 * A real link to an in-depth page.
 *
 * A plain click goes through the store like every other navigation, so the
 * agent and the visitor share one path. Anything else — a middle click, ctrl
 * or cmd click, "copy link address" — is left to the browser, which is why
 * this is an `<a>` with a real `href` and not a button.
 */
export function PageLink({
  page,
  className,
  children,
  ariaCurrent,
}: {
  page: DeepDiveId
  className?: string
  children: ReactNode
  ariaCurrent?: boolean
}) {
  const { run } = useUI()

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    event.preventDefault()
    run({ name: 'openPage', input: { page } })
  }

  // Start fetching the chunk as soon as intent shows. The dynamic import is
  // cached, so repeated hovers cost nothing.
  const preload = () => {
    void loadDeepDive[page]().catch(() => {})
  }

  return (
    <a
      href={deepDives[page].path}
      onClick={onClick}
      onMouseEnter={preload}
      onFocus={preload}
      aria-current={ariaCurrent ? 'page' : undefined}
      className={className}
    >
      {children}
    </a>
  )
}
