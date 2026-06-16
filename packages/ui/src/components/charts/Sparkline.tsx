'use client'

import { useId } from 'react'
import { buildLinePath, linearScale } from '@/lib/chartUtils'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { cn } from '@/lib/utils'

type SparklineProps = {
  /** Data series — raw numeric values. */
  data: number[]
  /** Width of the SVG in px (default 80). */
  width?: number
  /** Height of the SVG in px (default 24). */
  height?: number
  /** Stroke width (default 1.5). */
  strokeWidth?: number
  className?: string
}

/**
 * Sparkline — tiny inline SVG polyline, single series, no axes, no labels.
 * Uses `--color-chart-1` for the stroke.
 */
export function Sparkline({
  data,
  width = 80,
  height = 24,
  strokeWidth = 1.5,
  className,
}: SparklineProps) {
  const id = useId()
  const reducedMotion = useReducedMotion()

  if (data.length === 0) {
    return (
      <svg
        data-slot="sparkline"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        className={cn('overflow-visible', className)}
      />
    )
  }

  const pad = strokeWidth
  const minVal = Math.min(...data)
  const maxVal = Math.max(...data)

  const scaleX = linearScale(0, data.length - 1, pad, width - pad)
  // Y-axis: SVG origin is top-left, data grows up → invert range.
  const scaleY = linearScale(minVal, maxVal, height - pad, pad)

  const points = data.map((value, i) => ({
    x: data.length === 1 ? width / 2 : scaleX(i),
    y: minVal === maxVal ? height / 2 : scaleY(value),
  }))

  const pathD = buildLinePath(points)

  // Draw-in animation via stroke-dashoffset.
  // The total path length is approximated; SVG animates to 0 offset.
  const animStyle: React.CSSProperties = reducedMotion
    ? {}
    : {
        strokeDasharray: '1000',
        strokeDashoffset: '1000',
        animation: `sparkline-draw-in-${id} 0.8s ease-out forwards`,
      }

  return (
    <svg
      data-slot="sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className={cn('overflow-visible', className)}
    >
      {!reducedMotion && (
        <style>{`
          @keyframes sparkline-draw-in-${id} {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      )}
      <path
        d={pathD}
        fill="none"
        stroke="var(--color-chart-1)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={animStyle}
      />
    </svg>
  )
}
