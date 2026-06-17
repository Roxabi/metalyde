import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// ---------------------------------------------------------------------------
// Mock useReducedMotion
// ---------------------------------------------------------------------------
const mockUseReducedMotion = vi.fn(() => false)
vi.mock('@/lib/useReducedMotion', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}))

import { DonutChart } from './DonutChart'

const SAMPLE_SEGMENTS = [
  { label: 'Alpha', value: 40 },
  { label: 'Beta', value: 30 },
  { label: 'Gamma', value: 30 },
]

describe('DonutChart', () => {
  it('renders a container with data-slot="donut-chart"', () => {
    // Arrange & Act
    const { container } = render(<DonutChart segments={SAMPLE_SEGMENTS} />)
    // Assert
    const root = container.querySelector('[data-slot="donut-chart"]')
    expect(root).toBeInTheDocument()
  })

  it('renders an SVG element inside the container', () => {
    // Arrange & Act
    const { container } = render(<DonutChart segments={SAMPLE_SEGMENTS} />)
    // Assert
    const svg = container.querySelector('[data-slot="donut-chart"] svg')
    expect(svg).toBeInTheDocument()
  })

  it('marks the SVG as aria-hidden', () => {
    // Arrange & Act
    const { container } = render(<DonutChart segments={SAMPLE_SEGMENTS} />)
    // Assert
    const svg = container.querySelector('[data-slot="donut-chart"] svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies aria-label and role="img" when aria-label prop is provided', () => {
    // Arrange & Act
    render(<DonutChart segments={SAMPLE_SEGMENTS} aria-label="Traffic breakdown" />)
    // Assert
    const root = screen.getByRole('img', { name: 'Traffic breakdown' })
    expect(root).toBeInTheDocument()
  })

  it('does not set role="img" when aria-label is omitted', () => {
    // Arrange & Act
    const { container } = render(<DonutChart segments={SAMPLE_SEGMENTS} />)
    // Assert
    const root = container.querySelector('[data-slot="donut-chart"]')
    expect(root).not.toHaveAttribute('role', 'img')
  })

  it('renders arc path elements for each positive segment', () => {
    // Arrange & Act
    const { container } = render(<DonutChart segments={SAMPLE_SEGMENTS} />)
    // Assert — fill="none" paths are arc segments (background circle uses fill="none" too,
    // so expect at least SAMPLE_SEGMENTS.length paths with stroke set to a --color-chart-* var)
    const paths = Array.from(container.querySelectorAll('[data-slot="donut-chart"] svg path'))
    const arcPaths = paths.filter((p) => p.getAttribute('stroke')?.startsWith('var(--color-chart-'))
    expect(arcPaths.length).toBe(SAMPLE_SEGMENTS.length)
  })

  it('renders a background track circle with strokeOpacity 0.08', () => {
    // Arrange & Act
    const { container } = render(<DonutChart segments={SAMPLE_SEGMENTS} />)
    // Assert
    const circles = Array.from(container.querySelectorAll('[data-slot="donut-chart"] svg circle'))
    const track = circles.find((c) => c.getAttribute('stroke-opacity') === '0.08')
    expect(track).toBeInTheDocument()
  })

  it('renders arc paths with strokeLinecap="round"', () => {
    // Arrange & Act
    const { container } = render(<DonutChart segments={SAMPLE_SEGMENTS} />)
    // Assert
    const paths = Array.from(container.querySelectorAll('[data-slot="donut-chart"] svg path'))
    const arcPaths = paths.filter((p) => p.getAttribute('stroke')?.startsWith('var(--color-chart-'))
    arcPaths.forEach((p) => {
      expect(p).toHaveAttribute('stroke-linecap', 'round')
    })
  })

  it('renders a <style> keyframe block per arc when reduced motion is inactive', () => {
    // Arrange
    mockUseReducedMotion.mockReturnValue(false)
    const { container } = render(<DonutChart segments={SAMPLE_SEGMENTS} />)
    // Assert — a <style> element exists with keyframe content
    const styleEl = container.querySelector('[data-slot="donut-chart"] svg style')
    expect(styleEl).toBeInTheDocument()
    expect(styleEl?.textContent).toContain('@keyframes')
  })

  it('omits animation <style> block when prefers-reduced-motion is active', () => {
    // Arrange
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = render(<DonutChart segments={SAMPLE_SEGMENTS} />)
    // Assert
    const styleEl = container.querySelector('[data-slot="donut-chart"] svg style')
    expect(styleEl).not.toBeInTheDocument()
  })

  it('uses index-based cssKey in keyframe names (not label-based)', () => {
    // Arrange
    mockUseReducedMotion.mockReturnValue(false)
    const { container } = render(<DonutChart segments={SAMPLE_SEGMENTS} />)
    // Assert — keyframe names contain "-0", "-1", "-2" (index keys), not segment labels
    const styleEl = container.querySelector('[data-slot="donut-chart"] svg style')
    const styleText = styleEl?.textContent ?? ''
    expect(styleText).toMatch(/-0[\s{]/)
    expect(styleText).toMatch(/-1[\s{]/)
    expect(styleText).toMatch(/-2[\s{]/)
    // Labels must NOT appear as cssKey in keyframe names
    expect(styleText).not.toContain('donut-draw-Alpha')
  })

  it('renders the center slot when center prop is provided', () => {
    // Arrange & Act
    const { container } = render(
      <DonutChart segments={SAMPLE_SEGMENTS} center={<span>42%</span>} />
    )
    // Assert
    const centerSlot = container.querySelector('[data-slot="donut-center"]')
    expect(centerSlot).toBeInTheDocument()
    expect(centerSlot?.textContent).toBe('42%')
  })

  it('does not render center slot when center prop is omitted', () => {
    // Arrange & Act
    const { container } = render(<DonutChart segments={SAMPLE_SEGMENTS} />)
    // Assert
    const centerSlot = container.querySelector('[data-slot="donut-center"]')
    expect(centerSlot).not.toBeInTheDocument()
  })

  it('skips segments with zero or negative values', () => {
    // Arrange — only the positive segment should produce an arc
    const segments = [
      { label: 'Zero', value: 0 },
      { label: 'Negative', value: -10 },
      { label: 'Positive', value: 50 },
    ]
    const { container } = render(<DonutChart segments={segments} />)
    // Assert — only 1 arc path (the positive segment)
    const paths = Array.from(container.querySelectorAll('[data-slot="donut-chart"] svg path'))
    const arcPaths = paths.filter((p) => p.getAttribute('stroke')?.startsWith('var(--color-chart-'))
    expect(arcPaths.length).toBe(1)
  })

  it('renders without crashing when all segments are zero', () => {
    // Arrange & Act
    const { container } = render(<DonutChart segments={[{ label: 'A', value: 0 }]} />)
    // Assert — container renders; no arc paths
    const root = container.querySelector('[data-slot="donut-chart"]')
    expect(root).toBeInTheDocument()
    const paths = Array.from(container.querySelectorAll('[data-slot="donut-chart"] svg path'))
    const arcPaths = paths.filter((p) => p.getAttribute('stroke')?.startsWith('var(--color-chart-'))
    expect(arcPaths.length).toBe(0)
  })

  it('renders without crashing when segments array is empty', () => {
    // Arrange & Act
    const { container } = render(<DonutChart segments={[]} />)
    // Assert
    const root = container.querySelector('[data-slot="donut-chart"]')
    expect(root).toBeInTheDocument()
  })

  it('applies animation strokeDasharray style on arcs when reduced motion is inactive', () => {
    // Arrange
    mockUseReducedMotion.mockReturnValue(false)
    const { container } = render(<DonutChart segments={SAMPLE_SEGMENTS} />)
    // Assert — arc paths carry a style with stroke-dasharray
    const paths = Array.from(container.querySelectorAll('[data-slot="donut-chart"] svg path'))
    const arcPaths = paths.filter((p) => p.getAttribute('stroke')?.startsWith('var(--color-chart-'))
    arcPaths.forEach((p) => {
      const style = (p as HTMLElement).getAttribute('style') ?? ''
      expect(style).toContain('stroke-dasharray')
    })
  })

  it('omits strokeDasharray style on arcs when reduced motion is active', () => {
    // Arrange
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = render(<DonutChart segments={SAMPLE_SEGMENTS} />)
    // Assert — arc paths have no stroke-dasharray
    const paths = Array.from(container.querySelectorAll('[data-slot="donut-chart"] svg path'))
    const arcPaths = paths.filter((p) => p.getAttribute('stroke')?.startsWith('var(--color-chart-'))
    arcPaths.forEach((p) => {
      const style = (p as HTMLElement).getAttribute('style') ?? ''
      expect(style).not.toContain('stroke-dasharray')
    })
  })

  it('respects custom colorSlot on a segment', () => {
    // Arrange
    const segments = [{ label: 'Custom', value: 100, colorSlot: 4 as const }]
    const { container } = render(<DonutChart segments={segments} />)
    // Assert
    const paths = Array.from(container.querySelectorAll('[data-slot="donut-chart"] svg path'))
    const arcPath = paths.find((p) => p.getAttribute('stroke') === 'var(--color-chart-4)')
    expect(arcPath).toBeInTheDocument()
  })

  it('sizes the SVG according to radius and thickness props', () => {
    // Arrange — radius=30, thickness=8 → svgSize = 30*2 + 8 + 4 = 72
    const { container } = render(
      <DonutChart segments={SAMPLE_SEGMENTS} radius={30} thickness={8} />
    )
    // Assert
    const svg = container.querySelector('[data-slot="donut-chart"] svg')
    expect(svg).toHaveAttribute('width', '72')
    expect(svg).toHaveAttribute('height', '72')
  })
})
