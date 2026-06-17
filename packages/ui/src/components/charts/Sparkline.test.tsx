import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// ---------------------------------------------------------------------------
// Mock useReducedMotion
// ---------------------------------------------------------------------------
const mockUseReducedMotion = vi.fn(() => false)
vi.mock('@/lib/useReducedMotion', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}))

import { Sparkline } from './Sparkline'

describe('Sparkline', () => {
  it('renders an SVG with data-slot="sparkline"', () => {
    // Arrange & Act
    const { container } = render(<Sparkline data={[10, 20, 15, 30, 25]} />)
    // Assert
    const svg = container.querySelector('[data-slot="sparkline"]')
    expect(svg).toBeInTheDocument()
    expect(svg?.tagName.toLowerCase()).toBe('svg')
  })

  it('renders an empty SVG when data is empty', () => {
    // Arrange & Act
    const { container } = render(<Sparkline data={[]} />)
    // Assert
    const svg = container.querySelector('[data-slot="sparkline"]')
    expect(svg).toBeInTheDocument()
    const path = svg?.querySelector('path')
    expect(path).not.toBeInTheDocument()
  })

  it('renders a path element for non-empty data', () => {
    // Arrange & Act
    const { container } = render(<Sparkline data={[1, 2, 3]} />)
    // Assert
    const path = container.querySelector('[data-slot="sparkline"] path')
    expect(path).toBeInTheDocument()
  })

  it('uses --color-chart-1 for the stroke', () => {
    // Arrange & Act
    const { container } = render(<Sparkline data={[10, 20, 30]} />)
    // Assert
    const path = container.querySelector('[data-slot="sparkline"] path')
    expect(path).toHaveAttribute('stroke', 'var(--color-chart-1)')
  })

  it('applies animation style when reduced motion is inactive', () => {
    // Arrange — default mock returns false (no reduced motion)
    mockUseReducedMotion.mockReturnValue(false)
    const { container } = render(<Sparkline data={[5, 10, 8]} />)
    // Assert — path should have a strokeDasharray
    const path = container.querySelector('[data-slot="sparkline"] path')
    const style = (path as HTMLElement | null)?.getAttribute('style') ?? ''
    expect(style).toContain('stroke-dasharray')
  })

  it('omits animation when prefers-reduced-motion is active', () => {
    // Arrange
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = render(<Sparkline data={[5, 10, 8]} />)
    // Assert — no strokeDasharray style
    const path = container.querySelector('[data-slot="sparkline"] path')
    const style = (path as HTMLElement | null)?.getAttribute('style') ?? ''
    expect(style).not.toContain('stroke-dasharray')
    // And no <style> keyframe block
    const styleEl = container.querySelector('[data-slot="sparkline"] style')
    expect(styleEl).not.toBeInTheDocument()
  })

  it('respects custom width and height', () => {
    // Arrange & Act
    const { container } = render(<Sparkline data={[1, 2]} width={120} height={40} />)
    // Assert
    const svg = container.querySelector('[data-slot="sparkline"]')
    expect(svg).toHaveAttribute('width', '120')
    expect(svg).toHaveAttribute('height', '40')
    expect(svg).toHaveAttribute('viewBox', '0 0 120 40')
  })

  it('handles single data point without crashing', () => {
    // Arrange & Act
    const { container } = render(<Sparkline data={[42]} />)
    // Assert
    const path = container.querySelector('[data-slot="sparkline"] path')
    expect(path).toBeInTheDocument()
  })

  it('handles flat data (all same value) without crashing', () => {
    // Arrange & Act
    const { container } = render(<Sparkline data={[5, 5, 5, 5]} />)
    // Assert
    const path = container.querySelector('[data-slot="sparkline"] path')
    expect(path).toBeInTheDocument()
  })
})
