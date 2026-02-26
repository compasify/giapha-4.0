import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { FeatureDeepDiveSection } from '@/components/landing/feature-deep-dive-section';
import { CultureShowcaseSection } from '@/components/landing/culture-showcase-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { StatsSection } from '@/components/landing/stats-section';
import { CtaSection } from '@/components/landing/cta-section';
import { UseEverywhereSection } from '@/components/landing/use-everywhere-section';
import { FadeInSection } from '@/components/landing/fade-in-section';

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FadeInSection>
        <UseEverywhereSection />
      </FadeInSection>
      <FadeInSection>
        <FeaturesSection />
      </FadeInSection>
      <FadeInSection>
        <FeatureDeepDiveSection />
      </FadeInSection>
      <FadeInSection>
        <CultureShowcaseSection />
      </FadeInSection>
      <FadeInSection>
        <HowItWorksSection />
      </FadeInSection>
      <FadeInSection>
        <TestimonialsSection />
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
