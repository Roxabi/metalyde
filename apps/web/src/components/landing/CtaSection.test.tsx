import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/paraglide/messages', () => ({
  m: {
    landing_cta_title_a: () => 'Get ',
    landing_cta_title_em: () => 'early access',
    landing_cta_title_b: () => ' today.',
    landing_cta_sub: () => 'Join the waitlist for Metalyde.',
    landing_cta_email_label: () => 'Email address',
    landing_cta_placeholder: () => 'you@example.com',
    landing_cta_button: () => 'Request access',
    landing_cta_submitted: () => "You're on the list",
    landing_cta_micro: () => 'No spam. Cancel anytime.',
  },
}))

import { CtaSection } from './CtaSection'

describe('CtaSection', () => {
  it('renders the "Request access" region with the submit button', () => {
    // Arrange & Act
    render(<CtaSection />)

    // Assert
    expect(screen.getByRole('region', { name: 'Request access' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /request access/i })).toBeInTheDocument()
  })

  it('shows submitted text after form submission', () => {
    // Arrange
    render(<CtaSection />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request access/i })

    // Act
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    // Assert
    expect(screen.getByRole('button', { name: /you're on the list/i })).toBeInTheDocument()
  })
})
