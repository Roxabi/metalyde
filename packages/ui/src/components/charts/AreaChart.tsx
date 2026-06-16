'use client'

import { useId, useState } from 'react'
import {
  buildAreaPath,
  buildLinePath,
  chartColorVar,
  linearScale,
  nearestIndex,
  niceTicks,
} from '@/lib/chartUtils'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AreaChartDataPoint = {
  /** X-axis label displayed below the chart. */
  label: string
  value: number
}

type AreaChartProps = {
  data: AreaChartDataPoint[]
  /** Number of horizontal gridlines / y-axis ticks (default 4). */
  gridLines?: number
  /** Height of the chart area in px, excluding labels (default 160). */
  chartHeight?: number
  /** Y-axis label formatter (default: compact locale string). */
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
const LABEL_HEIGHT = 24 // px reserved below chart for x-axis labels
const _TICK_LABEL_WIDTH = 36 // px for y-axis tick labels (inside PADDING.left)

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * AreaChart — line + filled area, horizontal gridlines, x/y axis labels.
 * Gradient fill fades from `--color-chart-N` at 20% opacity to transparent.
 */
export function AreaChart({
  data,
  gridLines = 4,
  chartHeight = 160,
  formatY,
  colorSlot = 1,
  className,
  'aria-label': ariaLabel,
}: AreaChartProps) {
  const id = useId()
  const reducedMotion = useReducedMotion()
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const color = chartColorVar(colorSlot)

  const svgWidth = '100%'
  // Total SVG height = chart area + x-labels + top pad
  const svgHeight = chartHeight + LABEL_HEIGHT + PADDING.top

  // Derived extents
  const values = data.map((d) => d.value)
  const dataMin = values.length ? Math.min(...values) : 0
  const dataMax = values.length ? Math.max(...values) : 1

  const ticks = niceTicks(Math.min(0, dataMin), dataMax, gridLines + 1)
  const tickMin = ticks[0] ?? 0
  const tickMax = ticks[ticks.length - 1] ?? tickMin

  // Scale helpers — we use a percentage-based viewBox so we pin to 100 wide.
  const VIEW_W = 100 // percentage units so SVG stretches naturally
  const plotLeft = PADDING.left
  const plotRight = VIEW_W - PADDING.right
  const plotTop = PADDING.top
  const plotBottom = chartHeight + PADDING.top

  const scaleX = linearScale(0, Math.max(1, data.length - 1), plotLeft, plotRight)
  const scaleY = linearScale(tickMin, tickMax, plotBottom, plotTop)

  const points = data.map((d, i) => ({
    x: data.length === 1 ? (plotLeft + plotRight) / 2 : scaleX(i),
    y: scaleY(d.value),
  }))

  const xValues = points.map((p) => p.x)

  const linePath = buildLinePath(points)
  const areaPath = buildAreaPath(points, plotBottom)
  const baselineY = scaleY(Math.max(0, tickMin))

  const defaultFormatY = (v: number) =>
    Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v)
  const fmt = formatY ?? defaultFormatY

  // Guarded lookups for the hovered point (index is a runtime value, so narrow once).
  const hoverPoint = hoverIdx !== null ? points[hoverIdx] : undefined
  const hoverX = hoverIdx !== null ? xValues[hoverIdx] : undefined

  // Draw-in animation on the line path
  const lineAnimStyle: React.CSSProperties = reducedMotion
    ? {}
    : {
        strokeDasharray: '2000',
        strokeDashoffset: '2000',
        animation: `area-draw-${id} 1s ease-out forwards`,
      }

  // Area fade-in
  const areaAnimStyle: React.CSSProperties = reducedMotion
    ? {}
    : {
        opacity: 0,
        animation: `area-fade-${id} 0.6s ease-out 0.4s forwards`,
      }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    // Convert client x to percentage-based SVG x (viewBox = 0..100)
    const svgX = ((e.clientX - rect.left) / rect.width) * VIEW_W
    setHoverIdx(nearestIndex(svgX, xValues))
  }

  function handleMouseLeave() {
    setHoverIdx(null)
  }

  const gradientId = `area-gradient-${id}`
  const clipId = `area-clip-${id}`

  const a11yProps = ariaLabel ? ({ role: 'img', 'aria-label': ariaLabel } as const) : {}

  return (
    <div data-slot="area-chart" className={cn('relative w-full', className)} {...a11yProps}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${svgHeight}`}
        preserveAspectRatio="none"
        width={svgWidth}
        height={svgHeight}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-hidden="true"
        className="overflow-visible"
        style={{ display: 'block' }}
      >
        {!reducedMotion && (
          <style>{`
            @keyframes area-draw-${id} { to { stroke-dashoffset: 0; } }
            @keyframes area-fade-${id} { to { opacity: 1; } }
          `}</style>
        )}

        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <clipPath id={clipId}>
            <rect
              x={plotLeft}
              y={plotTop}
              width={plotRight - plotLeft}
              height={plotBottom - plotTop}
            />
          </clipPath>
        </defs>

        {/* Horizontal gridlines */}
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
              {/* Y-axis tick label */}
              <text
                x={plotLeft - 4}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-muted-foreground font-mono text-[8px]"
                style={{ fontSize: '8px' }}
              >
                {fmt(tick)}
              </text>
            </g>
          )
        })}

        {/* Area fill */}
        {data.length > 0 && (
          <path
            d={areaPath}
            fill={`url(#${gradientId})`}
            clipPath={`url(#${clipId})`}
            style={areaAnimStyle}
          />
        )}

        {/* Line */}
        {data.length > 0 && (
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            clipPath={`url(#${clipId})`}
            style={lineAnimStyle}
          />
        )}

        {/* Hover dot */}
        {hoverPoint && (
          <circle
            cx={hoverPoint.x}
            cy={hoverPoint.y}
            r="2.5"
            fill={color}
            stroke="var(--color-background)"
            strokeWidth="1.5"
          />
        )}

        {/* Baseline (zero line) — only visible when data crosses zero */}
        {tickMin < 0 && tickMax > 0 && (
          <line
            x1={plotLeft}
            x2={plotRight}
            y1={baselineY}
            y2={baselineY}
            stroke="currentColor"
            strokeWidth="0.5"
            strokeOpacity="0.3"
            className="text-foreground"
          />
        )}

        {/* X-axis labels */}
        {data.map((d, i) => {
          const x = data.length === 1 ? (plotLeft + plotRight) / 2 : scaleX(i)
          return (
            <text
              key={i}
              x={x}
              y={plotBottom + LABEL_HEIGHT * 0.6}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground font-mono text-[7px]"
              style={{ fontSize: '7px' }}
            >
              {d.label}
            </text>
          )
        })}
      </svg>

      {/* Hover tooltip */}
      {hoverIdx !== null && data[hoverIdx] && (
        <div
          className={cn(
            'pointer-events-none absolute top-0 left-0 z-10',
            'rounded-sm border border-border bg-card px-2 py-1 shadow-card',
            'text-caption font-mono text-foreground'
          )}
          style={{
            // Position relative to container; translate to keep in bounds.
            transform: `translateX(${(((hoverX ?? 0) - PADDING.left) / (VIEW_W - PADDING.left - PADDING.right)) * 100}%) translateX(-50%)`,
            marginTop: `${PADDING.top}px`,
          }}
          aria-live="polite"
        >
          <span className="text-muted-foreground">{data[hoverIdx].label}</span>{' '}
          {fmt(data[hoverIdx].value)}
        </div>
      )}
    </div>
  )
}
