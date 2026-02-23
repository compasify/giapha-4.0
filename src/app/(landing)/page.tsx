import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { StatsSection } from '@/components/landing/stats-section';
import { CtaSection } from '@/components/landing/cta-section';
import { FadeInSection } from '@/components/landing/fade-in-section';

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FadeInSection>
        <FeaturesSection />
      </FadeInSection>
      <FadeInSection>
        <HowItWorksSection />
      </FadeInSection>
      <FadeInSection>
        <StatsSection />
      </FadeInSection>
      <FadeInSection>
        <CtaSection />
      </FadeInSection>
    </main>
  );
}
