import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/paraglide/messages', () => ({
  m: {
    landing_hero_eyebrow: () => 'Control your margin',
    landing_hero_title_a: () => 'Know your ',
    landing_hero_title_em: () => 'real margin',
    landing_hero_title_b: () => ' before it disappears.',
    landing_hero_sub: () => 'The control room for agency profitability.',
    landing_hero_cta_primary: () => 'Request access',
    landing_hero_cta_secondary: () => 'See live margin view',
    landing_hero_stat1_value: () => '23',
    landing_hero_stat1_unit: () => '%',
    landing_hero_stat1_label: () => 'Avg margin recovered',
    landing_hero_stat1_src: () => 'Based on beta cohort',
    landing_hero_stat2_value: () => '4×',
    landing_hero_stat2_label: () => 'Faster scope decisions',
    landing_hero_stat2_src: () => 'Internal benchmark',
  },
}))

import { HeroSection } from './HeroSection'

describe('HeroSection', () => {
  it('renders the Hero region with eyebrow text', () => {
    // Arrange & Act
    render(<HeroSection />)

    // Assert
    expect(screen.getByRole('region', { name: 'Hero' })).toBeInTheDocument()
    expect(screen.getByText('Control your margin')).toBeInTheDocument()
  })

  it('renders both CTA links', () => {
    // Arrange & Act
    render(<HeroSection />)

    // Assert
    expect(screen.getByRole('link', { name: /request access/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /see live margin view/i })).toBeInTheDocument()
  })

  it('renders stat values', () => {
    // Arrange & Act
    render(<HeroSection />)

    // Assert
    expect(screen.getByText('Avg margin recovered')).toBeInTheDocument()
  })
})
