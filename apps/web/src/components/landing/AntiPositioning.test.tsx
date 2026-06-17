import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/paraglide/messages', () => ({
  m: {
    landing_anti_tag: () => 'Positioning',
    landing_anti_quote: () => 'We believe in clarity.',
    landing_anti_cite: () => '— Metalyde',
    landing_anti_not_label: () => 'Not this',
    landing_anti_not1: () => 'Not a chatbot',
    landing_anti_not2: () => 'Not a copilot',
    landing_anti_not3: () => 'Not a plugin',
    landing_anti_but_label: () => 'But this',
    landing_anti_but1: () => 'A full AI team',
    landing_anti_but2: () => 'Integrated in your stack',
  },
}))

import { AntiPositioning } from './AntiPositioning'

describe('AntiPositioning', () => {
  it('renders the "What Metalyde is not" region with but1 text', () => {
    // Arrange & Act
    render(<AntiPositioning />)

    // Assert
    expect(screen.getByRole('region', { name: 'What Metalyde is not' })).toBeInTheDocument()
    expect(screen.getByText('A full AI team')).toBeInTheDocument()
  })
})
