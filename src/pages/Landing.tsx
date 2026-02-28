import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { PrivacyBadge } from '@/components/landing/PrivacyBadge';
import { CTASection } from '@/components/landing/CTASection';

export function Landing() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <PrivacyBadge />
        <CTASection />
      </main>
    </div>
  );
}
