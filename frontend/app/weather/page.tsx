import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const forecast = [
  {
    day: "Mon",
    date: "Jan 20",
    icon: Sun,
    temp: "28°C",
    rain: "0%",
    condition: "Sunny",
    wind: "12 km/h",
    humidity: "45%",
  },
  {
    day: "Tue",
    date: "Jan 21",
    icon: Sun,
    temp: "29°C",
    rain: "5%",
    condition: "Clear",
    wind: "10 km/h",
    humidity: "42%",
  },
  {
    day: "Wed",
    date: "Jan 22",
    icon: Cloud,
    temp: "27°C",
    rain: "20%",
    condition: "Partly Cloudy",
    wind: "15 km/h",
    humidity: "55%",
  },
  {
    day: "Thu",
    date: "Jan 23",
    icon: CloudRain,
    temp: "24°C",
    rain: "65%",
    condition: "Rain",
    wind: "18 km/h",
    humidity: "75%",
  },
  {
    day: "Fri",
    date: "Jan 24",
    icon: CloudRain,
    temp: "23°C",
    rain: "80%",
    condition: "Heavy Rain",
    wind: "22 km/h",
    humidity: "85%",
  },
  {
    day: "Sat",
    date: "Jan 25",
    icon: Cloud,
    temp: "25°C",
    rain: "30%",
    condition: "Cloudy",
    wind: "14 km/h",
    humidity: "60%",
  },
  {
    day: "Sun",
    date: "Jan 26",
    icon: Sun,
    temp: "27°C",
    rain: "10%",
    condition: "Sunny",
    wind: "11 km/h",
    humidity: "48%",
  },
]

const historicalData = [
  { month: "Dec 2024", rainfall: "45mm", avgTemp: "26°C", status: "Below Average" },
  { month: "Nov 2024", rainfall: "120mm", avgTemp: "25°C", status: "Normal" },
  { month: "Oct 2024", rainfall: "180mm", avgTemp: "24°C", status: "Above Average" },
  { month: "Sep 2024", rainfall: "95mm", avgTemp: "25°C", status: "Normal" },
]

const weatherAlerts = [
  {
    type: "Heavy Rainfall",
    severity: "HIGH",
    message: "Heavy rainfall expected Thu-Fri. Prepare drainage systems.",
    date: "Jan 23-24",
  },
  {
    type: "Temperature Drop",
    severity: "MEDIUM",
    message: "Temperature will drop to 23°C. Monitor sensitive crops.",
    date: "Jan 24",
  },
]

export default function WeatherPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Weather Forecast</h1>
              <p className="text-muted-foreground">Detailed weather data for Kangundo Farm</p>
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        {weatherAlerts.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Active Weather Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weatherAlerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-background border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{alert.type}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          alert.severity === "HIGH"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-orange-500 text-white"
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 7-Day Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>7-Day Detailed Forecast</CardTitle>
            <CardDescription>CHIRPS rainfall data + local weather stations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {forecast.map((day, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg border-2 space-y-4 ${
                    index === 0 ? "bg-primary/5 border-primary" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">{day.day}</div>
                      <div className="text-sm text-muted-foreground">{day.date}</div>
                    </div>
                    <day.icon className={`w-10 h-10 ${index === 0 ? "text-primary" : "text-muted-foreground"}`} />
                  </div>

                  <div className="space-y-2">
                    <div className="text-3xl font-bold">{day.temp}</div>
                    <div className="text-sm text-muted-foreground">{day.condition}</div>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CloudRain className="w-4 h-4" />
                        <span>Rain</span>
                      </div>
                      <span className="font-medium">{day.rain}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Wind className="w-4 h-4" />
                        <span>Wind</span>
                      </div>
                      <span className="font-medium">{day.wind}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Droplets className="w-4 h-4" />
                        <span>Humidity</span>
                      </div>
                      <span className="font-medium">{day.humidity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Historical Weather Data */}
        <Card>
          <CardHeader>
            <CardTitle>Historical Weather Data</CardTitle>
            <CardDescription>Past 4 months rainfall and temperature trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {historicalData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <Thermometer className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{data.month}</div>
                      <div className="text-sm text-muted-foreground">{data.status}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <div className="text-muted-foreground">Rainfall</div>
                      <div className="font-semibold">{data.rainfall}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground">Avg Temp</div>
                      <div className="font-semibold">{data.avgTemp}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weather Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Weather Insights</CardTitle>
            <CardDescription>AI-powered recommendations based on forecast</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-semibold mb-2">Irrigation Recommendation</h4>
              <p className="text-sm text-muted-foreground">
                Heavy rainfall expected Thu-Fri (65-80% chance). Skip irrigation for the next 3 days to avoid
                waterlogging. Resume irrigation on Saturday if soil moisture drops below 50%.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
              <h4 className="font-semibold mb-2">Crop Protection</h4>
              <p className="text-sm text-muted-foreground">
                Temperature drop to 23°C on Friday may stress heat-sensitive crops. Consider protective measures for
                young plants.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <h4 className="font-semibold mb-2">Field Operations</h4>
              <p className="text-sm text-muted-foreground">
                Plan field work for Mon-Wed when conditions are dry. Avoid heavy machinery Thu-Fri due to wet soil
                conditions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
