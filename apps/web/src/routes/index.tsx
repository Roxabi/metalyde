import { AnimatedSection } from '@repo/ui'
import { createFileRoute } from '@tanstack/react-router'
import { AntiPositioning } from '@/components/landing/AntiPositioning'
import { CtaSection } from '@/components/landing/CtaSection'
import { HeroSection } from '@/components/landing/HeroSection'
import { MarginView } from '@/components/landing/MarginView'
import { MetricsStrip } from '@/components/landing/MetricsStrip'
import { Pillars } from '@/components/landing/Pillars'
import { WhoItsFor } from '@/components/landing/WhoItsFor'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-[1200px] border-x border-border">
        <HeroSection />
        <MetricsStrip />
        <AnimatedSection>
          <MarginView />
        </AnimatedSection>
        <AnimatedSection>
          <Pillars />
        </AnimatedSection>
        <AnimatedSection>
          <AntiPositioning />
        </AnimatedSection>
        <AnimatedSection>
          <WhoItsFor />
        </AnimatedSection>
        <AnimatedSection>
          <CtaSection />
        </AnimatedSection>
      </div>
    </div>
  )
}
