import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { FarmDataSection } from "@/components/landing/FarmDataSection"
import { CreditScoringSection } from "@/components/landing/CreditScoringSection"
import { RewardsSection } from "@/components/landing/RewardsSection"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FarmDataSection />
        <CreditScoringSection />
        <RewardsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
