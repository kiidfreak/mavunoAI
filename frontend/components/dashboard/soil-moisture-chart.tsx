"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { date: "Jan 1", moisture: 28, optimal_min: 25, optimal_max: 35 },
  { date: "Jan 3", moisture: 30, optimal_min: 25, optimal_max: 35 },
  { date: "Jan 5", moisture: 26, optimal_min: 25, optimal_max: 35 },
  { date: "Jan 7", moisture: 32, optimal_min: 25, optimal_max: 35 },
  { date: "Jan 9", moisture: 35, optimal_min: 25, optimal_max: 35 },
  { date: "Jan 11", moisture: 33, optimal_min: 25, optimal_max: 35 },
  { date: "Jan 13", moisture: 31, optimal_min: 25, optimal_max: 35 },
  { date: "Jan 15", moisture: 29, optimal_min: 25, optimal_max: 35 },
  { date: "Jan 17", moisture: 32, optimal_min: 25, optimal_max: 35 },
  { date: "Jan 19", moisture: 34, optimal_min: 25, optimal_max: 35 },
]

export function SoilMoistureChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Soil Moisture Trends</CardTitle>
            <CardDescription>SMAP satellite data - Last 20 days</CardDescription>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-4" />
              <span className="text-muted-foreground">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/30" />
              <span className="text-muted-foreground">Optimal Range</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            moisture: {
              label: "Soil Moisture",
              color: "hsl(var(--chart-4))",
            },
            optimal_min: {
              label: "Min Optimal",
              color: "hsl(var(--primary))",
            },
            optimal_max: {
              label: "Max Optimal",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" label={{ value: "Moisture %", angle: -90, position: "insideLeft" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="optimal_max"
                stackId="1"
                stroke="none"
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="optimal_min"
                stackId="1"
                stroke="none"
                fill="hsl(var(--background))"
                fillOpacity={1}
              />
              <Area
                type="monotone"
                dataKey="moisture"
                stroke="hsl(var(--chart-4))"
                fill="hsl(var(--chart-4))"
                fillOpacity={0.6}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
