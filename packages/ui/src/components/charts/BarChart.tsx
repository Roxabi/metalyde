'use client'

import { useId, useState } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { cn } from '@/lib/utils'
import { chartColorVar, linearScale, niceTicks } from '../../lib/chartUtils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BarChartDataPoint = {
  label: string
  value: number
}

type BarChartProps = {
  data: BarChartDataPoint[]
  /** Number of horizontal gridlines (default 4). */
  gridLines?: number
  /** Height of the chart area in px (default 160). */
  chartHeight?: number
  /** Gap between bars as a fraction of bar width (default 0.25). */
  barGap?: number
  /** Corner radius for the rounded tops (default 3). */
  barRadius?: number
  /** Y-axis label formatter (default: compact locale). */
  formatY?: (value: number) => string
  /** Chart palette slot (default 1). */
  colorSlot?: 1 | 2 | 3 | 4 | 5
  className?: string
  'aria-label'?: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PADDING = { top: 8, right: 4, bottom: 4, left: 40 }
const LABEL_HEIGHT = 24

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * BarChart — vertical bars with rounded tops, horizontal gridlines, hover state.
 * All bars use `--color-chart-N`; hover brings them to full opacity.
 */
export function BarChart({
  data,
  gridLines = 4,
  chartHeight = 160,
  barGap = 0.25,
  barRadius = 3,
  formatY,
  colorSlot = 1,
  className,
  'aria-label': ariaLabel,
}: BarChartProps) {
  const id = useId()
  const safeId = id.replace(/:/g, '')
  const reducedMotion = useReducedMotion()
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const color = chartColorVar(colorSlot)
  const svgHeight = chartHeight + LABEL_HEIGHT + PADDING.top

  const VIEW_W = 100
  const plotLeft = PADDING.left
  const plotRight = VIEW_W - PADDING.right
  const plotTop = PADDING.top
  const plotBottom = chartHeight + PADDING.top

  const values = data.map((d) => d.value)
  const dataMax = values.length ? Math.max(...values) : 1
  const dataMin = values.length ? Math.min(...values) : 0

  const ticks = niceTicks(Math.min(0, dataMin), dataMax, gridLines + 1)
  const tickMin = ticks[0] ?? 0
  const tickMax = ticks[ticks.length - 1] ?? tickMin

  const scaleY = linearScale(tickMin, tickMax, plotBottom, plotTop)
  const baselineY = scaleY(Math.max(0, tickMin))

  const n = data.length
  const totalWidth = plotRight - plotLeft
  const barWidth = n > 0 ? (totalWidth / n) * (1 - barGap) : 0
  const slotWidth = n > 0 ? totalWidth / n : 0

  const defaultFormatY = (v: number) =>
    Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v)
  const fmt = formatY ?? defaultFormatY
  const a11yProps = ariaLabel ? ({ role: 'img', 'aria-label': ariaLabel } as const) : {}

  return (
    <div data-slot="bar-chart" className={cn('relative w-full', className)} {...a11yProps}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${svgHeight}`}
        preserveAspectRatio="none"
        width="100%"
        height={svgHeight}
        aria-hidden="true"
        className="overflow-visible"
        style={{ display: 'block' }}
      >
        {!reducedMotion && (
          <style>{`
            @keyframes bar-grow-${safeId} {
              from { transform-origin: bottom; transform: scaleY(0); }
              to   { transform-origin: bottom; transform: scaleY(1); }
            }
          `}</style>
        )}

        {/* Horizontal gridlines + y-axis labels */}
        {ticks.map((tick) => {
          const y = scaleY(tick)
          return (
            <g key={tick}>
              <line
                x1={plotLeft}
                x2={plotRight}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeWidth="0.3"
                strokeOpacity="0.12"
                className="text-foreground"
              />
              <text
                x={plotLeft - 4}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-muted-foreground font-mono"
                style={{ fontSize: '8px' }}
              >
                {fmt(tick)}
              </text>
            </g>
          )
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const barTopY = scaleY(Math.max(d.value, tickMin))
          const barH = Math.max(0, baselineY - barTopY)
          const x = plotLeft + i * slotWidth + (slotWidth - barWidth) / 2
          const isHovered = hoverIdx === i
          const r = Math.min(barRadius, barWidth / 2, barH)

          const animStyle: React.CSSProperties = reducedMotion
            ? {}
            : {
                animation: `bar-grow-${safeId} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.05}s both`,
                transformBox: 'fill-box',
              }

          // Rounded-top bar: rect that is clipped to show rounded top corners only.
          // We draw two overlapping shapes: a rounded rect (all corners), then a
          // full rect covering the bottom half to square off the bottom corners.
          return (
            // TODO(a11y): keyboard navigation for hover/tooltip — deferred to app-shell fast-follow (WCAG 2.1.1)
            // biome-ignore lint/a11y/noStaticElementInteractions: decorative chart hover (opacity emphasis only), not an interactive control
            <g
              key={i}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              style={{ cursor: 'default', ...animStyle }}
            >
              {/* Full bar (rounded everywhere, will have bottom covered) */}
              <rect
                x={x}
                y={barTopY}
                width={barWidth}
                height={barH}
                rx={r}
                ry={r}
                fill={color}
                opacity={isHovered ? 1 : 0.75}
                style={{ transition: 'opacity 0.15s ease' }}
              />
              {/* Bottom half square-off overlay */}
              {barH > r * 2 && (
                <rect
                  x={x}
                  y={barTopY + r}
                  width={barWidth}
                  height={barH - r}
                  fill={color}
                  opacity={isHovered ? 1 : 0.75}
                  style={{ transition: 'opacity 0.15s ease' }}
                />
              )}
            </g>
          )
        })}

        {/* X-axis labels */}
        {data.map((d, i) => {
          const x = plotLeft + i * slotWidth + slotWidth / 2
          return (
            <text
              key={i}
              x={x}
              y={plotBottom + LABEL_HEIGHT * 0.6}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground font-mono"
              style={{ fontSize: '7px' }}
            >
              {d.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
