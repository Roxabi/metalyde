import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { formatKpiValue, KpiCard } from './KpiCard'

// ── formatKpiValue unit tests ──────────────────────────────────────────────

describe('formatKpiValue', () => {
  it('should format money with USD currency symbol and no decimals', () => {
    expect(formatKpiValue(12500, 'money')).toBe('$12,500')
  })

  it('should format percent with % suffix', () => {
    expect(formatKpiValue(42, 'percent')).toBe('42%')
  })

  it('should format hours with h suffix', () => {
    expect(formatKpiValue(8, 'hours')).toBe('8h')
  })

  it('should format number with locale thousands separator', () => {
    expect(formatKpiValue(1000, 'number')).toBe('1,000')
  })

  it('should default to number format when format is omitted', () => {
    expect(formatKpiValue(999)).toBe('999')
  })
})

// ── KpiCard component tests ────────────────────────────────────────────────

describe('KpiCard', () => {
  it('should render the label text', () => {
    // Arrange & Act
    render(<KpiCard label="Monthly Revenue" value={12500} />)

    // Assert
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument()
  })

  it('should render the formatted value', () => {
    render(<KpiCard label="Revenue" value={12500} format="money" />)

    expect(screen.getByText('$12,500')).toBeInTheDocument()
  })

  it('should render the root with data-slot="kpi-card"', () => {
    const { container } = render(<KpiCard label="Metric" value={100} />)

    expect(container.querySelector('[data-slot="kpi-card"]')).toBeInTheDocument()
  })

  it('should render label slot with data-slot="kpi-label"', () => {
    const { container } = render(<KpiCard label="Users" value={50} />)

    expect(container.querySelector('[data-slot="kpi-label"]')).toBeInTheDocument()
  })

  it('should render value slot with data-slot="kpi-value"', () => {
    const { container } = render(<KpiCard label="Users" value={50} />)

    expect(container.querySelector('[data-slot="kpi-value"]')).toBeInTheDocument()
  })

  it('should mark the value element with data-numeric attribute', () => {
    const { container } = render(<KpiCard label="Metric" value={42} />)

    expect(container.querySelector('[data-numeric]')).toBeInTheDocument()
  })

  it('should NOT render StatTrend when delta is omitted', () => {
    const { container } = render(<KpiCard label="Metric" value={42} />)

    expect(container.querySelector('[data-slot="stat-trend"]')).not.toBeInTheDocument()
  })

  it('should render StatTrend when delta is provided', () => {
    const { container } = render(<KpiCard label="Metric" value={42} delta={5} />)

    expect(container.querySelector('[data-slot="stat-trend"]')).toBeInTheDocument()
  })

  it('should render "vs last period" caption when delta is set', () => {
    render(<KpiCard label="Metric" value={42} delta={5} />)

    expect(screen.getByText('vs last period')).toBeInTheDocument()
  })

  it('should use pp suffix for percent format deltas', () => {
    render(<KpiCard label="Rate" value={72} format="percent" delta={3} />)

    expect(screen.getByText('+3pp')).toBeInTheDocument()
  })

  it('should NOT render the icon slot when icon is omitted', () => {
    const { container } = render(<KpiCard label="Metric" value={1} />)

    // Only the label and value slots should exist — no icon wrapper
    const slots = container.querySelectorAll('[data-slot]')
    const slotNames = Array.from(slots).map((el) => el.getAttribute('data-slot'))
    expect(slotNames).not.toContain('kpi-icon')
  })

  it('should render the icon slot when icon is provided', () => {
    const icon = <svg data-testid="test-icon" />
    render(<KpiCard label="Metric" value={1} icon={icon} />)

    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('should NOT render the sparkline slot when sparkline is omitted', () => {
    const { container } = render(<KpiCard label="Metric" value={1} />)

    expect(container.querySelector('[data-slot="kpi-sparkline"]')).not.toBeInTheDocument()
  })

  it('should render the sparkline slot when sparkline is provided', () => {
    const spark = <div data-testid="spark-chart">chart</div>
    const { container } = render(<KpiCard label="Metric" value={1} sparkline={spark} />)

    expect(container.querySelector('[data-slot="kpi-sparkline"]')).toBeInTheDocument()
    expect(screen.getByTestId('spark-chart')).toBeInTheDocument()
  })

  it('should forward extra className to the root element', () => {
    const { container } = render(<KpiCard label="Metric" value={1} className="custom-class" />)

    expect(container.querySelector('[data-slot="kpi-card"]')).toHaveClass('custom-class')
  })
})
