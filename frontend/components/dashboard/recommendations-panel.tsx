import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplets, Sprout, Calendar } from "lucide-react"

const recommendations = [
  {
    icon: Droplets,
    title: "Irrigate Northwest Section",
    description: "Apply 15mm water to maintain optimal moisture levels",
    priority: "high",
    action: "Schedule",
  },
  {
    icon: Sprout,
    title: "Apply Fertilizer",
    description: "NPK 10-20-10 recommended based on growth stage",
    priority: "medium",
    action: "View Details",
  },
  {
    icon: Calendar,
    title: "Harvest Window",
    description: "Optimal harvest period: Feb 5-12 based on maturity forecast",
    priority: "low",
    action: "Set Reminder",
  },
]

const priorityColors = {
  high: "text-secondary",
  medium: "text-accent",
  low: "text-primary",
}

export function RecommendationsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Recommendations</CardTitle>
        <CardDescription>Personalized farming advice</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="space-y-3 p-4 rounded-lg border bg-card">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 ${priorityColors[rec.priority]}`}
              >
                <rec.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="font-semibold text-sm">{rec.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{rec.description}</div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full bg-transparent">
              {rec.action}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
