"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ExternalLink } from "lucide-react"

const farmers = [
  {
    name: "John Kamau",
    location: "Rift Valley",
    farms: 2,
    totalArea: "12 ha",
    ndvi: 0.72,
    moisture: "31%",
    status: "healthy",
    lastActive: "2 hours ago",
  },
  {
    name: "Mary Wanjiku",
    location: "Central",
    farms: 1,
    totalArea: "8 ha",
    ndvi: 0.68,
    moisture: "28%",
    status: "healthy",
    lastActive: "5 hours ago",
  },
  {
    name: "Peter Omondi",
    location: "Eastern",
    farms: 3,
    totalArea: "18 ha",
    ndvi: 0.58,
    moisture: "22%",
    status: "warning",
    lastActive: "1 day ago",
  },
  {
    name: "Grace Akinyi",
    location: "Western",
    farms: 1,
    totalArea: "6 ha",
    ndvi: 0.74,
    moisture: "33%",
    status: "healthy",
    lastActive: "3 hours ago",
  },
  {
    name: "David Mwangi",
    location: "Nyanza",
    farms: 2,
    totalArea: "15 ha",
    ndvi: 0.65,
    moisture: "29%",
    status: "healthy",
    lastActive: "1 hour ago",
  },
]

export function FarmerTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Farmer Network</CardTitle>
            <CardDescription>Monitor individual farmer performance</CardDescription>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search farmers..." className="pl-9" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {farmers.map((farmer, index) => (
            <div key={index} className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold">{farmer.name}</div>
                    <Badge
                      variant="secondary"
                      className={
                        farmer.status === "healthy" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                      }
                    >
                      {farmer.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {farmer.location} • {farmer.farms} farms • {farmer.totalArea}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">NDVI</div>
                  <div className="font-semibold">{farmer.ndvi}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Soil Moisture</div>
                  <div className="font-semibold">{farmer.moisture}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Last Active</div>
                  <div className="font-semibold text-xs">{farmer.lastActive}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
