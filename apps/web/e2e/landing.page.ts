import type { Locator, Page } from '@playwright/test'

/**
 * Page Object Model for the Landing Page.
 *
 * Encapsulates locators and navigation. Assertions stay in the spec file.
 */
export class LandingPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/')
  }

  // ---------------------------------------------------------------------------
  // Hero section
  // ---------------------------------------------------------------------------

  get heroEyebrow(): Locator {
    return this.page.getByText('Profitability-led agency OS')
  }

  get heroTitle(): Locator {
    return this.page.getByRole('heading', { level: 1 })
  }

  get requestAccessCta(): Locator {
    return this.page.getByRole('link', { name: 'Request access' }).first()
  }

  get marginViewCta(): Locator {
    return this.page.getByRole('link', { name: /See the margin view/i })
  }

  // ---------------------------------------------------------------------------
  // Pillars section
  // ---------------------------------------------------------------------------

  get pillarsSectionHeading(): Locator {
    return this.page.getByRole('heading', {
      name: 'One system for how an agency actually runs.',
    })
  }

  get pillar1Title(): Locator {
    return this.page.getByRole('heading', { name: 'The margin view, shown first' })
  }

  get pillar2Title(): Locator {
    return this.page.getByRole('heading', { name: 'Brief to invoice, one system' })
  }

  // ---------------------------------------------------------------------------
  // CTA section
  // ---------------------------------------------------------------------------

  get ctaSection(): Locator {
    return this.page.locator('#access')
  }

  // ---------------------------------------------------------------------------
  // Header
  // ---------------------------------------------------------------------------

  get header(): Locator {
    return this.page.locator('header')
  }

  get brandLink(): Locator {
    return this.page.getByTestId('brand-link')
  }

  // ---------------------------------------------------------------------------
  // Footer
  // ---------------------------------------------------------------------------

  get footer(): Locator {
    return this.page.locator('footer')
  }

  get footerBrand(): Locator {
    return this.footer.getByText(/Roxabi/)
  }

  get footerGithubLink(): Locator {
    return this.footer.getByRole('link', { name: 'GitHub' })
  }
}
