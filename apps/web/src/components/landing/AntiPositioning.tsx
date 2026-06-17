import { m } from '@/paraglide/messages'

export function AntiPositioning() {
  return (
    <section
      aria-label="What Metalyde is not"
      className="border-b border-border bg-foreground px-7 py-16 text-background md:px-14"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-background/70">
        {m.landing_anti_tag()}
      </p>
      <div className="mt-7 grid gap-12 sm:grid-cols-2">
        <p className="font-display text-2xl font-medium leading-relaxed [text-wrap:balance]">
          {m.landing_anti_quote()}
          <span className="mt-4 block font-mono text-xs uppercase tracking-wide text-background/60">
            {m.landing_anti_cite()}
          </span>
        </p>
        <div className="font-mono text-[13px] leading-loose">
          <span className="mb-1.5 mt-0 block font-mono text-[11px] uppercase tracking-[0.14em] text-background/60">
            {m.landing_anti_not_label()}
          </span>
          <div>
            <span aria-hidden className="mr-2.5 text-brand">
              ✕
            </span>
            <span>{m.landing_anti_not1()}</span>
          </div>
          <div>
            <span aria-hidden className="mr-2.5 text-brand">
              ✕
            </span>
            <span>{m.landing_anti_not2()}</span>
          </div>
          <div>
            <span aria-hidden className="mr-2.5 text-brand">
              ✕
            </span>
            <span>{m.landing_anti_not3()}</span>
          </div>
          <span className="mb-1.5 mt-4 block font-mono text-[11px] uppercase tracking-[0.14em] text-background/60">
            {m.landing_anti_but_label()}
          </span>
          <div>
            <span aria-hidden className="mr-2.5 text-brand">
              →
            </span>
            <span>{m.landing_anti_but1()}</span>
          </div>
          <div>
            <span aria-hidden className="mr-2.5 text-brand">
              →
            </span>
            <span>{m.landing_anti_but2()}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
