import { describe, expect, it } from 'vitest'

import {
  buildAreaPath,
  buildLinePath,
  chartColorVar,
  donutArcPath,
  linearScale,
  nearestIndex,
  niceTicks,
} from './chartUtils'

// ---------------------------------------------------------------------------
// linearScale
// ---------------------------------------------------------------------------

describe('linearScale', () => {
  it('maps domain min to range min', () => {
    // Arrange
    const scale = linearScale(0, 100, 0, 400)
    // Act & Assert
    expect(scale(0)).toBe(0)
  })

  it('maps domain max to range max', () => {
    // Arrange
    const scale = linearScale(0, 100, 0, 400)
    // Act & Assert
    expect(scale(100)).toBe(400)
  })

  it('maps midpoint correctly', () => {
    // Arrange
    const scale = linearScale(0, 100, 0, 400)
    // Act & Assert
    expect(scale(50)).toBe(200)
  })

  it('supports inverted range (flip y-axis)', () => {
    // Arrange — SVG y-axis is inverted vs data
    const scale = linearScale(0, 100, 300, 0)
    // Act & Assert
    expect(scale(0)).toBe(300)
    expect(scale(100)).toBe(0)
    expect(scale(50)).toBe(150)
  })

  it('handles negative domain', () => {
    // Arrange
    const scale = linearScale(-50, 50, 0, 200)
    // Act & Assert
    expect(scale(-50)).toBe(0)
    expect(scale(0)).toBe(100)
    expect(scale(50)).toBe(200)
  })

  it('returns midpoint for degenerate domain (min === max)', () => {
    // Arrange
    const scale = linearScale(5, 5, 10, 90)
    // Act & Assert — midpoint of [10, 90] = 50
    expect(scale(5)).toBe(50)
    expect(scale(999)).toBe(50)
  })
})

// ---------------------------------------------------------------------------
// niceTicks
// ---------------------------------------------------------------------------

describe('niceTicks', () => {
  it('returns a single tick when min === max', () => {
    // Arrange & Act
    const ticks = niceTicks(42, 42)
    // Assert
    expect(ticks).toHaveLength(1)
    expect(ticks[0]).toBe(42)
  })

  it('returns ticks that cover the full [min, max] range', () => {
    // Arrange
    const min = 0
    const max = 100
    // Act
    const ticks = niceTicks(min, max, 5)
    // Assert
    expect(ticks[0]).toBeLessThanOrEqual(min)
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(max)
  })

  it('produces round step values for clean data', () => {
    // Arrange & Act
    const ticks = niceTicks(0, 1000, 5)
    // Assert — exact array: rawStep=250, magnitude=100, normalised=2.5 → niceStep=250
    expect(ticks).toEqual([0, 250, 500, 750, 1000])
    // Assert — step is a nice number (250 = 2.5 × 10²), not an arbitrary non-nice value
    const step = (ticks[1] ?? 0) - (ticks[0] ?? 0)
    expect(step).toBe(250)
    // Assert — all steps are uniform
    for (let i = 1; i < ticks.length; i++) {
      const curr = ticks[i]
      const prev = ticks[i - 1]
      if (curr === undefined || prev === undefined) continue
      expect(curr - prev).toBe(step)
    }
  })

  it('handles small fractional ranges', () => {
    // Arrange & Act — rawStep=0.2, magnitude=0.1, normalised=2.0 → niceStep=0.2, niceMin=0, niceMax=1.0
    const ticks = niceTicks(0.1, 0.9, 5)
    // Assert — exact array
    expect(ticks).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1])
    // Assert — bounds cover original range
    expect(ticks[0]).toBeLessThanOrEqual(0.1)
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(0.9)
    // Assert — all steps are equal (uniform nice step)
    const step = (ticks[1] ?? 0) - (ticks[0] ?? 0)
    for (let i = 1; i < ticks.length; i++) {
      const curr = ticks[i]
      const prev = ticks[i - 1]
      if (curr === undefined || prev === undefined) continue
      expect(curr - prev).toBeCloseTo(step, 10)
    }
  })

  it('handles large ranges', () => {
    // Arrange & Act — rawStep=250000, magnitude=100000, normalised=2.5 → niceStep=250000
    const ticks = niceTicks(0, 1_000_000, 5)
    // Assert — exact array
    expect(ticks).toEqual([0, 250000, 500000, 750000, 1000000])
    // Assert — bounds cover original range
    expect(ticks[0]).toBeLessThanOrEqual(0)
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(1_000_000)
    // Assert — all steps are equal (uniform nice step)
    const step = (ticks[1] ?? 0) - (ticks[0] ?? 0)
    for (let i = 1; i < ticks.length; i++) {
      const curr = ticks[i]
      const prev = ticks[i - 1]
      if (curr === undefined || prev === undefined) continue
      expect(curr - prev).toBe(step)
    }
  })
})

// ---------------------------------------------------------------------------
// buildLinePath
// ---------------------------------------------------------------------------

