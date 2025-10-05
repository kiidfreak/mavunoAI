import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, TrendingDown, CloudRain } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const alerts = [
  {
    icon: Droplets,
    title: "Soil moisture has dropped to 58% (LOW). Onions in bulb formation stage need water.",
    severity: "HIGH",
    time: "2 hours ago",
    action: "View Details",
  },
  {
    icon: CloudRain,
    title: "15mm rainfall predicted Thu-Fri (65% confidence). Consider delaying fertilizer application.",
    severity: "MEDIUM",
    time: "4 hours ago",
    action: "View Forecast",
  },
  {
    icon: TrendingDown,
    title: "Your NDVI is 0.06 below neighboring farms. Compare management practices.",
    severity: "LOW",
    description: "NDVI Declining",
    time: "1 day ago",
    action: "Compare",
  },
]

const severityColors = {
  HIGH: "bg-destructive text-destructive-foreground",
  MEDIUM: "bg-secondary text-secondary-foreground",
  LOW: "bg-muted text-muted-foreground",
}

export function AlertsPanel() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>
              <Badge variant="destructive" className="mr-2">
                2 Urgent
              </Badge>
              <Button variant="link" className="h-auto p-0 text-sm">
                View All
              </Button>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert, index) => (
          <div key={index} className="space-y-2 pb-4 border-b last:border-b-0 last:pb-0">
            <div className="flex items-start gap-3">
              <Badge className={severityColors[alert.severity]}>{alert.severity}</Badge>
              <div className="flex-1 space-y-2">
                <p className="text-sm leading-relaxed">{alert.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                    {alert.action}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
