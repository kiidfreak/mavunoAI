"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const regions = [
  { name: "Rift Valley", farms: 847, avgNDVI: 0.71, alerts: 12, status: "healthy" },
  { name: "Central", farms: 523, avgNDVI: 0.68, alerts: 8, status: "healthy" },
  { name: "Eastern", farms: 412, avgNDVI: 0.58, alerts: 9, status: "warning" },
  { name: "Western", farms: 389, avgNDVI: 0.73, alerts: 3, status: "healthy" },
  { name: "Nyanza", farms: 298, avgNDVI: 0.65, alerts: 2, status: "healthy" },
  { name: "Coast", farms: 234, avgNDVI: 0.52, alerts: 0, status: "critical" },
]

export function RegionalMap() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Regional Satellite Data</CardTitle>
            <CardDescription>Aggregate NDVI and conditions across regions</CardDescription>
          </div>
          <Badge variant="secondary">Last updated: 2 hours ago</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="data">Data View</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden border-2 relative bg-muted">
              <img
                src="/kenya-regional-map-with-agricultural-zones-highlig.jpg"
                alt="Kenya regional map"
                className="w-full h-full object-cover"
              />

              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 border space-y-2">
                <div className="text-xs font-semibold">Health Status</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span>Healthy (NDVI &gt; 0.65)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary" />
                    <span>Warning (0.55-0.65)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <span>Critical (&lt; 0.55)</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data">
            <div className="space-y-3">
              {regions.map((region, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          region.status === "healthy"
                            ? "bg-primary"
                            : region.status === "warning"
                              ? "bg-secondary"
                              : "bg-destructive"
                        }`}
                      />
                      <div>
                        <div className="font-semibold">{region.name}</div>
                        <div className="text-xs text-muted-foreground">{region.farms} farms monitored</div>
                      </div>
                    </div>
                    {region.alerts > 0 && (
                      <Badge variant="secondary" className="bg-secondary/20">
                        {region.alerts} alerts
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs">Avg NDVI</div>
                      <div className="font-semibold">{region.avgNDVI}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Status</div>
                      <div className="font-semibold capitalize">{region.status}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Farms</div>
                      <div className="font-semibold">{region.farms}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
