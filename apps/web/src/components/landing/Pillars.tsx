import { m } from '@/paraglide/messages'

const pillars = [
  {
    label: m.landing_pillar1_label,
    title: m.landing_pillar1_title,
    desc: m.landing_pillar1_desc,
    tag: m.landing_pillar1_tag,
  },
  {
    label: m.landing_pillar2_label,
    title: m.landing_pillar2_title,
    desc: m.landing_pillar2_desc,
    tag: m.landing_pillar2_tag,
  },
  {
    label: m.landing_pillar3_label,
    title: m.landing_pillar3_title,
    desc: m.landing_pillar3_desc,
    tag: m.landing_pillar3_tag,
  },
  {
    label: m.landing_pillar4_label,
    title: m.landing_pillar4_title,
    desc: m.landing_pillar4_desc,
    tag: m.landing_pillar4_tag,
  },
]

type PillarItem = (typeof pillars)[number]

export function Pillars() {
  const [lead, ...rest] = pillars as [PillarItem, ...PillarItem[]]

  return (
    <section aria-label="Why Metalyde">
      <div className="border-b border-border bg-card px-7 pt-12 md:px-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/70">
          {m.landing_pillars_tag()}
        </p>
        <h2 className="mb-0 mt-3 max-w-[24ch] font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {m.landing_pillars_title()}
        </h2>
      </div>

      {/* Pillar 1 — full-width lead */}
      <div className="group border-b border-border bg-card transition-colors hover:bg-muted/30">
        <div className="px-7 py-10 sm:px-11">
          <h3 className="mb-3 font-display text-lg font-bold leading-snug tracking-tight">
            {lead.title()}
          </h3>
          <p className="max-w-[56ch] text-[0.95rem] leading-relaxed text-muted-foreground">
            {lead.desc()}
          </p>
          <span className="mt-5 inline-block border border-border bg-background px-3 py-1.5 font-mono text-[11px] font-medium text-foreground">
            {lead.tag()}
          </span>
        </div>
      </div>

      {/* Pillars 2-4 — compact 3-up row */}
      <div className="grid border-b border-border bg-card sm:grid-cols-3">
        {rest.map(({ label, title, desc, tag }) => (
          <div
            key={label()}
            className="group border-t border-border px-7 py-10 transition-colors hover:bg-muted/30 sm:border-t-0 sm:px-8 sm:[&:not(:last-child)]:border-r"
          >
            <h3 className="mb-3 font-display text-base font-bold leading-snug tracking-tight">
              {title()}
            </h3>
            <p className="text-[0.9rem] leading-relaxed text-muted-foreground">{desc()}</p>
            <span className="mt-5 inline-block border border-border bg-background px-3 py-1.5 font-mono text-[11px] font-medium text-foreground">
              {tag()}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
