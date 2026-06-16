import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/paraglide/messages', () => ({
  m: {
    landing_pillars_tag: () => 'Pillars',
    landing_pillars_title: () => 'Why Metalyde',
    landing_pillar1_label: () => 'Speed',
    landing_pillar1_title: () => 'Ship faster than ever',
    landing_pillar1_desc: () => 'Pillar 1 description',
    landing_pillar1_tag: () => 'tag-1',
    landing_pillar2_label: () => 'Scale',
    landing_pillar2_title: () => 'Pillar 2 title',
    landing_pillar2_desc: () => 'Pillar 2 description',
    landing_pillar2_tag: () => 'tag-2',
    landing_pillar3_label: () => 'Control',
    landing_pillar3_title: () => 'Pillar 3 title',
    landing_pillar3_desc: () => 'Pillar 3 description',
    landing_pillar3_tag: () => 'tag-3',
    landing_pillar4_label: () => 'Trust',
    landing_pillar4_title: () => 'Pillar 4 title',
    landing_pillar4_desc: () => 'Pillar 4 description',
    landing_pillar4_tag: () => 'tag-4',
  },
}))

import { Pillars } from './Pillars'

describe('Pillars', () => {
  it('renders the Why Metalyde region with pillar 1 title', () => {
    // Arrange & Act
    render(<Pillars />)

    // Assert
    expect(screen.getByRole('region', { name: 'Why Metalyde' })).toBeInTheDocument()
    expect(screen.getByText('Ship faster than ever')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4)
  })
})
