import { m } from '@/paraglide/messages'

type RowStatus = 'healthy' | 'over' | 'burning'

interface AccountRow {
  account: string
  retainer: string
  hours: string
  margin: string
  pos: boolean
  bar: number
  status: RowStatus
}

const ROWS: AccountRow[] = [
  {
    account: 'Lumen Brands',
    retainer: '$12,000',
    hours: '88 / 120',
    margin: '+38%',
    pos: true,
    bar: 76,
    status: 'healthy',
  },
  {
    account: 'Vega Performance',
    retainer: '$15,000',
    hours: '102 / 130',
    margin: '+29%',
    pos: true,
    bar: 64,
    status: 'healthy',
  },
  {
    account: 'Northwind Media',
    retainer: '$8,000',
    hours: '41 / 40',
    margin: '−4%',
    pos: false,
    bar: 38,
    status: 'over',
  },
  {
    account: 'Okta Social',
    retainer: '$4,500',
    hours: '67 / 50',
    margin: '−18%',
    pos: false,
    bar: 62,
    status: 'burning',
  },
]

function StatusPill({ status }: { status: RowStatus }) {
  if (status === 'healthy') {
    return (
      <span className="border border-border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {m.landing_margin_status_healthy()}
      </span>
    )
  }
  if (status === 'over') {
    return (
      <span className="border border-brand-dim bg-brand-dim px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-brand">
        {m.landing_margin_status_over()}
      </span>
    )
  }
  return (
    <span className="border border-brand-dim bg-brand-dim px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-brand">
      {m.landing_margin_status_burning()}
    </span>
  )
}

export function MarginView() {
  return (
    <section
      id="margin"
      aria-label="Margin view"
      className="border-b border-border bg-card px-7 py-14 md:px-14"
    >
      {/* Head */}
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/70">
        {m.landing_margin_tag()}
      </p>
      <h2 className="max-w-[24ch] font-display text-2xl font-bold tracking-tight sm:text-3xl">
        {m.landing_margin_title()}
      </h2>
      <p className="mt-3 max-w-[54ch] leading-relaxed text-muted-foreground">
        {m.landing_margin_desc()}
      </p>

      {/* Panel */}
      <div className="mt-7 border border-border">
        {/* Bar */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-2.5 font-bold text-foreground">
            <span
              aria-hidden="true"
              className="inline-block size-[7px] rounded-full bg-brand motion-safe:animate-pulse"
            />
            {m.landing_margin_panel_title()}
          </span>
          <span>{m.landing_margin_panel_meta()}</span>
        </div>

        {/* Table */}
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border bg-background px-5 py-3 text-left font-mono text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                {m.landing_margin_th_account()}
              </th>
              <th className="border-b border-border bg-background px-5 py-3 text-right font-mono text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                {m.landing_margin_th_retainer()}
              </th>
              <th className="border-b border-border bg-background px-5 py-3 text-right font-mono text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                {m.landing_margin_th_hours()}
              </th>
              <th className="border-b border-border bg-background px-5 py-3 text-right font-mono text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                {m.landing_margin_th_margin()}
              </th>
              <th className="hidden border-b border-border bg-background px-5 py-3 font-mono text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground md:table-cell" />
              <th className="border-b border-border bg-background px-5 py-3 text-left font-mono text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                {m.landing_margin_th_status()}
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child_td]:border-b-0">
            {ROWS.map((row) => (
              <tr key={row.account} className="transition-colors ease-control hover:bg-muted/40">
                <td className="border-b border-border px-5 py-3.5 font-semibold">{row.account}</td>
                <td className="border-b border-border px-5 py-3.5 text-right tabular-nums">
                  {row.retainer}
                </td>
                <td className="border-b border-border px-5 py-3.5 text-right tabular-nums">
                  {row.hours}
                </td>
                <td className="border-b border-border px-5 py-3.5 text-right">
                  <span
                    className={`font-mono font-bold ${row.pos ? 'text-foreground' : 'text-brand'}`}
                  >
                    {row.margin}
                  </span>
                </td>
                <td className="hidden border-b border-border px-5 py-3.5 md:table-cell">
                  <span
                    aria-hidden="true"
                    className="relative ml-auto block h-1.5 w-[120px] bg-muted"
                  >
                    <i
                      className={`absolute inset-y-0 left-0 block ${row.pos ? 'bg-foreground' : 'bg-brand'}`}
                      style={{ width: `${row.bar}%` }}
                    />
                  </span>
                </td>
                <td className="border-b border-border px-5 py-3.5">
                  <StatusPill status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Foot */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-border px-5 py-3.5 font-mono text-xs tracking-wide text-muted-foreground">
          <span>{m.landing_margin_foot()}</span>
          <span className="font-bold text-brand">{m.landing_margin_flag()}</span>
        </div>
      </div>
    </section>
  )
}
