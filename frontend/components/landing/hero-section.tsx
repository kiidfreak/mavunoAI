import { Button } from "@/components/ui/button"
import { Sprout, Satellite, Droplets } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background satellite imagery */}
      <div className="absolute inset-0 z-0">
        <img
          src="/african-farmland-from-satellite-view-with-green-fi.jpg"
          alt="Satellite view of farmland"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Satellite className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by NASA Satellite Data</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
            Grow Smarter with <span className="text-primary">Satellite Intelligence</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            MavunoAI brings NASA's satellite technology to your farm. Get real-time insights on soil moisture, crop
            health, and weather to maximize your harvest. <span className="text-emerald-600 font-semibold">Earn M-Pesa points, join cooperatives, and compete with fellow farmers!</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/about#demo">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">KES 48k+</div>
              <div className="text-sm text-muted-foreground">Extra Income per Acre</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600">2,450</div>
              <div className="text-sm text-muted-foreground">M-Pesa Points Earned</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-sky-600">72</div>
              <div className="text-sm text-muted-foreground">Active Farmers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-amber-600">15</div>
              <div className="text-sm text-muted-foreground">Cooperatives</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-20 left-10 hidden lg:block">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card border shadow-lg">
          <Droplets className="w-5 h-5 text-chart-4" />
          <div>
            <div className="text-xs text-muted-foreground">Soil Moisture</div>
            <div className="text-sm font-semibold">Optimal</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-32 right-10 hidden lg:block">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card border shadow-lg">
          <Sprout className="w-5 h-5 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">Crop Health</div>
            <div className="text-sm font-semibold">Excellent</div>
          </div>
        </div>
      </div>
    </section>
  )
}
