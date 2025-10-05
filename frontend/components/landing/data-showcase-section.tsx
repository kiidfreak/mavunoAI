"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function DataShowcaseSection() {
  return (
    <section id="data" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
            Powered by <span className="text-accent">NASA Data</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            We integrate multiple NASA satellite systems to give you the most comprehensive farm intelligence
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="smap" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="smap">SMAP</TabsTrigger>
              <TabsTrigger value="chirps">CHIRPS</TabsTrigger>
              <TabsTrigger value="landsat">Landsat</TabsTrigger>
              <TabsTrigger value="modis">MODIS</TabsTrigger>
            </TabsList>

            <TabsContent value="smap" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">Soil Moisture Active Passive (SMAP)</CardTitle>
                      <CardDescription className="text-base mt-2">
                        NASA's premier soil moisture monitoring satellite
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-chart-4/20 to-chart-1/20 flex items-center justify-center border-2 border-dashed">
                    <img
                      src="/soil-moisture-heatmap-visualization-with-blue-to-r.jpg"
                      alt="SMAP soil moisture data"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Resolution</div>
                      <div className="text-lg font-semibold">9km</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Update Frequency</div>
                      <div className="text-lg font-semibold">2-3 days</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Depth</div>
                      <div className="text-lg font-semibold">0-5cm</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    SMAP measures soil moisture in the top 5cm of soil, helping you optimize irrigation timing and
                    prevent water stress or overwatering.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chirps" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">Climate Hazards InfraRed Precipitation (CHIRPS)</CardTitle>
                      <CardDescription className="text-base mt-2">
                        High-resolution rainfall monitoring for Africa
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-chart-4/20 to-primary/20 flex items-center justify-center border-2 border-dashed">
                    <img
                      src="/rainfall-precipitation-map-with-blue-gradient-show.jpg"
                      alt="CHIRPS rainfall data"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Resolution</div>
                      <div className="text-lg font-semibold">5km</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Update Frequency</div>
                      <div className="text-lg font-semibold">Daily</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">History</div>
                      <div className="text-lg font-semibold">40+ years</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    CHIRPS provides accurate rainfall estimates and forecasts, helping you plan planting dates and
                    prepare for dry spells or heavy rains.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="landsat" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">Landsat 8/9</CardTitle>
                      <CardDescription className="text-base mt-2">
                        High-resolution multispectral imaging
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-dashed">
                    <img
                      src="/ndvi-crop-health-map-with-green-to-red-gradient-sh.jpg"
                      alt="Landsat NDVI data"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Resolution</div>
                      <div className="text-lg font-semibold">30m</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Update Frequency</div>
                      <div className="text-lg font-semibold">16 days</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Bands</div>
                      <div className="text-lg font-semibold">11 spectral</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Landsat captures detailed images that reveal crop health through NDVI analysis, showing exactly
                    where plants are stressed or thriving.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="modis" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">MODIS (Terra & Aqua)</CardTitle>
                      <CardDescription className="text-base mt-2">
                        Daily vegetation and temperature monitoring
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center border-2 border-dashed">
                    <img
                      src="/land-surface-temperature-map-with-warm-color-gradi.jpg"
                      alt="MODIS temperature data"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Resolution</div>
                      <div className="text-lg font-semibold">250m-1km</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Update Frequency</div>
                      <div className="text-lg font-semibold">Daily</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Coverage</div>
                      <div className="text-lg font-semibold">Global</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    MODIS provides daily updates on vegetation indices and land surface temperature, helping detect heat
                    stress and monitor crop development.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
