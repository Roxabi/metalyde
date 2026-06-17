import { m } from '@/paraglide/messages'

export function MetricsStrip() {
  return (
    <section
      aria-label="Live metrics"
      className="grid grid-cols-2 border-b border-border bg-card lg:grid-cols-4"
    >
      <div className="flex items-baseline gap-2 border-b border-border px-6 py-4 font-mono text-xs uppercase tracking-wider text-muted-foreground lg:border-b-0 lg:border-r">
        {m.landing_strip_briefs_label()}
        <b className="font-display tabular-nums text-sm text-foreground">12</b>
        <span aria-hidden="true" className="font-mono text-[9px] text-muted-foreground/60">
          ▲
        </span>
      </div>

      <div className="flex items-baseline gap-2 border-b border-border px-6 py-4 font-mono text-xs uppercase tracking-wider text-muted-foreground lg:border-b-0 lg:border-r">
        {m.landing_strip_risk_label()}
        <b className="font-display tabular-nums text-sm text-brand">3</b>
        <span aria-hidden="true" className="font-mono text-[9px] text-brand/60">
          ▲
        </span>
      </div>

      <div className="flex items-baseline gap-2 border-b border-border px-6 py-4 font-mono text-xs uppercase tracking-wider text-muted-foreground lg:border-b-0 lg:border-r">
        {m.landing_strip_margin_label()}
        <b className="font-display tabular-nums text-sm text-foreground">$48,200</b>
        <span aria-hidden="true" className="font-mono text-[9px] text-muted-foreground/60">
          ▲
        </span>
      </div>

      <div className="flex items-baseline gap-2 border-b border-border px-6 py-4 font-mono text-xs uppercase tracking-wider text-muted-foreground [&:last-child]:border-r-0">
        {m.landing_strip_util_label()}
        <b className="font-display tabular-nums text-sm text-foreground">64%</b>
        <span aria-hidden="true" className="font-mono text-[9px] text-muted-foreground/60">
          ▼
        </span>
      </div>
    </section>
  )
}
