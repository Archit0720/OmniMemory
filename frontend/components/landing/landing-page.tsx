import { Features } from '@/components/landing/features'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { LandingNav } from '@/components/landing/landing-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { Testimonials } from '@/components/landing/testimonials'

export function LandingPage({
  onGetStarted,
  onLogin,
}: {
  onGetStarted: () => void
  onLogin: () => void
}) {
  return (
    <div className="relative min-h-screen bg-background">
      <LandingNav onLogin={onLogin} />
      <main>
        <Hero onGetStarted={onGetStarted} />
        <Features />
        <HowItWorks />
        <Testimonials />
      </main>
      <SiteFooter onGetStarted={onGetStarted} />
    </div>
  )
}
