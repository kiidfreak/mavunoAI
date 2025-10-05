"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Satellite, Brain, TrendingUp, Droplets } from "lucide-react"

interface GameIntroProps {
  onStart: () => void
}

const features = [
  {
    icon: Satellite,
    title: "Real NASA Data",
    description: "Learn to interpret SMAP, CHIRPS, and Landsat satellite information",
  },
  {
    icon: Brain,
    title: "Smart Decisions",
    description: "Make farming choices based on scientific data, not guesswork",
  },
  {
    icon: TrendingUp,
    title: "See Results",
    description: "Understand how satellite data leads to better harvests",
  },
]

export function GameIntro({ onStart }: GameIntroProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Droplets className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Educational Game</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
          Welcome to <span className="text-primary">FarmSim</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Learn how to use NASA satellite data to make better farming decisions. Play through real-world scenarios and
          see the impact of your choices.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-2">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto text-primary">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">How to Play</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              You'll face 3 farming scenarios. Use the satellite data panel to analyze conditions, then make your
              decision. Better choices earn more points!
            </p>
          </div>

          <Button size="lg" onClick={onStart} className="text-lg px-8">
            Start Learning
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
