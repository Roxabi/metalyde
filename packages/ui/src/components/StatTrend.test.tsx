import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatTrend } from './StatTrend'

describe('StatTrend', () => {
  it('should render the caption', () => {
    // Arrange & Act
    render(<StatTrend value={12} />)

    // Assert
    expect(screen.getByText('vs last period')).toBeInTheDocument()
  })

  it('should render a signed positive value with default percent suffix', () => {
    render(<StatTrend value={12} />)

    expect(screen.getByText('+12%')).toBeInTheDocument()
  })

  it('should render a signed negative value', () => {
    render(<StatTrend value={-5} />)

    expect(screen.getByText('-5%')).toBeInTheDocument()
  })

  it('should render zero value without sign', () => {
    render(<StatTrend value={0} />)

    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('should use a custom suffix', () => {
    render(<StatTrend value={3} suffix="pp" />)

    expect(screen.getByText('+3pp')).toBeInTheDocument()
  })

  it('should apply success tone for upward positive delta', () => {
    const { container } = render(<StatTrend value={8} />)

    const pill = container.querySelector('[data-slot="stat-trend"] span')
    expect(pill).toHaveAttribute('data-tone', 'success')
  })

  it('should apply destructive tone for downward delta', () => {
    const { container } = render(<StatTrend value={-3} />)

    const pill = container.querySelector('[data-slot="stat-trend"] span')
    expect(pill).toHaveAttribute('data-tone', 'destructive')
  })

  it('should apply success tone when invertDelta=true and value is negative', () => {
    // Cost reduction — negative delta is good
    const { container } = render(<StatTrend value={-10} invertDelta />)

    const pill = container.querySelector('[data-slot="stat-trend"] span')
    expect(pill).toHaveAttribute('data-tone', 'success')
  })

  it('should apply destructive tone when invertDelta=true and value is positive', () => {
    const { container } = render(<StatTrend value={10} invertDelta />)

    const pill = container.querySelector('[data-slot="stat-trend"] span')
    expect(pill).toHaveAttribute('data-tone', 'destructive')
  })

  it('should allow explicit direction override', () => {
    // Positive value but forced down
    const { container } = render(<StatTrend value={5} direction="down" />)

    const pill = container.querySelector('[data-slot="stat-trend"] span')
    expect(pill).toHaveAttribute('data-tone', 'destructive')
  })

  it('should render the root with data-slot="stat-trend"', () => {
    const { container } = render(<StatTrend value={1} />)

    expect(container.querySelector('[data-slot="stat-trend"]')).toBeInTheDocument()
  })

  it('should forward extra className to the root element', () => {
    const { container } = render(<StatTrend value={1} className="mt-4" />)

    expect(container.querySelector('[data-slot="stat-trend"]')).toHaveClass('mt-4')
  })

  it('should render the arrow svg as aria-hidden', () => {
    const { container } = render(<StatTrend value={5} />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})
