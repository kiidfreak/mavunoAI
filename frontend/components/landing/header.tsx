import { Button } from "@/components/ui/button"
import { Sprout } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sprout className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">MavunoAI</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#farm-data" className="text-sm font-medium hover:text-primary transition-colors">
              Farm Data
            </a>
            <a href="#credit-scoring" className="text-sm font-medium hover:text-primary transition-colors">
              Credit Scoring
            </a>
            <a href="#rewards" className="text-sm font-medium hover:text-primary transition-colors">
              Rewards
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/join">
              <Button>Enter Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
