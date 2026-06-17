import type * as React from 'react'

import { cn } from '@/lib/utils'
import { StatTrend } from './StatTrend'

// ── KpiMetric value formats ────────────────────────────────────────────────

type KpiValueFormat = 'money' | 'percent' | 'hours' | 'number'

/** Shared KPI metric descriptor — can also be consumed by chart components. */
type KpiMetric = {
  label: string
  value: number
  format?: KpiValueFormat
  delta?: number
  /** When true, a negative delta is the "good" direction (e.g. cost reduction). */
  invertDelta?: boolean
  /** Optional sparkline or chart node rendered below the value row. */
  spark?: React.ReactNode
}

// ── Value formatter ────────────────────────────────────────────────────────

function formatKpiValue(value: number, format: KpiValueFormat = 'number'): string {
  switch (format) {
    case 'money':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value)
    case 'percent':
      return `${value}%`
    case 'hours':
      return `${value}h`
    default:
      return new Intl.NumberFormat('en-US').format(value)
  }
}

// ── KpiCard props ──────────────────────────────────────────────────────────

type KpiCardProps = {
  label: string
  value: number
  format?: KpiValueFormat
  delta?: number
  invertDelta?: boolean
  /**
   * Optional icon rendered in the top-right slot.
   * Pass any ReactNode — typically a 16×16 icon component.
   */
  icon?: React.ReactNode
  /**
   * Optional sparkline or inline chart.
   * Accepts any ReactNode — no chart library is imported here so that
   * KpiCard has zero dependency on the chart build order.
   * Rendered below the value + trend row, bleeding to card edges.
   */
  sparkline?: React.ReactNode
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────────

/**
 * KpiCard — dashboard KPI metric card.
 *
 * Anatomy:
 *   ┌─────────────────────────────────┐
 *   │ LABEL                   [icon?] │  ← text-label, uppercase
 *   │ 0,000                           │  ← text-mono-kpi, tabular-nums
 *   │ ▲ +12% · vs last period         │  ← StatTrend (optional)
 *   │ ▁▂▃▄▅ (sparkline slot, opt.)    │  ← sparkline?: ReactNode
 *   └─────────────────────────────────┘
 *
 * Surface: bg-card + shadow-card + rounded per --radius-lg.
 */
function KpiCard({
  label,
  value,
  format = 'number',
  delta,
  invertDelta = false,
  icon,
  sparkline,
  className,
}: KpiCardProps) {
  const hasDelta = delta !== undefined

  return (
    <div
      data-slot="kpi-card"
      className={cn(
        'bg-card text-card-foreground flex flex-col rounded-xl shadow-card',
        'border border-border/60',
        className
      )}
    >
      {/* Body */}
      <div className="flex flex-col gap-2 px-5 pt-5 pb-4">
        {/* Top row: label + optional icon */}
        <div className="flex items-start justify-between gap-2">
          <span
            data-slot="kpi-label"
            className="text-label text-muted-foreground uppercase tracking-widest"
          >
            {label}
          </span>
          {icon != null && (
            <span aria-hidden="true" className="text-muted-foreground/60 shrink-0 [&>svg]:size-4">
              {icon}
            </span>
          )}
        </div>

        {/* Value — mono-kpi scale with tabular-nums */}
        <p
          data-slot="kpi-value"
          data-numeric
          className="text-mono-kpi tabular font-medium leading-none"
        >
          {formatKpiValue(value, format)}
        </p>

        {/* Delta trend (optional) */}
        {hasDelta && (
          <StatTrend
            value={delta!}
            invertDelta={invertDelta}
            suffix={format === 'percent' ? 'pp' : '%'}
          />
        )}
      </div>

      {/* Sparkline slot — bleeds to card edges (no horizontal padding) */}
      {sparkline != null && (
        <div data-slot="kpi-sparkline" className="mt-auto overflow-hidden rounded-b-xl">
          {sparkline}
        </div>
      )}
    </div>
  )
}

export { KpiCard, formatKpiValue }
export type { KpiCardProps, KpiMetric, KpiValueFormat }
