import { Button } from '@repo/ui'
import { m } from '@/paraglide/messages'

export function HeroSection() {
  return (
    <section aria-label="Hero" className="grid border-b border-border md:grid-cols-[1.05fr_0.95fr]">
      {/* Left panel — hairline grid texture via background-image */}
      <div
        className="flex flex-col justify-center border-b border-border bg-card px-7 py-16 md:border-b-0 md:border-r md:px-14 md:py-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0',
        }}
      >
        <p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.24em] text-brand">
          {m.landing_hero_eyebrow()}
        </p>

        <h1 className="max-w-[13ch] font-display text-4xl font-bold leading-[1.06] tracking-[-0.03em] [text-wrap:balance] sm:text-5xl">
          {m.landing_hero_title_a()}
          <span className="text-brand">{m.landing_hero_title_em()}</span>
          {m.landing_hero_title_b()}
        </h1>

        <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-muted-foreground">
          {m.landing_hero_sub()}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Button asChild className="font-mono text-xs font-bold uppercase tracking-wider">
            <a href="#access">{m.landing_hero_cta_primary()}</a>
          </Button>
          <a
            href="#margin"
            className="border-b border-border pb-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
          >
            {m.landing_hero_cta_secondary()}
          </a>
        </div>
      </div>

      {/* Right panel — stat cells */}
      <div className="relative grid grid-rows-2 bg-background">
        {/* LIVE indicator */}
        <div className="absolute right-4 top-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span
            aria-hidden="true"
            className="inline-block size-[6px] rounded-full bg-brand motion-safe:animate-pulse"
          />
          <span>Live</span>
        </div>

        <div className="flex flex-col justify-center border-b border-border px-10 py-11">
          <p className="font-display tabular-nums text-4xl font-bold tracking-tight text-brand sm:text-5xl">
            {m.landing_hero_stat1_value()}
            <span className="text-2xl align-baseline">{m.landing_hero_stat1_unit()}</span>
          </p>
          <p className="mt-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {m.landing_hero_stat1_label()}
          </p>
          <p className="mt-2 font-mono text-[10.5px] tracking-wide text-muted-foreground/70">
            {m.landing_hero_stat1_src()}
          </p>
        </div>

        <div className="flex flex-col justify-center px-10 py-11">
          <p className="font-display tabular-nums text-4xl font-bold tracking-tight text-brand sm:text-5xl">
            {m.landing_hero_stat2_value()}
          </p>
          <p className="mt-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {m.landing_hero_stat2_label()}
          </p>
          <p className="mt-2 font-mono text-[10.5px] tracking-wide text-muted-foreground/70">
            {m.landing_hero_stat2_src()}
          </p>
        </div>
      </div>
    </section>
  )
}
