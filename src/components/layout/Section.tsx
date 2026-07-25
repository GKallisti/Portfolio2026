import { useEffect, useRef, type ReactNode } from 'react'
import type { SectionId } from '@/agent/catalog'
import { useUI } from '@/store/ui'

/**
 * A page section that reports itself to the store when scrolled into view, so
 * the nav highlight and the agent's notion of "where the visitor is" stay
 * accurate without either of them polling.
 */
export function Section({
  id,
  children,
  className = '',
}: {
  id: SectionId
  children: ReactNode
  className?: string
}) {
  const { observeSection } = useUI()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) observeSection(id)
      },
      // A band across the middle of the viewport: a section counts as active
      // once it dominates the screen, not the moment its top edge appears.
      { rootMargin: '-45% 0px -45% 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [id, observeSection])

  return (
    <section
      ref={ref}
      id={id}
      className={`mx-auto w-full max-w-5xl scroll-mt-24 px-6 py-20 sm:px-8 md:py-28 ${className}`}
    >
      {children}
    </section>
  )
}

/** Consistent section heading with a small pixel-art index marker. */
export function SectionHeading({ index, children }: { index: string; children: ReactNode }) {
  return (
    <h2 className="mb-10 flex items-baseline gap-3 text-3xl md:text-4xl">
      <span className="text-pixel text-accent text-[10px]" aria-hidden="true">
        {index}
      </span>
      {children}
    </h2>
  )
}
