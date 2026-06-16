'use client'

import { useId } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { cn } from '@/lib/utils'
import { chartColorVar, donutArcPath } from '../../lib/chartUtils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DonutSegment = {
  label: string
  value: number
  /** Override the palette slot for this segment. Defaults to slot index + 1. */
  colorSlot?: 1 | 2 | 3 | 4 | 5
}

type DonutChartProps = {
  segments: DonutSegment[]
  /** Outer radius in SVG units (default 44). */
  radius?: number
  /** Stroke width of the arc (default 12). */
  thickness?: number
  /** Gap between segments in radians (default 0.04). */
  gapRad?: number
  /** Content placed in the centre of the donut. */
  center?: React.ReactNode
  className?: string
  'aria-label'?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * DonutChart — SVG arcs using strokeDasharray/strokeDashoffset with rounded
 * line-caps and a configurable gap between segments.  The centre slot accepts
 * arbitrary content (e.g. a `text-mono-kpi` total).
 */
export function DonutChart({
  segments,
  radius = 44,
  thickness = 12,
  gapRad = 0.04,
  center,
  className,
  'aria-label': ariaLabel,
}: DonutChartProps) {
  const id = useId()
  const reducedMotion = useReducedMotion()

  const cx = 50
  const cy = 50
  const viewBox = '0 0 100 100'

  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0)

  // Circumference of the arc circle
  const circumference = 2 * Math.PI * radius

  // Build arc descriptors
  type ArcDesc = {
    path: string
    color: string
    dashLen: number
    key: string
    animDelay: number
  }

  let cursor = 0 // running angle in radians, 0 = top (12-o'clock)
  const arcs: ArcDesc[] = []

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    if (!seg || seg.value <= 0) continue

    const fraction = seg.value / total
    const arcAngle = fraction * 2 * Math.PI - gapRad
    if (arcAngle <= 0) {
      cursor += fraction * 2 * Math.PI
      continue
    }

    const startAngle = cursor + gapRad / 2
    const endAngle = startAngle + arcAngle

    const slot = (seg.colorSlot ?? (i % 5) + 1) as 1 | 2 | 3 | 4 | 5
    const color = chartColorVar(slot)
    const path = donutArcPath(cx, cy, radius, startAngle, endAngle)

    // strokeDasharray length for draw-in animation
    const arcLen = (arcAngle / (2 * Math.PI)) * circumference

    arcs.push({
      path,
      color,
      dashLen: arcLen,
      key: `${seg.label}-${i}`,
      animDelay: i * 0.12,
    })

    cursor += fraction * 2 * Math.PI
  }

  // SVG size: viewBox is 0 0 100 100
  const svgSize = radius * 2 + thickness + 4 // +4 for strokeLinecap overflow
  const a11yProps = ariaLabel ? ({ role: 'img', 'aria-label': ariaLabel } as const) : {}

  return (
    <div
      data-slot="donut-chart"
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: svgSize, height: svgSize }}
      {...a11yProps}
    >
      <svg
        viewBox={viewBox}
        width={svgSize}
        height={svgSize}
        aria-hidden="true"
        className="absolute inset-0"
      >
        {!reducedMotion && arcs.length > 0 && (
          <style>
            {arcs
              .map(
                (arc) => `
              @keyframes donut-draw-${id}-${arc.key} {
                from { stroke-dashoffset: ${arc.dashLen.toFixed(2)}; }
                to   { stroke-dashoffset: 0; }
              }
            `
              )
              .join('')}
          </style>
        )}

        {/* Background track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          strokeOpacity="0.08"
          className="text-foreground"
        />

        {/* Segments */}
        {arcs.map((arc) => {
          const animStyle: React.CSSProperties = reducedMotion
            ? {}
            : {
                strokeDasharray: arc.dashLen,
                strokeDashoffset: arc.dashLen,
                animation: `donut-draw-${id}-${arc.key} 0.7s ease-out ${arc.animDelay}s forwards`,
              }

          return (
            <path
              key={arc.key}
              d={arc.path}
              fill="none"
              stroke={arc.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              style={animStyle}
            />
          )
        })}
      </svg>

      {/* Centre slot — arbitrary content, typically mono-kpi total */}
      {center !== undefined && (
        <div
          data-slot="donut-center"
          className="relative z-10 flex flex-col items-center justify-center text-center"
        >
          {center}
        </div>
      )}
    </div>
  )
}
