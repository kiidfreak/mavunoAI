import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, Leaf, CloudRain, Thermometer } from "lucide-react"

interface SatelliteDataPanelProps {
  scenarioIndex: number
}

const scenarioData = [
  {
    // Scenario 1: Irrigation Decision
    smap: { value: "28%", status: "Optimal", color: "text-primary" },
    ndvi: { value: "0.68", status: "Healthy", color: "text-primary" },
    chirps: { value: "5%", status: "Low Chance", color: "text-secondary" },
    temp: { value: "26°C", status: "Normal", color: "text-foreground" },
    tip: "SMAP shows soil moisture at 28%, which is within the optimal range (25-35%) for onion bulbing stage. No immediate irrigation needed.",
  },
  {
    // Scenario 2: Pest Detection
    smap: { value: "31%", status: "Good", color: "text-primary" },
    ndvi: { value: "0.58", status: "Declining", color: "text-secondary" },
    chirps: { value: "15%", status: "Moderate", color: "text-foreground" },
    temp: { value: "28°C", status: "Warm", color: "text-secondary" },
    tip: "Landsat NDVI dropped from 0.72 to 0.58 in the affected area. This 8% zone shows stress patterns consistent with pest damage. Early detection saves crops!",
  },
  {
    // Scenario 3: Harvest Timing
    smap: { value: "25%", status: "Adequate", color: "text-primary" },
    ndvi: { value: "0.45", status: "Senescing", color: "text-accent" },
    chirps: { value: "65%", status: "Rain Soon", color: "text-chart-4" },
    temp: { value: "24°C", status: "Cool", color: "text-foreground" },
    tip: "NDVI plateau at 0.45 indicates maturity. CHIRPS forecasts 65% rain in 4 days. Harvest during the current dry window for best quality!",
  },
]

export function SatelliteDataPanel({ scenarioIndex }: SatelliteDataPanelProps) {
  const data = scenarioData[scenarioIndex]

  return (
    <div className="space-y-4">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">NASA Satellite Data</CardTitle>
          <CardDescription>Use this data to make your decision</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* SMAP */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-10 h-10 rounded-lg bg-chart-4/20 flex items-center justify-center flex-shrink-0">
              <Droplets className="w-5 h-5 text-chart-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-xs text-muted-foreground">SMAP Soil Moisture</div>
              <div className={`text-2xl font-bold ${data.smap.color}`}>{data.smap.value}</div>
              <Badge variant="secondary" className="text-xs">
                {data.smap.status}
              </Badge>
            </div>
          </div>

          {/* NDVI */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-xs text-muted-foreground">Landsat NDVI</div>
              <div className={`text-2xl font-bold ${data.ndvi.color}`}>{data.ndvi.value}</div>
              <Badge variant="secondary" className="text-xs">
                {data.ndvi.status}
              </Badge>
            </div>
          </div>

          {/* CHIRPS */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-10 h-10 rounded-lg bg-chart-4/20 flex items-center justify-center flex-shrink-0">
              <CloudRain className="w-5 h-5 text-chart-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-xs text-muted-foreground">CHIRPS Rain Forecast</div>
              <div className={`text-2xl font-bold ${data.chirps.color}`}>{data.chirps.value}</div>
              <Badge variant="secondary" className="text-xs">
                {data.chirps.status}
              </Badge>
            </div>
          </div>

          {/* Temperature */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <Thermometer className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-xs text-muted-foreground">MODIS Temperature</div>
              <div className={`text-2xl font-bold ${data.temp.color}`}>{data.temp.value}</div>
              <Badge variant="secondary" className="text-xs">
                {data.temp.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Educational Tip */}
      <Card className="border-2 border-accent/20 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="text-accent">💡</span> Data Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">{data.tip}</p>
        </CardContent>
      </Card>
    </div>
  )
}
