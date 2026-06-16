import { m } from '@/paraglide/messages'

export function WhoItsFor() {
  return (
    <section
      aria-label="Who it's for"
      className="grid border-b border-border bg-card sm:grid-cols-2"
    >
      <div className="px-7 py-12 sm:border-r sm:border-border md:px-14">
        <h3 className="mb-3.5 font-display text-xl font-bold tracking-tight">
          {m.landing_who1_title()}
        </h3>
        <p className="leading-relaxed text-muted-foreground">{m.landing_who1_desc()}</p>
        <div className="mt-5 font-mono text-xs leading-loose text-foreground">
          {m.landing_who_spec_team()}{' '}
          <span className="text-brand">{m.landing_who_spec_team_value()}</span>
          {'  ·  '}
          {m.landing_who_spec_accounts()}{' '}
          <span className="text-brand">{m.landing_who_spec_accounts_value()}</span>
          <br />
          {m.landing_who_spec_revenue()}{' '}
          <span className="text-brand">{m.landing_who_spec_revenue_value()}</span>
          {'  ·  '}
          {m.landing_who_spec_setup()}{' '}
          <span className="text-brand">{m.landing_who_spec_setup_value()}</span>
        </div>
      </div>
      <div className="px-7 py-12 md:px-14">
        <h3 className="mb-3.5 font-display text-xl font-bold tracking-tight">
          {m.landing_who2_title()}
        </h3>
        <p className="leading-relaxed text-muted-foreground">{m.landing_who2_desc()}</p>
        <div className="mt-5 border border-brand-dim bg-brand-dim p-5">
          <p className="mb-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand">
            {m.landing_who_migrate_tag()}
          </p>
          <p className="text-sm leading-relaxed text-foreground">{m.landing_who_migrate_desc()}</p>
        </div>
      </div>
    </section>
  )
}
