import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Status } from './StatusBadge'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('should render the default label derived from status', () => {
    // Arrange & Act
    render(<StatusBadge status="active" />)

    // Assert
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('should have data-slot attribute when rendered', () => {
    // Arrange & Act
    const { container } = render(<StatusBadge status="done" />)

    // Assert
    expect(container.querySelector('[data-slot="status-badge"]')).toBeInTheDocument()
  })

  it('should expose data-status attribute matching the status prop', () => {
    // Arrange & Act
    const { container } = render(<StatusBadge status="blocked" />)

    // Assert
    expect(container.querySelector('[data-status="blocked"]')).toBeInTheDocument()
  })

  it('should apply status token inline styles for bg and fg', () => {
    // Arrange & Act
    const { container } = render(<StatusBadge status="review" />)

    // Assert
    const badge = container.querySelector('[data-slot="status-badge"]') as HTMLElement
    expect(badge.style.backgroundColor).toBe('var(--status-review)')
    expect(badge.style.color).toBe('var(--status-review-fg)')
  })

  it('should render the dot sub-element with -dot token colour', () => {
    // Arrange & Act
    const { container } = render(<StatusBadge status="ontrack" />)

    // Assert
    const dot = container.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(dot).toBeInTheDocument()
    expect(dot.style.backgroundColor).toBe('var(--status-ontrack-dot)')
  })

  it('should use a rounded-full dot with 6px dimensions', () => {
    // Arrange & Act
    const { container } = render(<StatusBadge status="planned" />)

    // Assert
    const dot = container.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(dot.style.width).toBe('6px')
    expect(dot.style.height).toBe('6px')
    expect(dot).toHaveClass('rounded-full')
  })

  it('should accept a custom label overriding the default', () => {
    // Arrange & Act
    render(<StatusBadge status="draft" label="En brouillon" />)

    // Assert
    expect(screen.getByText('En brouillon')).toBeInTheDocument()
    expect(screen.queryByText('Draft')).not.toBeInTheDocument()
  })

  it('should convey status through visible text, not a live-region role', () => {
    // Arrange & Act
    render(<StatusBadge status="risk" />)

    // Assert -- the label is visible text; no aria live region is used.
    expect(screen.getByText('At Risk')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('should mark the colour dot as decorative (aria-hidden)', () => {
    // Arrange & Act
    const { container } = render(<StatusBadge status="archived" />)

    // Assert -- visible label present; the 6px dot is hidden from assistive tech.
    expect(screen.getByText('Archived')).toBeInTheDocument()
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('should accept custom className', () => {
    // Arrange & Act
    const { container } = render(<StatusBadge status="active" className="custom-class" />)

    // Assert
    expect(container.querySelector('[data-slot="status-badge"]')).toHaveClass('custom-class')
  })

  it('should merge custom style with token styles', () => {
    // Arrange & Act
    const { container } = render(<StatusBadge status="done" style={{ opacity: 0.7 }} />)

    // Assert -- both token-driven and custom styles are present
    const badge = container.querySelector('[data-slot="status-badge"]') as HTMLElement
    expect(badge.style.backgroundColor).toBe('var(--status-done)')
    expect(badge.style.opacity).toBe('0.7')
  })

  it('should render default labels for all 9 statuses', () => {
    // Arrange
    const statusLabelPairs: Array<[Status, string]> = [
      ['draft', 'Draft'],
      ['planned', 'Planned'],
      ['active', 'Active'],
      ['review', 'Review'],
      ['ontrack', 'On Track'],
      ['risk', 'At Risk'],
      ['blocked', 'Blocked'],
      ['done', 'Done'],
      ['archived', 'Archived'],
    ]

    // Act & Assert -- every status renders its canonical label
    for (const [status, expectedLabel] of statusLabelPairs) {
      const { unmount } = render(<StatusBadge status={status} />)
      expect(screen.getByText(expectedLabel)).toBeInTheDocument()
      unmount()
    }
  })
})
