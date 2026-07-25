import { Section } from '@/components/layout/Section'
import { useT } from '@/i18n'
import { ui } from '@/content/ui'
import { profile } from '@/content/profile'
import { useUI } from '@/store/ui'

export function Hero() {
  const { t } = useT()
  const { run } = useUI()

  return (
    <Section id="home" className="relative flex min-h-[85dvh] flex-col justify-center">
      {/* No opacity here — strength lives in --fx-grid-color so each theme can
          be tuned independently. Faded to nothing at the bottom so the grid
          ends with the hero instead of colliding with the next section. */}
      <div
        className="fx-grid pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
        aria-hidden="true"
      />

      <p className="border-accent/40 text-accent mb-8 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs">
        <span className="bg-accent h-1.5 w-1.5 rounded-full" aria-hidden="true" />
        {t(ui.hero.availability)}
      </p>

      <h1 className="text-4xl leading-[1.05] font-bold sm:text-6xl md:text-7xl">
        {profile.name}
      </h1>

      <p className="text-accent mt-4 text-xl font-medium sm:text-2xl">{t(profile.title)}</p>
      <p className="text-muted mt-1 font-mono text-sm sm:text-base">{t(profile.subtitle)}</p>

      <p className="mt-8 max-w-2xl text-base leading-relaxed sm:text-lg">{t(profile.intro)}</p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => run({ name: 'navigateTo', input: { section: 'work' } })}
          className="bg-accent text-on-accent rounded-lg px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.02]"
        >
          {t(ui.nav.work)}
        </button>
        <button
          type="button"
          onClick={() => run({ name: 'navigateTo', input: { section: 'contact' } })}
          className="border-border-interactive hover:border-accent hover:text-accent rounded-lg border px-5 py-2.5 text-sm transition-colors"
        >
          {t(ui.nav.contact)}
        </button>
        <p className="text-muted w-full font-mono text-xs sm:w-auto sm:pl-2">
          ↘ {t(ui.hero.tryAgent)}
        </p>
      </div>
    </Section>
  )
}
