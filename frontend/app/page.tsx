import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { DataShowcaseSection } from "@/components/landing/data-showcase-section"
import { MpesaIntegrationSection } from "@/components/landing/mpesa-integration-section"
import { CommunityFeaturesSection } from "@/components/landing/community-features-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DataShowcaseSection />
        <MpesaIntegrationSection />
        <CommunityFeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
