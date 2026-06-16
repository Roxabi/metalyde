import { m } from '@/paraglide/messages'

const pillars = [
  {
    num: '01',
    label: m.landing_pillar1_label,
    title: m.landing_pillar1_title,
    desc: m.landing_pillar1_desc,
    tag: m.landing_pillar1_tag,
  },
  {
    num: '02',
    label: m.landing_pillar2_label,
    title: m.landing_pillar2_title,
    desc: m.landing_pillar2_desc,
    tag: m.landing_pillar2_tag,
  },
  {
    num: '03',
    label: m.landing_pillar3_label,
    title: m.landing_pillar3_title,
    desc: m.landing_pillar3_desc,
    tag: m.landing_pillar3_tag,
  },
  {
    num: '04',
    label: m.landing_pillar4_label,
    title: m.landing_pillar4_title,
    desc: m.landing_pillar4_desc,
    tag: m.landing_pillar4_tag,
  },
]

export function Pillars() {
  return (
    <section aria-label="Why Metalyde">
      <div className="border-b border-border bg-card px-7 pt-12 md:px-14">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand">
          {m.landing_pillars_tag()}
        </p>
        <h2 className="mb-0 mt-3 max-w-[24ch] text-2xl font-bold tracking-tight sm:text-3xl">
          {m.landing_pillars_title()}
        </h2>
      </div>
      <div className="grid border-b border-border bg-card sm:grid-cols-2">
        {pillars.map(({ num, label, title, desc, tag }) => (
          <div
            key={num}
            className="border-t border-border px-7 py-10 sm:px-11 sm:[&:nth-child(odd)]:border-r"
          >
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand">
              {num} — {label()}
            </p>
            <h3 className="mb-3 text-lg font-bold leading-snug tracking-tight">{title()}</h3>
            <p className="text-[0.95rem] leading-relaxed text-muted-foreground">{desc()}</p>
            <span className="mt-5 inline-block border border-border bg-background px-3 py-1.5 font-mono text-[11px] font-medium text-foreground">
              {tag()}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
