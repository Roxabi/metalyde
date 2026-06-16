import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/paraglide/messages', () => ({
  m: {
    landing_who1_title: () => 'Solo founders',
    landing_who1_desc: () => 'For solo founders building fast.',
    landing_who_spec_team: () => 'Team:',
    landing_who_spec_team_value: () => '1–5',
    landing_who_spec_accounts: () => 'Accounts:',
    landing_who_spec_accounts_value: () => '< 500',
    landing_who_spec_revenue: () => 'Revenue:',
    landing_who_spec_revenue_value: () => '< $1M ARR',
    landing_who_spec_setup: () => 'Setup:',
    landing_who_spec_setup_value: () => '< 1 day',
    landing_who2_title: () => 'Growing teams',
    landing_who2_desc: () => 'For growing teams that need scale.',
    landing_who_migrate_tag: () => 'Migration',
    landing_who_migrate_desc: () => 'Import from any platform in minutes.',
  },
}))

import { WhoItsFor } from './WhoItsFor'

describe('WhoItsFor', () => {
  it('renders the "Who it\'s for" region with who1 title', () => {
    // Arrange & Act
    render(<WhoItsFor />)

    // Assert
    expect(screen.getByRole('region', { name: "Who it's for" })).toBeInTheDocument()
    expect(screen.getByText('Solo founders')).toBeInTheDocument()
  })
})
