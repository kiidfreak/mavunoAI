"use client"

import { useState } from "react"
import { GameHeader } from "@/components/farmsim/game-header"
import { GameScenario } from "@/components/farmsim/game-scenario"
import { SatelliteDataPanel } from "@/components/farmsim/satellite-data-panel"
import { GameResults } from "@/components/farmsim/game-results"
import { GameIntro } from "@/components/farmsim/game-intro"

export default function FarmSimPage() {
  const [gameState, setGameState] = useState<"intro" | "playing" | "results">("intro")
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)
  const [decisions, setDecisions] = useState<Array<{ scenario: number; choice: string; outcome: string }>>([])

  const handleStartGame = () => {
    setGameState("playing")
    setCurrentScenario(0)
    setScore(0)
    setDecisions([])
  }

  const handleDecision = (choice: string, points: number, outcome: string) => {
    setScore(score + points)
    setDecisions([...decisions, { scenario: currentScenario, choice, outcome }])

    // Move to next scenario or end game
    if (currentScenario < 2) {
      setTimeout(() => {
        setCurrentScenario(currentScenario + 1)
      }, 2000)
    } else {
      setTimeout(() => {
        setGameState("results")
      }, 2000)
    }
  }

  const handlePlayAgain = () => {
    handleStartGame()
  }

  return (
    <div className="min-h-screen bg-background">
      <GameHeader score={score} scenario={currentScenario + 1} totalScenarios={3} />

      <main className="container mx-auto px-4 py-6">
        {gameState === "intro" && <GameIntro onStart={handleStartGame} />}

        {gameState === "playing" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GameScenario scenarioIndex={currentScenario} onDecision={handleDecision} />
            </div>
            <div>
              <SatelliteDataPanel scenarioIndex={currentScenario} />
            </div>
          </div>
        )}

        {gameState === "results" && <GameResults score={score} decisions={decisions} onPlayAgain={handlePlayAgain} />}
      </main>
    </div>
  )
}
