"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, Share2 } from "lucide-react"

interface GameResultsProps {
  score: number
  decisions: Array<{ scenario: number; choice: string; outcome: string }>
  onPlayAgain: () => void
}

export function GameResults({ score, decisions, onPlayAgain }: GameResultsProps) {
  const maxScore = 150
  const percentage = Math.round((score / maxScore) * 100)

  let rating = "Beginner Farmer"
  let message = "Keep learning! Satellite data takes practice to interpret."
  let badgeColor = "bg-secondary text-secondary-foreground"

  if (percentage >= 90) {
    rating = "Master Farmer"
    message = "Outstanding! You're using NASA data like a pro!"
    badgeColor = "bg-accent text-accent-foreground"
  } else if (percentage >= 70) {
    rating = "Expert Farmer"
    message = "Great job! You understand how to use satellite intelligence."
    badgeColor = "bg-primary text-primary-foreground"
  } else if (percentage >= 50) {
    rating = "Skilled Farmer"
    message = "Good work! You're getting the hang of satellite data."
    badgeColor = "bg-chart-4 text-white"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-12">
      {/* Score Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="pt-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-accent" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Game Complete!</h1>
            <p className="text-lg text-muted-foreground">{message}</p>
          </div>

          <div className="space-y-3">
            <div className="text-6xl font-bold text-primary">
              {score} <span className="text-2xl text-muted-foreground">/ {maxScore}</span>
            </div>
            <Badge className={`${badgeColor} text-lg px-4 py-1`}>{rating}</Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button size="lg" onClick={onPlayAgain}>
              Play Again
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Decision Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Your Decisions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {decisions.map((decision, index) => (
            <div key={index} className="p-4 rounded-lg border bg-card space-y-2">
              <div className="flex items-start justify-between">
                <div className="font-semibold">Scenario {decision.scenario + 1}</div>
                <Badge variant="secondary">Review</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Your choice:</span> {decision.choice}
              </div>
              <div className="text-sm leading-relaxed">{decision.outcome}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Learning Resources */}
      <Card className="border-2 border-accent/20 bg-accent/5">
        <CardContent className="p-6 text-center space-y-4">
          <h3 className="text-xl font-bold">Ready to use real satellite data?</h3>
          <p className="text-muted-foreground">
            Sign up for MavunoAI and get NASA satellite insights for your actual farm
          </p>
          <Button size="lg" asChild>
            <a href="/">Start Free Trial</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
