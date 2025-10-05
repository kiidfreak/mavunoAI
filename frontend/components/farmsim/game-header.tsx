import { Button } from "@/components/ui/button"
import { Sprout, Trophy, Home } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface GameHeaderProps {
  score: number
  scenario: number
  totalScenarios: number
}

export function GameHeader({ score, scenario, totalScenarios }: GameHeaderProps) {
  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sprout className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-lg font-bold">FarmSim</div>
              <div className="text-xs text-muted-foreground">Learn with NASA Data</div>
            </div>
          </Link>

          {/* Progress */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Scenario {scenario}/{totalScenarios}
            </span>
            <Progress value={(scenario / totalScenarios) * 100} className="flex-1" />
          </div>

          {/* Score & Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="font-semibold text-accent">{score} pts</span>
            </div>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
