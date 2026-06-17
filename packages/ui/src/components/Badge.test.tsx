import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('should render children correctly', () => {
    // Arrange & Act
    render(<Badge>New</Badge>)

    // Assert
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('should have data-slot attribute when rendered', () => {
    // Arrange & Act
    const { container } = render(<Badge>New</Badge>)

    // Assert
    expect(container.querySelector('[data-slot="badge"]')).toBeInTheDocument()
  })

  it('should apply default variant when no variant is specified', () => {
    // Arrange & Act
    const { container } = render(<Badge>Default</Badge>)

    // Assert
    const badge = container.querySelector('[data-slot="badge"]')
    expect(badge).toHaveAttribute('data-variant', 'default')
  })

  it('should apply secondary variant when variant is secondary', () => {
    // Arrange & Act
    const { container } = render(<Badge variant="secondary">Secondary</Badge>)

    // Assert
    const badge = container.querySelector('[data-slot="badge"]')
    expect(badge).toHaveAttribute('data-variant', 'secondary')
  })

  it('should apply destructive variant when variant is destructive', () => {
    // Arrange & Act
    const { container } = render(<Badge variant="destructive">Destructive</Badge>)

    // Assert
    const badge = container.querySelector('[data-slot="badge"]')
    expect(badge).toHaveAttribute('data-variant', 'destructive')
  })

  it('should apply outline variant when variant is outline', () => {
    // Arrange & Act
    const { container } = render(<Badge variant="outline">Outline</Badge>)

    // Assert
    const badge = container.querySelector('[data-slot="badge"]')
    expect(badge).toHaveAttribute('data-variant', 'outline')
  })

  it('should apply custom className when provided', () => {
    // Arrange & Act
    const { container } = render(<Badge className="custom-class">Custom</Badge>)

    // Assert
    expect(container.querySelector('[data-slot="badge"]')).toHaveClass('custom-class')
  })

  it('should render as span by default', () => {
    // Arrange & Act
    const { container } = render(<Badge>Span</Badge>)

    // Assert
    expect(container.querySelector('[data-slot="badge"]')?.tagName).toBe('SPAN')
  })

  // ── tone prop (status token path) ──────────────────────────────────────────

  describe('tone prop', () => {
    it('should apply data-tone attribute when tone is set', () => {
      // Arrange & Act
      const { container } = render(<Badge tone="active">Active</Badge>)

      // Assert
      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).toHaveAttribute('data-tone', 'active')
    })

    it('should apply status token inline styles when tone is set', () => {
      // Arrange & Act
      const { container } = render(<Badge tone="blocked">Blocked</Badge>)

      // Assert -- token-driven inline styles replace CVA variant classes
      const badge = container.querySelector('[data-slot="badge"]') as HTMLElement
      expect(badge.style.backgroundColor).toBe('var(--status-blocked)')
      expect(badge.style.color).toBe('var(--status-blocked-fg)')
    })

    it('should not apply bg-primary when tone overrides variant', () => {
      // Arrange & Act
      const { container } = render(<Badge tone="done">Done</Badge>)

      // Assert -- CVA default variant must be bypassed
      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).not.toHaveClass('bg-primary')
    })

    it('should still accept className when tone is set', () => {
      // Arrange & Act
      const { container } = render(
        <Badge tone="draft" className="extra-class">
          Draft
        </Badge>
      )

      // Assert
      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).toHaveClass('extra-class')
    })

    it('should render children inside tone badge', () => {
      // Arrange & Act
      render(<Badge tone="planned">Planned</Badge>)

      // Assert
      expect(screen.getByText('Planned')).toBeInTheDocument()
    })

    it('should support all 9 status tones without throwing', () => {
      // Arrange
      const tones = [
        'draft',
        'planned',
        'active',
        'review',
        'ontrack',
        'risk',
        'blocked',
        'done',
        'archived',
      ] as const

      // Act & Assert -- each tone must render without error
      for (const tone of tones) {
        const { container } = render(<Badge tone={tone}>{tone}</Badge>)
        expect(container.querySelector(`[data-tone="${tone}"]`)).toBeInTheDocument()
      }
    })
  })
})
