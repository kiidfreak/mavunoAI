"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jul", yield: 6.2 },
  { month: "Aug", yield: 6.8 },
  { month: "Sep", yield: 7.1 },
  { month: "Oct", yield: 7.5 },
  { month: "Nov", yield: 7.9 },
  { month: "Dec", yield: 8.2 },
]

export function ImpactMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact Metrics</CardTitle>
        <CardDescription>Average yield trends (tons/ha)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ChartContainer
          config={{
            yield: {
              label: "Yield",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="yield" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Water Saved</div>
            <div className="text-2xl font-bold text-chart-4">2.3M L</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Cost Reduction</div>
            <div className="text-2xl font-bold text-accent">$124K</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
