"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"

interface GameScenarioProps {
  scenarioIndex: number
  onDecision: (choice: string, points: number, outcome: string) => void
}

const scenarios = [
  {
    title: "Irrigation Decision",
    description: "Your onion crop is at the bulbing stage. When should you irrigate?",
    context:
      "It's mid-January and your onions are developing bulbs. This is a critical growth stage that requires careful water management.",
    image: "/onion-field-with-irrigation-system-during-bulbing-st.jpg",
    choices: [
      {
        text: "Irrigate immediately - the soil looks dry",
        points: 10,
        outcome: "Suboptimal. SMAP shows 28% moisture, which is adequate. You wasted water and money.",
        correct: false,
      },
      {
        text: "Wait 3 days and check satellite data again",
        points: 50,
        outcome:
          "Excellent! SMAP data shows moisture at 28%, within optimal range. You saved water and maintained crop health.",
        correct: true,
      },
      {
        text: "Don't irrigate - wait for rain",
        points: 20,
        outcome: "Risky. CHIRPS forecasts show only 5% rain chance. Moisture could drop below optimal levels.",
        correct: false,
      },
    ],
  },
  {
    title: "Pest Detection",
    description: "You notice some yellowing in your field. What's your next step?",
    context: "A section of your onion field shows some discoloration. You need to determine if it's a serious problem.",
    image: "/crop-field-with-yellowing-patches-visible-from-above.jpg",
    choices: [
      {
        text: "Apply pesticides to the entire field immediately",
        points: 10,
        outcome: "Wasteful. Landsat NDVI shows only 8% of field affected. You overspent on unnecessary chemicals.",
        correct: false,
      },
      {
        text: "Check NDVI map to identify affected areas, then scout those zones",
        points: 50,
        outcome: "Perfect! NDVI pinpointed the 8% stressed area. You found thrips early and treated only where needed.",
        correct: true,
      },
      {
        text: "Ignore it - probably just natural variation",
        points: 5,
        outcome: "Dangerous. NDVI shows declining health. Ignoring early signs could lead to major crop loss.",
        correct: false,
      },
    ],
  },
  {
    title: "Harvest Timing",
    description: "Your onions are maturing. When should you harvest?",
    context: "It's early February and you need to decide the optimal harvest window to maximize yield and quality.",
    image: "/mature-onion-field-ready-for-harvest-with-dried-tops.jpg",
    choices: [
      {
        text: "Harvest now - they look ready",
        points: 20,
        outcome: "Too early. NDVI trends show plants still actively growing. You lost potential yield.",
        correct: false,
      },
      {
        text: "Wait until NDVI stabilizes and weather is dry",
        points: 50,
        outcome:
          "Excellent! You waited for NDVI plateau and used CHIRPS to pick a dry week. Maximum yield and quality!",
        correct: true,
      },
      {
        text: "Wait another month for maximum size",
        points: 10,
        outcome: "Too late. CHIRPS shows heavy rains coming. You risked rot and disease. Some bulbs split.",
        correct: false,
      },
    ],
  },
]

export function GameScenario({ scenarioIndex, onDecision }: GameScenarioProps) {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const scenario = scenarios[scenarioIndex]

  useEffect(() => {
    setSelectedChoice(null)
    setShowResult(false)
  }, [scenarioIndex])

  const handleChoice = (choiceIndex: number) => {
    setSelectedChoice(choiceIndex)
    setShowResult(true)

    const choice = scenario.choices[choiceIndex]
    onDecision(choice.text, choice.points, choice.outcome)
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl">{scenario.title}</CardTitle>
            <CardDescription className="text-base">{scenario.description}</CardDescription>
          </div>
          <Badge variant="secondary">Scenario {scenarioIndex + 1}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scenario Image */}
        <div className="aspect-video rounded-lg overflow-hidden border-2">
          <img src={scenario.image || "/placeholder.svg"} alt={scenario.title} className="w-full h-full object-cover" />
        </div>

        {/* Context */}
        <div className="p-4 rounded-lg bg-muted/50 border">
          <p className="text-sm leading-relaxed">{scenario.context}</p>
        </div>

        {/* Choices */}
        <div className="space-y-3">
          <h3 className="font-semibold">What will you do?</h3>
          {scenario.choices.map((choice, index) => (
            <div key={index}>
              <Button
                variant={selectedChoice === index ? "default" : "outline"}
                className="w-full justify-start text-left h-auto py-4 px-4 bg-transparent"
                onClick={() => handleChoice(index)}
                disabled={showResult}
              >
                <span className="flex-1">{choice.text}</span>
                {showResult && selectedChoice === index && (
                  <span className="ml-2">
                    {choice.correct ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <XCircle className="w-5 h-5 text-secondary" />
                    )}
                  </span>
                )}
              </Button>

              {/* Show outcome */}
              {showResult && selectedChoice === index && (
                <div
                  className={`mt-2 p-4 rounded-lg border-2 ${
                    choice.correct ? "bg-primary/5 border-primary/20" : "bg-secondary/5 border-secondary/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {choice.correct ? (
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">{choice.correct ? "Great choice!" : "Not optimal"}</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{choice.outcome}</p>
                      <div className="text-sm font-semibold text-accent">+{choice.points} points</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
