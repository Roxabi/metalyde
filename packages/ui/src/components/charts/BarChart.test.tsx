import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// ---------------------------------------------------------------------------
// Mock useReducedMotion
// ---------------------------------------------------------------------------
const mockUseReducedMotion = vi.fn(() => false)
vi.mock('@/lib/useReducedMotion', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}))

import { BarChart } from './BarChart'

const SAMPLE_DATA = [
  { label: 'Jan', value: 120 },
  { label: 'Feb', value: 200 },
  { label: 'Mar', value: 80 },
  { label: 'Apr', value: 160 },
]

describe('BarChart', () => {
  it('renders a container with data-slot="bar-chart"', () => {
    // Arrange & Act
    const { container } = render(<BarChart data={SAMPLE_DATA} />)
    // Assert
    const root = container.querySelector('[data-slot="bar-chart"]')
    expect(root).toBeInTheDocument()
  })

  it('renders an SVG element inside the container', () => {
    // Arrange & Act
    const { container } = render(<BarChart data={SAMPLE_DATA} />)
    // Assert
    const svg = container.querySelector('[data-slot="bar-chart"] svg')
    expect(svg).toBeInTheDocument()
  })

  it('applies aria-label and role="img" when aria-label prop is provided', () => {
    // Arrange & Act
    render(<BarChart data={SAMPLE_DATA} aria-label="Monthly revenue" />)
    // Assert
    const root = screen.getByRole('img', { name: 'Monthly revenue' })
    expect(root).toBeInTheDocument()
  })

  it('does not set role="img" when aria-label is omitted', () => {
    // Arrange & Act
    const { container } = render(<BarChart data={SAMPLE_DATA} />)
    // Assert
    const root = container.querySelector('[data-slot="bar-chart"]')
    expect(root).not.toHaveAttribute('role', 'img')
  })

  it('marks the SVG as aria-hidden', () => {
    // Arrange & Act
    const { container } = render(<BarChart data={SAMPLE_DATA} />)
    // Assert
    const svg = container.querySelector('[data-slot="bar-chart"] svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders x-axis labels for each data point', () => {
    // Arrange & Act
    const { container } = render(<BarChart data={SAMPLE_DATA} />)
    // Assert
    const root = container.querySelector('[data-slot="bar-chart"]')
    expect(root?.textContent).toContain('Jan')
    expect(root?.textContent).toContain('Apr')
  })

  it('renders y-axis tick labels', () => {
    // Arrange & Act
    const { container } = render(<BarChart data={SAMPLE_DATA} />)
    // Assert — at least one SVG text element for y-axis ticks
    const textNodes = container.querySelectorAll('[data-slot="bar-chart"] svg text')
    expect(textNodes.length).toBeGreaterThan(0)
  })

  it('renders rect elements for each bar', () => {
    // Arrange & Act
    const { container } = render(<BarChart data={SAMPLE_DATA} />)
    // Assert — one rect per data point (minimum)
    const rects = container.querySelectorAll('[data-slot="bar-chart"] svg rect')
    expect(rects.length).toBeGreaterThanOrEqual(SAMPLE_DATA.length)
  })

  it('uses --color-chart-1 by default for bar fill', () => {
    // Arrange & Act
    const { container } = render(<BarChart data={SAMPLE_DATA} />)
    // Assert — at least one rect carries the default color CSS variable
    const rects = Array.from(container.querySelectorAll('[data-slot="bar-chart"] svg rect'))
    const colored = rects.find((r) => r.getAttribute('fill') === 'var(--color-chart-1)')
    expect(colored).toBeInTheDocument()
  })

  it('uses --color-chart-3 when colorSlot=3', () => {
    // Arrange & Act
    const { container } = render(<BarChart data={SAMPLE_DATA} colorSlot={3} />)
    // Assert
    const rects = Array.from(container.querySelectorAll('[data-slot="bar-chart"] svg rect'))
    const colored = rects.find((r) => r.getAttribute('fill') === 'var(--color-chart-3)')
    expect(colored).toBeInTheDocument()
  })

  it('renders a <style> keyframe block when reduced motion is inactive', () => {
    // Arrange
    mockUseReducedMotion.mockReturnValue(false)
    const { container } = render(<BarChart data={SAMPLE_DATA} />)
    // Assert
    const styleEl = container.querySelector('[data-slot="bar-chart"] svg style')
    expect(styleEl).toBeInTheDocument()
  })

  it('omits animation <style> block when prefers-reduced-motion is active', () => {
    // Arrange
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = render(<BarChart data={SAMPLE_DATA} />)
    // Assert
    const styleEl = container.querySelector('[data-slot="bar-chart"] svg style')
    expect(styleEl).not.toBeInTheDocument()
  })

  it('renders without crashing when data is empty', () => {
    // Arrange & Act
    const { container } = render(<BarChart data={[]} />)
    // Assert
    const root = container.querySelector('[data-slot="bar-chart"]')
    expect(root).toBeInTheDocument()
    // No bar rects rendered for empty data
    const rects = container.querySelectorAll('[data-slot="bar-chart"] svg rect')
    expect(rects.length).toBe(0)
  })

  it('renders a single bar without crashing', () => {
    // Arrange & Act
    const { container } = render(<BarChart data={[{ label: 'Q1', value: 999 }]} />)
    // Assert
    const rects = container.querySelectorAll('[data-slot="bar-chart"] svg rect')
    expect(rects.length).toBeGreaterThanOrEqual(1)
  })

  it('uses custom formatY when provided', () => {
    // Arrange
    const formatY = (v: number) => `€${v}`
    const { container } = render(<BarChart data={SAMPLE_DATA} formatY={formatY} />)
    // Assert — formatted tick values appear in SVG text nodes
    const textNodes = container.querySelectorAll('[data-slot="bar-chart"] svg text')
    const allText = Array.from(textNodes)
      .map((t) => t.textContent)
      .join(' ')
    expect(allText).toMatch(/€/)
  })

  it('bars have reduced opacity when unhovered (default state)', () => {
    // Arrange & Act
    const { container } = render(<BarChart data={SAMPLE_DATA} />)
    // Assert — bar rects carry opacity attribute of 0.75 in resting state
    const rects = Array.from(container.querySelectorAll('[data-slot="bar-chart"] svg rect'))
    const barRects = rects.filter((r) => r.getAttribute('fill') === 'var(--color-chart-1)')
    expect(barRects.length).toBeGreaterThan(0)
    barRects.forEach((r) => {
      expect(r).toHaveAttribute('opacity', '0.75')
    })
  })
})
