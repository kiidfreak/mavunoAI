"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, TrendingUp, Droplets, Bug, Calendar } from "lucide-react"

export default function AdvicePage() {
  const advice = [
    {
      id: 1,
      title: "Irrigation Recommendation",
      category: "Water Management",
      priority: "High",
      icon: Droplets,
      description:
        "Based on SMAP data, your soil moisture is at 58%. This is within optimal range for onion bulbing stage.",
      action: "Wait 3-4 days before next irrigation. Monitor SMAP data daily.",
      impact: "Save KES 2,400 in water costs this week",
      date: "Today",
    },
    {
      id: 2,
      title: "Pest Alert - Early Detection",
      category: "Crop Health",
      priority: "Medium",
      icon: Bug,
      description:
        "NDVI analysis shows 8% of your field has declining health. This pattern suggests early thrips infestation.",
      action: "Scout the northeastern section of your field. Apply targeted treatment if confirmed.",
      impact: "Prevent potential 15% yield loss (KES 18,000)",
      date: "2 hours ago",
    },
    {
      id: 3,
      title: "Optimal Harvest Window",
      category: "Planning",
      priority: "Low",
      icon: Calendar,
      description: "NDVI trends show your onions are approaching maturity. CHIRPS forecasts dry weather in 10-14 days.",
      action: "Plan harvest for Feb 8-12 when NDVI stabilizes and weather is optimal.",
      impact: "Maximize yield quality and market price",
      date: "Yesterday",
    },
    {
      id: 4,
      title: "Yield Forecast Update",
      category: "Analytics",
      priority: "Low",
      icon: TrendingUp,
      description: "Based on current NDVI trends and weather patterns, your projected yield is 12.5 tons/acre.",
      action: "Continue current management practices. You're on track for above-average yield.",
      impact: "Expected revenue: KES 375,000 (+20% vs. average)",
      date: "2 days ago",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">AI-Powered Advice</h1>
          <p className="text-muted-foreground">Personalized recommendations based on NASA satellite data</p>
        </div>

        <div className="grid gap-6">
          {advice.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle>{item.title}</CardTitle>
                          <Badge
                            variant={
                              item.priority === "High"
                                ? "destructive"
                                : item.priority === "Medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {item.priority}
                          </Badge>
                        </div>
                        <CardDescription>{item.category}</CardDescription>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.date}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Analysis</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Recommended Action</h4>
                    <p className="text-sm leading-relaxed">{item.action}</p>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <Lightbulb className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-primary">{item.impact}</span>
                  </div>
                  <Button className="w-full sm:w-auto">View Details</Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
