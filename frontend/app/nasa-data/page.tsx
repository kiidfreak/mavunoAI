"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Satellite, Droplets, Cloud, Leaf, TrendingUp } from "lucide-react"

export default function NASADataPage() {
  const [selectedDataset, setSelectedDataset] = useState("smap")

  const datasets = [
    {
      id: "smap",
      name: "SMAP",
      fullName: "Soil Moisture Active Passive",
      icon: Droplets,
      description: "Real-time soil moisture data from NASA's SMAP satellite",
      currentValue: "58%",
      status: "Optimal",
      lastUpdate: "2 hours ago",
      details: [
        { label: "Surface Moisture (0-5cm)", value: "58%" },
        { label: "Root Zone Moisture (0-100cm)", value: "52%" },
        { label: "7-Day Trend", value: "-12%" },
        { label: "Optimal Range", value: "45-65%" },
      ],
    },
    {
      id: "chirps",
      name: "CHIRPS",
      fullName: "Climate Hazards Group InfraRed Precipitation",
      icon: Cloud,
      description: "Rainfall estimates and forecasts for agricultural planning",
      currentValue: "45mm",
      status: "Normal",
      lastUpdate: "1 day ago",
      details: [
        { label: "Last 7 Days", value: "45mm" },
        { label: "Last 30 Days", value: "180mm" },
        { label: "Next 7 Days Forecast", value: "15mm (30% chance)" },
        { label: "Season Total", value: "420mm" },
      ],
    },
    {
      id: "landsat",
      name: "Landsat",
      fullName: "Landsat 8/9 Multispectral Imagery",
      icon: Leaf,
      description: "High-resolution crop health monitoring using NDVI",
      currentValue: "0.52",
      status: "Fair",
      lastUpdate: "3 days ago",
      details: [
        { label: "Current NDVI", value: "0.52" },
        { label: "Field Average", value: "0.48" },
        { label: "Healthy Area", value: "92%" },
        { label: "Stressed Area", value: "8%" },
      ],
    },
    {
      id: "modis",
      name: "MODIS",
      fullName: "Moderate Resolution Imaging Spectroradiometer",
      icon: TrendingUp,
      description: "Daily vegetation monitoring and temperature data",
      currentValue: "28°C",
      status: "Normal",
      lastUpdate: "6 hours ago",
      details: [
        { label: "Land Surface Temp", value: "28°C" },
        { label: "Daily Min/Max", value: "18°C / 32°C" },
        { label: "EVI (Enhanced Vegetation Index)", value: "0.45" },
        { label: "Vegetation Health", value: "Good" },
      ],
    },
  ]

  const currentDataset = datasets.find((d) => d.id === selectedDataset) || datasets[0]
  const Icon = currentDataset.icon

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Satellite className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">NASA Data Live</h1>
            <Badge variant="default" className="bg-primary">
              Live
            </Badge>
          </div>
          <p className="text-muted-foreground">Real-time satellite data for your farm from NASA Earth observations</p>
        </div>

        <Tabs value={selectedDataset} onValueChange={setSelectedDataset} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {datasets.map((dataset) => (
              <TabsTrigger key={dataset.id} value={dataset.id}>
                {dataset.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {datasets.map((dataset) => {
            const DatasetIcon = dataset.icon
            return (
              <TabsContent key={dataset.id} value={dataset.id} className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <DatasetIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle>{dataset.fullName}</CardTitle>
                          <Badge variant="secondary">{dataset.name}</Badge>
                        </div>
                        <CardDescription>{dataset.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardDescription>Current Value</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary">{dataset.currentValue}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardDescription>Status</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="default" className="text-base">
                            {dataset.status}
                          </Badge>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardDescription>Last Update</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-lg font-semibold">{dataset.lastUpdate}</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Detailed Metrics</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {dataset.details.map((detail, index) => (
                          <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                            <span className="text-sm text-muted-foreground">{detail.label}</span>
                            <span className="font-semibold">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 border">
                      <h4 className="font-semibold mb-2">About {dataset.name}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {dataset.id === "smap" &&
                          "SMAP provides soil moisture measurements at 9km resolution, updated every 2-3 days. This data helps optimize irrigation timing and water management."}
                        {dataset.id === "chirps" &&
                          "CHIRPS combines satellite imagery with ground station data to provide accurate rainfall estimates at 5km resolution, updated daily with 5-day forecasts."}
                        {dataset.id === "landsat" &&
                          "Landsat satellites provide 30m resolution imagery every 16 days. NDVI values range from -1 to 1, with higher values indicating healthier vegetation."}
                        {dataset.id === "modis" &&
                          "MODIS provides daily observations at 250m-1km resolution, ideal for monitoring vegetation changes and land surface temperature patterns."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>
      </main>
    </div>
  )
}
