import React from 'react';
import { Header } from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import { Hero } from '@/components/homepage/hero';
import { ValueProposition } from '@/components/homepage/value-proposition';
import { HowItWorks } from '@/components/homepage/how-it-works';
import { FeaturesGrid } from '@/components/homepage/features-grid';
import { TrustIndicators } from '@/components/homepage/trust-indicators';
import { QuickNavigation } from '@/components/ui/navigation';
import { SiteMap } from '@/components/homepage/site-map';
import { RoleSelector } from '@/components/homepage/role-selector';
import { NewsletterSection } from '@/components/homepage/newsletter-section';

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <ValueProposition />
      <RoleSelector />
      <HowItWorks />
      <FeaturesGrid />

      {/* Quick Navigation Section */}
      <section className="py-20 bg-industrial-gunmetal-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="industrial-section-heading text-industrial-gunmetal-800 mb-4">
              Get Started Today
            </h2>
            <p className="industrial-body-text text-industrial-gunmetal-600 max-w-2xl mx-auto">
              Choose your path and start connecting with the industrial
              community
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <QuickNavigation />
          </div>
        </div>
      </section>

      <SiteMap />
      <TrustIndicators />
      <NewsletterSection />
      <Footer />
    </>
  );
}
