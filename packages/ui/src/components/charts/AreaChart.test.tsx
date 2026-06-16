import { render, screen } from '@testing-library/react'
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
})
