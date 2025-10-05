"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export function CropHealthMap() {
  const [activeLayer, setActiveLayer] = useState("ndvi")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Kangundo Farm - Interactive Map</CardTitle>
            <CardDescription>Live Data</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge
              variant={activeLayer === "ndvi" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveLayer("ndvi")}
            >
              NDVI
            </Badge>
            <Badge
              variant={activeLayer === "rainfall" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveLayer("rainfall")}
            >
              Rainfall
            </Badge>
            <Badge
              variant={activeLayer === "soil" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveLayer("soil")}
            >
              Soil Moisture
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video rounded-lg overflow-hidden border-2 relative">
          <img
            src="/aerial-view-of-farm-with-field-boundaries-and-ndvi.jpg"
            alt="Aerial view of Kangundo Farm with field boundaries"
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 border space-y-2">
            <div className="text-xs font-semibold">Your Farm (2 ha)</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Current NDVI</span>
                <span className="font-semibold">0.52</span>
              </div>
              <div className="text-muted-foreground">Fair Health</div>
            </div>
            <div className="space-y-1 text-xs pt-2 border-t">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Soil Moisture</span>
                <span className="font-semibold">58%</span>
              </div>
              <div className="text-muted-foreground">Below Threshold</div>
            </div>
            <div className="pt-2 border-t">
              <div className="text-xs font-semibold mb-1">Weather Station</div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Healthy (NDVI &gt; 0.6)</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-muted-foreground">Fair (0.4-0.6)</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-muted-foreground">Poor (&lt; 0.4)</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground pt-2 border-t">Last updated: 2 hours ago</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
