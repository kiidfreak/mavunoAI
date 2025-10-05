import { Card, CardContent } from "@/components/ui/card"
import { Users, MapPin, TrendingUp, AlertTriangle } from "lucide-react"

const metrics = [
  {
    icon: Users,
    label: "Active Farmers",
    value: "1,247",
    change: "+23 this month",
    changePositive: true,
    color: "text-primary",
  },
  {
    icon: MapPin,
    label: "Monitored Farms",
    value: "2,891",
    change: "Across 12 regions",
    changePositive: true,
    color: "text-chart-4",
  },
  {
    icon: TrendingUp,
    label: "Avg Yield Increase",
    value: "+18%",
    change: "vs last season",
    changePositive: true,
    color: "text-accent",
  },
  {
    icon: AlertTriangle,
    label: "Active Alerts",
    value: "34",
    change: "Require attention",
    changePositive: false,
    color: "text-secondary",
  },
]

export function NetworkOverview() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Network Overview</h2>
        <p className="text-muted-foreground">Real-time monitoring across your farmer network</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-2">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${metric.color}`}>
                  <metric.icon className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-3xl font-bold">{metric.value}</p>
                <div className="flex items-center gap-1">
                  <span className={`text-sm ${metric.changePositive ? "text-primary" : "text-secondary"}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