describe('buildLinePath', () => {
  it('returns empty string for empty points array', () => {
    // Arrange & Act
    expect(buildLinePath([])).toBe('')
  })

  it('returns a single Move command for one point', () => {
    // Arrange & Act
    const result = buildLinePath([{ x: 10, y: 20 }])
    // Assert
    expect(result).toBe('M 10 20')
  })

  it('starts with M and continues with L commands', () => {
    // Arrange
    const points = [
      { x: 0, y: 0 },
      { x: 10, y: 5 },
      { x: 20, y: 10 },
    ]
    // Act
    const result = buildLinePath(points)
    // Assert
    expect(result).toMatch(/^M /)
    expect(result).toContain('L ')
    expect(result.split('L ').length).toBe(3) // 1 M + 2 L segments → 3 parts
  })
})

// ---------------------------------------------------------------------------
// buildAreaPath
// ---------------------------------------------------------------------------

describe('buildAreaPath', () => {
  it('returns empty string for empty points array', () => {
    // Arrange & Act
    expect(buildAreaPath([], 100)).toBe('')
  })

  it('closes the path with Z', () => {
    // Arrange
    const points = [
      { x: 0, y: 50 },
      { x: 100, y: 20 },
      { x: 200, y: 80 },
    ]
    // Act
    const result = buildAreaPath(points, 100)
    // Assert
    expect(result).toMatch(/Z$/)
  })

  it('includes the baseline y value', () => {
    // Arrange
    const points = [
      { x: 0, y: 50 },
      { x: 100, y: 20 },
    ]
    const baselineY = 200
    // Act
    const result = buildAreaPath(points, baselineY)
    // Assert
    expect(result).toContain('200.00')
  })
})

// ---------------------------------------------------------------------------
// donutArcPath
// ---------------------------------------------------------------------------

describe('donutArcPath', () => {
  it('returns a path string starting with M', () => {
    // Arrange & Act
    const result = donutArcPath(50, 50, 40, 0, Math.PI)
    // Assert
    expect(result).toMatch(/^M /)
  })

  it('includes an arc command (A)', () => {
    // Arrange & Act
    const result = donutArcPath(50, 50, 40, 0, Math.PI)
    // Assert
    expect(result).toContain(' A ')
  })

  it('sets large-arc-flag = 1 for arcs > 180°', () => {
    // Arrange — 270° arc (3π/2 > π) → largeArcFlag must be 1
    const result = donutArcPath(50, 50, 40, 0, Math.PI * 1.5)
    // Act — extract flags positionally from the A command: A rx ry x-rot large-arc sweep x y
    // Path format: "M x1 y1 A r r 0 <largeArcFlag> <sweepFlag> x2 y2"
    const match = result.match(/A\s[\d.]+\s[\d.]+\s\d+\s([01])\s([01])\s/)
    expect(match).not.toBeNull()
    const largeArcFlag = match?.[1]
    const sweepFlag = match?.[2]
    // Assert — large-arc-flag = 1 (arc > π), sweep-flag always = 1
    expect(largeArcFlag).toBe('1')
    expect(sweepFlag).toBe('1')
  })

  it('sets large-arc-flag = 0 for arcs ≤ 180°', () => {
    // Arrange — quarter circle (π/2 < π) → largeArcFlag must be 0
    const result = donutArcPath(50, 50, 40, 0, Math.PI / 2)
    // Act — extract flags positionally from the A command
    const match = result.match(/A\s[\d.]+\s[\d.]+\s\d+\s([01])\s([01])\s/)
    expect(match).not.toBeNull()
    const largeArcFlag = match?.[1]
    const sweepFlag = match?.[2]
    // Assert — large-arc-flag = 0 (arc ≤ π), sweep-flag always = 1
    expect(largeArcFlag).toBe('0')
    expect(sweepFlag).toBe('1')
  })
})

// ---------------------------------------------------------------------------
// nearestIndex
// ---------------------------------------------------------------------------

describe('nearestIndex', () => {
  it('returns -1 for empty array', () => {
    // Arrange & Act
    expect(nearestIndex(50, [])).toBe(-1)
  })

  it('returns 0 for single-element array', () => {
    // Arrange & Act
    expect(nearestIndex(99, [10])).toBe(0)
  })

  it('returns index of nearest x value', () => {
    // Arrange
    const xValues = [0, 50, 100, 150, 200]
    // Act & Assert
    expect(nearestIndex(60, xValues)).toBe(1) // 60 is nearest to 50
    expect(nearestIndex(130, xValues)).toBe(3) // 130 is nearest to 150
    expect(nearestIndex(0, xValues)).toBe(0)
    expect(nearestIndex(200, xValues)).toBe(4)
  })

  it('handles exact match', () => {
    // Arrange
    const xValues = [10, 50, 90]
    // Act & Assert
    expect(nearestIndex(50, xValues)).toBe(1)
  })
})

// ---------------------------------------------------------------------------
// chartColorVar
// ---------------------------------------------------------------------------

describe('chartColorVar', () => {
  it('returns a CSS var reference for slot 1', () => {
    // Arrange & Act
    expect(chartColorVar(1)).toBe('var(--color-chart-1)')
  })

  it('returns a CSS var reference for slot 5', () => {
    // Arrange & Act
    expect(chartColorVar(5)).toBe('var(--color-chart-5)')
  })

  it('returns correct slot numbers for all valid slots', () => {
    // Arrange
    const slots = [1, 2, 3, 4, 5] as const
    // Act & Assert
    for (const slot of slots) {
      expect(chartColorVar(slot)).toBe(`var(--color-chart-${slot})`)
    }
  })
})
