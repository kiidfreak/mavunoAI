import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Droplets, TrendingDown } from "lucide-react"

const alerts = [
  {
    type: "critical",
    icon: AlertTriangle,
    title: "Drought Risk - Coast Region",
    affected: "234 farms",
    time: "1 hour ago",
  },
  {
    type: "warning",
    icon: Droplets,
    title: "Low Moisture - Eastern",
    affected: "89 farms",
    time: "3 hours ago",
  },
  {
    type: "warning",
    icon: TrendingDown,
    title: "NDVI Decline - Rift Valley",
    affected: "45 farms",
    time: "5 hours ago",
  },
]

const typeColors = {
  critical: "bg-destructive text-destructive-foreground",
  warning: "bg-secondary text-secondary-foreground",
  info: "bg-chart-4 text-white",
}

export function AlertsOverview() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Network Alerts</CardTitle>
            <CardDescription>Critical issues across regions</CardDescription>
          </div>
          <Badge variant="secondary">34 active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => (
          <div key={index} className="p-3 rounded-lg border bg-card space-y-2">
            <div className="flex gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[alert.type]}`}
              >
                <alert.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="font-semibold text-sm">{alert.title}</div>
                <div className="text-xs text-muted-foreground">{alert.affected} affected</div>
                <div className="text-xs text-muted-foreground">{alert.time}</div>
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full bg-transparent">
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  )
}
