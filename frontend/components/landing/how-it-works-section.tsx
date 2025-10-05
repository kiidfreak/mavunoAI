import { Card, CardContent } from "@/components/ui/card"
import { Satellite, Brain, MessageSquare, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: Satellite,
    number: "01",
    title: "Satellite Data Collection",
    description:
      "NASA satellites scan your farm daily, measuring soil moisture, vegetation health, and weather patterns with precision.",
  },
  {
    icon: Brain,
    number: "02",
    title: "AI Analysis",
    description:
      "Our AI processes satellite data and identifies opportunities to prevent losses and optimize resources for maximum profit.",
  },
  {
    icon: MessageSquare,
    number: "03",
    title: "Simple Alerts",
    description:
      "Receive clear, actionable recommendations via WhatsApp, USSD, or web dashboard. Know exactly when to irrigate, fertilize, or harvest.",
  },
  {
    icon: TrendingUp,
    number: "04",
    title: "Measurable Income",
    description:
      "Follow the insights to cut losses by 50% and reduce costs by 20%. Turn Earth observation into real farmer income every season.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
            How <span className="text-secondary">MavunoAI</span> Works
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">From space to your pocket in four simple steps</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-border -translate-x-1/2 z-0" />
              )}

              <Card className="relative z-10 border-2 h-full">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-bold text-muted/20">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
