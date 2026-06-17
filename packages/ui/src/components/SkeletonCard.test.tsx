import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SkeletonCard } from './SkeletonCard'

describe('SkeletonCard', () => {
  it('should render with data-slot attribute', () => {
    // Arrange & Act
    const { container } = render(<SkeletonCard />)

    // Assert
    expect(container.querySelector('[data-slot="skeleton-card"]')).toBeInTheDocument()
  })

  it('should render skeleton pulse elements inside the card', () => {
    // Arrange & Act
    const { container } = render(<SkeletonCard />)

    // Assert — multiple Skeleton divs should be present
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should apply custom className when provided', () => {
    // Arrange & Act
    const { container } = render(<SkeletonCard className="custom-class" />)

    // Assert
    expect(container.querySelector('[data-slot="skeleton-card"]')).toHaveClass('custom-class')
  })

  it('should forward additional props to the root element', () => {
    // Arrange & Act
    const { container } = render(<SkeletonCard data-testid="my-skeleton-card" />)

    // Assert
    expect(container.querySelector('[data-testid="my-skeleton-card"]')).toBeInTheDocument()
  })
})
