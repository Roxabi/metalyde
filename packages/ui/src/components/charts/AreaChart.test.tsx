import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// ---------------------------------------------------------------------------
// Mock useReducedMotion
// ---------------------------------------------------------------------------
const mockUseReducedMotion = vi.fn(() => false)
vi.mock('@/lib/useReducedMotion', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}))

import { AreaChart } from './AreaChart'

const SAMPLE_DATA = [
  { label: 'Jan', value: 100 },
  { label: 'Feb', value: 180 },
  { label: 'Mar', value: 140 },
  { label: 'Apr', value: 220 },
  { label: 'May', value: 190 },
]

describe('AreaChart', () => {
  it('renders a container with data-slot="area-chart"', () => {
    // Arrange & Act
    const { container } = render(<AreaChart data={SAMPLE_DATA} />)
    // Assert
    const root = container.querySelector('[data-slot="area-chart"]')
    expect(root).toBeInTheDocument()
  })

  it('renders an SVG element', () => {
    // Arrange & Act
    const { container } = render(<AreaChart data={SAMPLE_DATA} />)
    // Assert
    const svg = container.querySelector('[data-slot="area-chart"] svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders gridlines for each tick', () => {
    // Arrange & Act
    const { container } = render(<AreaChart data={SAMPLE_DATA} gridLines={4} />)
    // Assert — each gridline is a <line> element
    const lines = container.querySelectorAll('[data-slot="area-chart"] svg line')
    expect(lines.length).toBeGreaterThan(0)
  })

  it('renders x-axis labels for each data point', () => {
    // Arrange & Act
    const { container } = render(<AreaChart data={SAMPLE_DATA} />)
    // Assert — expect text nodes containing the labels
    expect(container.querySelector('[data-slot="area-chart"]')?.textContent).toContain('Jan')
    expect(container.querySelector('[data-slot="area-chart"]')?.textContent).toContain('May')
  })

  it('renders a line path', () => {
    // Arrange & Act
    const { container } = render(<AreaChart data={SAMPLE_DATA} />)
    // Assert — at least one path with fill="none" (the line)
    const paths = Array.from(container.querySelectorAll('[data-slot="area-chart"] svg path'))
    const linePath = paths.find((p) => p.getAttribute('fill') === 'none')
    expect(linePath).toBeInTheDocument()
  })

  it('renders an area fill path', () => {
    // Arrange & Act
    const { container } = render(<AreaChart data={SAMPLE_DATA} />)
    // Assert — at least one path with a url() fill (the gradient area)
    const paths = Array.from(container.querySelectorAll('[data-slot="area-chart"] svg path'))
    const areaPath = paths.find((p) => p.getAttribute('fill')?.startsWith('url('))
    expect(areaPath).toBeInTheDocument()
  })

  it('uses --color-chart-1 by default for the line', () => {
    // Arrange & Act
    const { container } = render(<AreaChart data={SAMPLE_DATA} />)
    // Assert
    const paths = Array.from(container.querySelectorAll('[data-slot="area-chart"] svg path'))
    const linePath = paths.find((p) => p.getAttribute('fill') === 'none')
    expect(linePath).toHaveAttribute('stroke', 'var(--color-chart-1)')
  })

  it('uses --color-chart-2 when colorSlot=2', () => {
    // Arrange & Act
    const { container } = render(<AreaChart data={SAMPLE_DATA} colorSlot={2} />)
    // Assert
    const paths = Array.from(container.querySelectorAll('[data-slot="area-chart"] svg path'))
    const linePath = paths.find((p) => p.getAttribute('fill') === 'none')
    expect(linePath).toHaveAttribute('stroke', 'var(--color-chart-2)')
  })

  it('applies aria-label and role="img" when aria-label is provided', () => {
    // Arrange & Act
    render(<AreaChart data={SAMPLE_DATA} aria-label="Revenue over time" />)
    // Assert
    const root = screen.getByRole('img', { name: 'Revenue over time' })
    expect(root).toBeInTheDocument()
  })

  it('omits animation when prefers-reduced-motion is active', () => {
    // Arrange
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = render(<AreaChart data={SAMPLE_DATA} />)
    // Assert — no <style> keyframe blocks
    const styleEl = container.querySelector('[data-slot="area-chart"] svg style')
    expect(styleEl).not.toBeInTheDocument()
  })

  it('renders without crashing when data is empty', () => {
    // Arrange & Act
    const { container } = render(<AreaChart data={[]} />)
    // Assert
    const root = container.querySelector('[data-slot="area-chart"]')
    expect(root).toBeInTheDocument()
    // No paths rendered
    const paths = container.querySelectorAll('[data-slot="area-chart"] svg path')
    expect(paths.length).toBe(0)
  })

  it('renders with a single data point without crashing', () => {
    // Arrange & Act
    const { container } = render(<AreaChart data={[{ label: 'Q1', value: 500 }]} />)
    // Assert
    const root = container.querySelector('[data-slot="area-chart"]')
    expect(root).toBeInTheDocument()
  })

  it('uses custom formatY when provided', () => {
    // Arrange
    const formatY = (v: number) => `$${v}`
    const { container } = render(<AreaChart data={SAMPLE_DATA} formatY={formatY} />)
    // Assert — formatted tick labels appear in the SVG text nodes
    const textNodes = container.querySelectorAll('[data-slot="area-chart"] svg text')
    const allText = Array.from(textNodes)
      .map((t) => t.textContent)
      .join(' ')
    expect(allText).toMatch(/\$/)
  })

  it('shows tooltip and hover dot when mouse moves over SVG', () => {
    // Arrange
    mockUseReducedMotion.mockReturnValue(false)
    const { container } = render(<AreaChart data={SAMPLE_DATA} />)
    const svg = container.querySelector('[data-slot="area-chart"] svg') as SVGSVGElement
    // Mock getBoundingClientRect so coordinate math is deterministic
    svg.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    // Act — fire mouse move at clientX=50; svgX=(50/100)*100=50
    // nearestIndex(50, [40,54,68,82,96]) → index 1 (Feb, value=180)
    fireEvent.mouseMove(svg, { clientX: 50, clientY: 50 })
    // Assert — tooltip shows the nearest point label + formatted value
    const chart = container.querySelector('[data-slot="area-chart"]') as HTMLElement
    expect(chart.textContent).toContain('Feb')
    // The compact formatter produces "180" for 180
    expect(chart.textContent).toMatch(/180/)
    // Assert — hover dot <circle> appears
    const circle = container.querySelector('[data-slot="area-chart"] svg circle')
    expect(circle).toBeInTheDocument()
  })

  it('hides tooltip and hover dot after mouse leaves SVG', () => {
    // Arrange
    mockUseReducedMotion.mockReturnValue(false)
    const { container } = render(<AreaChart data={SAMPLE_DATA} />)
    const svg = container.querySelector('[data-slot="area-chart"] svg') as SVGSVGElement
    svg.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    // Act — hover then leave
    fireEvent.mouseMove(svg, { clientX: 50, clientY: 50 })
    fireEvent.mouseLeave(svg)
    // Assert — no circle and tooltip gone
    const circle = container.querySelector('[data-slot="area-chart"] svg circle')
    expect(circle).not.toBeInTheDocument()
  })

  it('omits animation properties on the line path when reduced motion is active', () => {
    // Arrange
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = render(<AreaChart data={SAMPLE_DATA} />)
    // Assert — no <style> keyframe block (existing assertion)
    const styleEl = container.querySelector('[data-slot="area-chart"] svg style')
    expect(styleEl).not.toBeInTheDocument()
    // Assert — line path inline style has no animation or stroke-dasharray
    const paths = Array.from(container.querySelectorAll('[data-slot="area-chart"] svg path'))
    const linePath = paths.find((p) => p.getAttribute('fill') === 'none') as HTMLElement | undefined
    expect(linePath).toBeInTheDocument()
    const inlineStyle = linePath?.getAttribute('style') ?? ''
    expect(inlineStyle).not.toContain('animation')
    expect(inlineStyle).not.toContain('stroke-dasharray')
  })

  it('renders a baseline zero-line when data crosses zero', () => {
    // Arrange — data with negative and positive values
    const crossingData = [
      { label: 'A', value: -10 },
      { label: 'B', value: 10 },
    ]
    const { container } = render(<AreaChart data={crossingData} />)
    // Assert — a baseline <line> rendered distinct from gridlines
    // Gridlines have strokeOpacity="0.12"; baseline has strokeOpacity="0.3"
    const lines = Array.from(container.querySelectorAll('[data-slot="area-chart"] svg line'))
    const baseline = lines.find((l) => l.getAttribute('stroke-opacity') === '0.3')
    expect(baseline).toBeInTheDocument()
    // It is horizontal — y1 equals y2
    const y1 = baseline?.getAttribute('y1')
    const y2 = baseline?.getAttribute('y2')
    expect(y1).not.toBeNull()
    expect(y1).toEqual(y2)
    // And it is not a gridline (gridlines have strokeWidth 0.3, baseline has 0.5)
    expect(baseline?.getAttribute('stroke-width')).toBe('0.5')
  })

  it('does not render a baseline zero-line when data is all positive', () => {
    // Arrange — all-positive data should not produce a baseline line
    const { container } = render(<AreaChart data={SAMPLE_DATA} />)
    const lines = Array.from(container.querySelectorAll('[data-slot="area-chart"] svg line'))
    const baseline = lines.find((l) => l.getAttribute('stroke-opacity') === '0.3')
    expect(baseline).toBeUndefined()
  })
})
