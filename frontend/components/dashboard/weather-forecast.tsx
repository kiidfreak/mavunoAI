import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, Sun } from "lucide-react"

const forecast = [
  { day: "Mon", date: "Jan 20", icon: Sun, temp: "28°C", rain: "0%", condition: "Sunny" },
  { day: "Tue", date: "Jan 21", icon: Sun, temp: "29°C", rain: "5%", condition: "Clear" },
  { day: "Wed", date: "Jan 22", icon: Cloud, temp: "27°C", rain: "20%", condition: "Partly Cloudy" },
  { day: "Thu", date: "Jan 23", icon: CloudRain, temp: "24°C", rain: "65%", condition: "Rain" },
  { day: "Fri", date: "Jan 24", icon: CloudRain, temp: "23°C", rain: "80%", condition: "Heavy Rain" },
  { day: "Sat", date: "Jan 25", icon: Cloud, temp: "25°C", rain: "30%", condition: "Cloudy" },
  { day: "Sun", date: "Jan 26", icon: Sun, temp: "27°C", rain: "10%", condition: "Sunny" },
]

export function WeatherForecast() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Weather Forecast</CardTitle>
        <CardDescription>CHIRPS rainfall data + local weather stations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {forecast.map((day, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 text-center space-y-3 ${
                index === 0 ? "bg-primary/5 border-primary" : "border-border"
              }`}
            >
              <div>
                <div className="font-semibold">{day.day}</div>
                <div className="text-xs text-muted-foreground">{day.date}</div>
              </div>

              <div className="flex justify-center">
                <day.icon className={`w-8 h-8 ${index === 0 ? "text-primary" : "text-muted-foreground"}`} />
              </div>

              <div className="space-y-1">
                <div className="text-lg font-bold">{day.temp}</div>
                <div className="text-xs text-muted-foreground">{day.condition}</div>
              </div>

              <div className="flex items-center justify-center gap-1 text-xs">
                <CloudRain className="w-3 h-3 text-chart-4" />
                <span className="font-medium">{day.rain}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
