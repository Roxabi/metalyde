import { expect, test } from '@playwright/test'
import { LandingPage } from './landing.page'

test.describe('Landing Page', () => {
  test('should display hero content with CTA buttons when page loads', async ({ page }) => {
    // Arrange
    const landing = new LandingPage(page)

    // Act
    await landing.goto()

    // Assert
    await expect(landing.heroEyebrow).toBeVisible()
    await expect(landing.heroTitle).toBeVisible()
    await expect(landing.requestAccessCta).toBeVisible()
    await expect(landing.marginViewCta).toBeVisible()
  })

  test('should display pillars section when page loads', async ({ page }) => {
    // Arrange
    const landing = new LandingPage(page)

    // Act
    await landing.goto()

    // Assert
    await expect(landing.pillarsSectionHeading).toBeVisible()
    await expect(landing.pillar1Title).toBeVisible()
    await expect(landing.pillar2Title).toBeVisible()
  })

  test('should display header navigation when page loads', async ({ page }) => {
    // Arrange
    const landing = new LandingPage(page)

    // Act
    await landing.goto()

    // Assert
    await expect(landing.header).toBeVisible()
    await expect(landing.brandLink).toBeVisible()
  })

  test('should have Request access CTA pointing to the access section anchor', async ({ page }) => {
    // Arrange
    const landing = new LandingPage(page)
    await landing.goto()

    // The primary CTA is an in-page anchor (<a href="#access">) — no target="_blank".
    // Verify the CTA link and the target section it points to both exist.
    await expect(landing.requestAccessCta).toHaveAttribute('href', '#access')
    await expect(landing.ctaSection).toBeAttached()
  })

  test('should display footer with links when page loads', async ({ page }) => {
    // Arrange
    const landing = new LandingPage(page)

    // Act
    await landing.goto()

    // Assert
    await expect(landing.footer).toBeVisible()
    await expect(landing.footerBrand).toBeVisible()
    await expect(landing.footerGithubLink).toBeVisible()
  })
})
