import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SkeletonTable } from './SkeletonTable'

describe('SkeletonTable', () => {
  it('should render with data-slot attribute', () => {
    // Arrange & Act
    const { container } = render(<SkeletonTable />)

    // Assert
    expect(container.querySelector('[data-slot="skeleton-table"]')).toBeInTheDocument()
  })

  it('should render the default number of rows (5)', () => {
    // Arrange & Act
    const { container } = render(<SkeletonTable />)

    // Assert — 1 header row + 5 data rows = 6 rows total
    // Each row is a flex div; we count the ones that hold skeleton cells
    // The header + data rows all have gap-3 class as part of the row layout
    const rows = container.querySelectorAll('[data-slot="skeleton-table"] > div')
    expect(rows).toHaveLength(6) // 1 header + 5 data
  })

  it('should render a custom number of rows', () => {
    // Arrange & Act
    const { container } = render(<SkeletonTable rows={3} />)

    // Assert — 1 header row + 3 data rows = 4 rows total
    const rows = container.querySelectorAll('[data-slot="skeleton-table"] > div')
    expect(rows).toHaveLength(4) // 1 header + 3 data
  })

  it('should render the default number of cols (4) in the header', () => {
    // Arrange & Act
    const { container } = render(<SkeletonTable />)

    // Assert — first row (header) should have 4 skeleton children
    const headerRow = container.querySelector('[data-slot="skeleton-table"] > div')
    const headerSkeletons = headerRow?.querySelectorAll('[data-slot="skeleton"]')
    expect(headerSkeletons).toHaveLength(4)
  })

  it('should render a custom number of cols', () => {
    // Arrange & Act
    const { container } = render(<SkeletonTable cols={6} />)

    // Assert — first row (header) should have 6 skeleton children
    const headerRow = container.querySelector('[data-slot="skeleton-table"] > div')
    const headerSkeletons = headerRow?.querySelectorAll('[data-slot="skeleton"]')
    expect(headerSkeletons).toHaveLength(6)
  })

  it('should apply custom className when provided', () => {
    // Arrange & Act
    const { container } = render(<SkeletonTable className="custom-class" />)

    // Assert
    expect(container.querySelector('[data-slot="skeleton-table"]')).toHaveClass('custom-class')
  })

  it('should forward additional props to the root element', () => {
    // Arrange & Act
    const { container } = render(<SkeletonTable data-testid="my-skeleton-table" />)

    // Assert
    expect(container.querySelector('[data-testid="my-skeleton-table"]')).toBeInTheDocument()
  })
})
