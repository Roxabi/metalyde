import { cn } from '@/lib/utils'

type StatTrendProps = {
  /** Signed numeric delta — positive = up, negative = down. */
  value: number
  /** Unit suffix appended after the absolute value, e.g. '%' or 'h'. Defaults to '%'. */
  suffix?: string
  /**
   * Override inferred direction.
   * Useful when a negative delta is actually good (e.g. "cost down = good").
   */
  direction?: 'up' | 'down'
  /**
   * When true, a downward delta is rendered in success tone (e.g. cost reduction).
   * When false (default), up = success, down = destructive.
   */
  invertDelta?: boolean
  className?: string
}

/**
 * StatTrend — compact delta pill showing directional change with a semantic tone.
 *
 * Layout: [arrow icon] [signed value + suffix] · "vs last period" caption
 *
 * Tones:
 *   - success  (green)      when direction is up   and invertDelta = false
 *   - success  (green)      when direction is down  and invertDelta = true
 *   - destructive (red)     otherwise
 */
function StatTrend({
  value,
  suffix = '%',
  direction,
  invertDelta = false,
  className,
}: StatTrendProps) {
  const inferredDirection = direction ?? (value >= 0 ? 'up' : 'down')
  const isUp = inferredDirection === 'up'

  // Determine semantic tone from direction + invertDelta flag
  const isPositive = invertDelta ? !isUp : isUp

  const absValue = Math.abs(value)
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''

  return (
    <div data-slot="stat-trend" className={cn('flex items-center gap-1.5', className)}>
      {/* Delta pill */}
      <span
        className={cn(
          'inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-medium tabular-nums',
          isPositive ? 'bg-success/12 text-success' : 'bg-destructive/12 text-destructive'
        )}
      >
        {/* Arrow — ▲ up / ▼ down */}
        <svg
          aria-hidden="true"
          width="8"
          height="8"
          viewBox="0 0 8 8"
          className={cn('shrink-0', !isUp && 'rotate-180')}
        >
          <path d="M4 1 L7 6 L1 6 Z" fill="currentColor" />
        </svg>
        <span>
          {sign}
          {absValue}
          {suffix}
        </span>
      </span>

      {/* Caption */}
      <span className="text-caption text-muted-foreground">vs last period</span>
    </div>
  )
}

export { StatTrend }
export type { StatTrendProps }
