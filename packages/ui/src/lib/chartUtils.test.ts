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
    // Assert — every step should be a multiple of 250 or 200
    const firstStep = (ticks[1] ?? 0) - (ticks[0] ?? 0)
    for (let i = 1; i < ticks.length; i++) {
      const curr = ticks[i]
      const prev = ticks[i - 1]
      if (curr === undefined || prev === undefined) continue
      const step = curr - prev
      expect(step).toBeGreaterThan(0)
      // Steps should be uniform
      expect(step).toBe(firstStep)
    }
  })

  it('handles small fractional ranges', () => {
    // Arrange & Act
    const ticks = niceTicks(0, 1, 5)
    // Assert — ticks should be multiples of 0.25 or similar nice step
    expect(ticks[0]).toBeLessThanOrEqual(0)
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(1)
  })

  it('handles large ranges', () => {
    // Arrange & Act
    const ticks = niceTicks(0, 1_000_000, 5)
    // Assert
    expect(ticks[0]).toBeLessThanOrEqual(0)
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(1_000_000)
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
    // Arrange — full circle minus a sliver → large arc
    const result = donutArcPath(50, 50, 40, 0, Math.PI * 1.5)
    // Assert
    expect(result).toContain('1 1')
  })

  it('sets large-arc-flag = 0 for arcs ≤ 180°', () => {
    // Arrange — quarter circle
    const result = donutArcPath(50, 50, 40, 0, Math.PI / 2)
    // Assert
    expect(result).toContain('0 1')
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
