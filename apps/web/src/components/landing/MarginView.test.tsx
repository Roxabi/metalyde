import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/paraglide/messages', () => ({
  m: {
    landing_margin_tag: () => 'Live panel',
    landing_margin_title: () => 'See where margin bleeds — before it does.',
    landing_margin_desc: () => 'Real-time account profitability at a glance.',
    landing_margin_panel_title: () => 'Account margin tracker',
    landing_margin_panel_meta: () => 'Updated live',
    landing_margin_th_account: () => 'Account',
    landing_margin_th_retainer: () => 'Retainer',
    landing_margin_th_hours: () => 'Hours',
    landing_margin_th_margin: () => 'Margin',
    landing_margin_th_status: () => 'Status',
    landing_margin_status_healthy: () => 'Healthy',
    landing_margin_status_over: () => 'Over scope',
    landing_margin_status_burning: () => 'Burning',
    landing_margin_foot: () => '4 accounts · this week',
    landing_margin_flag: () => '2 need attention',
  },
}))

import { MarginView } from './MarginView'

describe('MarginView', () => {
  it('renders the Margin view region', () => {
    // Arrange & Act
    render(<MarginView />)

    // Assert
    expect(screen.getByRole('region', { name: 'Margin view' })).toBeInTheDocument()
    expect(screen.getByText('Lumen Brands')).toBeInTheDocument()
  })

  it('renders all four accounts', () => {
    // Arrange & Act
    render(<MarginView />)

    // Assert
    expect(screen.getByText('Vega Performance')).toBeInTheDocument()
    expect(screen.getByText('Northwind Media')).toBeInTheDocument()
  })

  it('renders status pills', () => {
    // Arrange & Act
    render(<MarginView />)

    // Assert
    expect(screen.getAllByText('Healthy')).toHaveLength(2)
  })
})
