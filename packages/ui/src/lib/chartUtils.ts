/**
 * chartUtils.ts — pure SVG chart helpers, zero dependencies.
 *
 * All functions are pure (no side effects, no DOM access).
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ChartValueFormat = 'money' | 'number' | 'percent'

/** Returned by linearScale — maps a domain value to a range value. */
export type ScaleFn = (value: number) => number

// ---------------------------------------------------------------------------
// linearScale
// ---------------------------------------------------------------------------

/**
 * Build a linear mapping from [domainMin, domainMax] → [rangeMin, rangeMax].
 * Clamping is intentionally omitted so callers control overflow behaviour.
 */
export function linearScale(
  domainMin: number,
  domainMax: number,
  rangeMin: number,
  rangeMax: number
): ScaleFn {
  const domainSpan = domainMax - domainMin
  const rangeSpan = rangeMax - rangeMin

  if (domainSpan === 0) {
    // Degenerate domain — map everything to the midpoint of the range.
    const mid = (rangeMin + rangeMax) / 2
    return () => mid
  }

  return (value: number) => rangeMin + ((value - domainMin) / domainSpan) * rangeSpan
}

// ---------------------------------------------------------------------------
// niceTicks
// ---------------------------------------------------------------------------

/**
 * Return an array of `count` human-friendly tick values spanning [min, max].
 * The returned ticks are rounded to a "nice" magnitude so labels stay clean.
 *
 * @param min   Data minimum.
 * @param max   Data maximum.
 * @param count Desired number of ticks (may return ±1 depending on rounding).
 */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) {
    return [min]
  }

  const rawStep = (max - min) / Math.max(1, count - 1)
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const normalised = rawStep / magnitude

  let niceStep: number
  if (normalised <= 1) niceStep = Number(magnitude)
  else if (normalised <= 2) niceStep = 2 * magnitude
  else if (normalised <= 2.5) niceStep = 2.5 * magnitude
  else if (normalised <= 5) niceStep = 5 * magnitude
  else niceStep = 10 * magnitude

  const niceMin = Math.floor(min / niceStep) * niceStep
  const niceMax = Math.ceil(max / niceStep) * niceStep

  const ticks: number[] = []
  // Guard: cap iterations to avoid infinite loops with floating-point drift.
  const maxTicks = count * 2 + 2
  let current = niceMin
  while (current <= niceMax + niceStep * 0.001 && ticks.length < maxTicks) {
    ticks.push(parseFloat(current.toPrecision(12)))
    current += niceStep
  }

  return ticks
}

// ---------------------------------------------------------------------------
// buildLinePath
// ---------------------------------------------------------------------------

/**
 * Build an SVG `d` attribute string for a polyline passing through all points.
 * Points are expected in SVG coordinate space (origin top-left).
 */
export function buildLinePath(points: Array<{ x: number; y: number }>): string {
  const [first] = points
  if (!first) return ''
  if (points.length === 1) {
    return `M ${first.x} ${first.y}`
  }

  return points
    .map(({ x, y }, i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(' ')
}

// ---------------------------------------------------------------------------
// buildAreaPath
// ---------------------------------------------------------------------------

/**
 * Build an SVG `d` attribute string for a closed area shape.
 * The path traces the line, then returns along the baseline (y = baselineY),
 * forming a closed polygon suitable for a `fill`.
 */
export function buildAreaPath(points: Array<{ x: number; y: number }>, baselineY: number): string {
  const first = points[0]
  const last = points[points.length - 1]
  if (!(first && last)) return ''

  const linePart = buildLinePath(points)

  // Close: go to baseline at last x, across to first x, back up to first point, close.
  return `${linePart} L ${last.x.toFixed(2)} ${baselineY.toFixed(2)} L ${first.x.toFixed(2)} ${baselineY.toFixed(2)} Z`
}

// ---------------------------------------------------------------------------
// donutArcPath
// ---------------------------------------------------------------------------

/**
 * Build an SVG arc `d` attribute for a single donut segment.
 *
 * @param cx          Centre x.
 * @param cy          Centre y.
 * @param r           Outer radius.
 * @param startAngle  Start angle in radians (0 = top / 12-o'clock via offset).
 * @param endAngle    End angle in radians.
 */
export function donutArcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  // Convert from "top = 0" convention to standard trig (right = 0).
  const toX = (angle: number) => cx + r * Math.sin(angle)
  const toY = (angle: number) => cy - r * Math.cos(angle)

  const x1 = toX(startAngle)
  const y1 = toY(startAngle)
  const x2 = toX(endAngle)
  const y2 = toY(endAngle)

  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0

  return [
    `M ${x1.toFixed(4)} ${y1.toFixed(4)}`,
    `A ${r} ${r} 0 ${largeArcFlag} 1 ${x2.toFixed(4)} ${y2.toFixed(4)}`,
  ].join(' ')
}

// ---------------------------------------------------------------------------
// nearestIndex
// ---------------------------------------------------------------------------

/**
 * Return the index of the data point whose x-value is closest to `xPixel`.
 * Intended for pointer-move hit detection.
 *
 * @param xPixel    Pointer x position in SVG coordinate space.
 * @param xValues   Array of pre-scaled x pixel positions for each data point.
 */
export function nearestIndex(xPixel: number, xValues: number[]): number {
  let bestIdx = -1
  let bestDist = Number.POSITIVE_INFINITY

  for (let i = 0; i < xValues.length; i++) {
    const value = xValues[i]
    if (value === undefined) continue
    const dist = Math.abs(value - xPixel)
    if (dist < bestDist) {
      bestDist = dist
      bestIdx = i
    }
  }

  return bestIdx
}

// ---------------------------------------------------------------------------
// chartColorVar
// ---------------------------------------------------------------------------

/**
 * Return the CSS custom property reference for a chart palette slot (1–5).
 * Clamps to [1, 5] to avoid invalid tokens.
 */
export function chartColorVar(slot: 1 | 2 | 3 | 4 | 5): string {
  return `var(--color-chart-${slot})`
}
