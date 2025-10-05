import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

const benefits = [
  "Free 30-day trial, no credit card required",
  "Works on any phone via WhatsApp or USSD",
  "Personalized setup for your crops and location",
  "Expert support in your local language",
]

export function CTASection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-8 md:p-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">Ready to Grow Smarter?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Join 60+ farmers already using MavunoAI to increase yields and save resources
              </p>

              <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto pt-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-left">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <Link href="/signin">
                  <Button size="lg" className="text-lg px-8">
                    🌱 Farmer Login
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                    📊 View Demo Dashboard
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                    💬 Talk to Our Team
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground pt-4">Questions? WhatsApp us at +254 XXX XXX XXX</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
