import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@repo/ui', async () => await import('@/test/__mocks__/repoUi'))

const captured = vi.hoisted(() => ({
  Component: (() => null) as React.ComponentType,
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (config: { component: React.ComponentType }) => {
    captured.Component = config.component
    return { component: config.component }
  },
  redirect: vi.fn(),
}))

vi.mock('@/lib/authClient', () => ({
  authClient: { getSession: vi.fn().mockResolvedValue({ data: null }) },
}))

vi.mock('@/components/landing/HeroSection', () => ({
  HeroSection: () => <section aria-label="Hero" />,
}))

vi.mock('@/components/landing/MetricsStrip', () => ({
  MetricsStrip: () => <section aria-label="Live metrics" />,
}))

vi.mock('@/components/landing/MarginView', () => ({
  MarginView: () => <section aria-label="Margin view" />,
}))

vi.mock('@/components/landing/Pillars', () => ({
  Pillars: () => <section aria-label="Why Metalyde" />,
}))

vi.mock('@/components/landing/AntiPositioning', () => ({
  AntiPositioning: () => <section aria-label="What Metalyde is not" />,
}))

vi.mock('@/components/landing/WhoItsFor', () => ({
  WhoItsFor: () => <section aria-label="Who it's for" />,
}))

vi.mock('@/components/landing/CtaSection', () => ({
  CtaSection: () => <section aria-label="Request access" />,
}))

import './index'

describe('LandingPage', () => {
  it('should render hero section when component mounts', () => {
    // Arrange & Act
    render(<captured.Component />)

    // Assert
    expect(screen.getByRole('region', { name: 'Hero' })).toBeInTheDocument()
  })

  it('should render all landing page sections when component mounts', () => {
    // Arrange & Act
    render(<captured.Component />)

    // Assert
    expect(screen.getByRole('region', { name: 'Hero' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Live metrics' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Margin view' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Why Metalyde' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'What Metalyde is not' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: "Who it's for" })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Request access' })).toBeInTheDocument()
  })
})
