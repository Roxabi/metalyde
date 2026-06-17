import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/paraglide/messages', () => ({
  m: {
    landing_strip_briefs_label: () => 'Active briefs',
    landing_strip_risk_label: () => 'At risk',
    landing_strip_margin_label: () => 'Protected margin',
    landing_strip_util_label: () => 'Utilisation',
  },
}))

import { MetricsStrip } from './MetricsStrip'

describe('MetricsStrip', () => {
  it('renders the Live metrics region', () => {
    // Arrange & Act
    render(<MetricsStrip />)

    // Assert
    expect(screen.getByRole('region', { name: 'Live metrics' })).toBeInTheDocument()
    expect(screen.getByText('$48,200')).toBeInTheDocument()
  })

  it('renders all four metric labels', () => {
    // Arrange & Act
    render(<MetricsStrip />)

    // Assert
    expect(screen.getByText('Active briefs')).toBeInTheDocument()
    expect(screen.getByText('At risk')).toBeInTheDocument()
  })
})
