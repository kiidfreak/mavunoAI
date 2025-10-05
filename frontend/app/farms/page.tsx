"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, TrendingUp, Droplets, Leaf } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FarmsPage() {
  const [farms, setFarms] = useState([
    {
      id: 1,
      name: "Kangundo Farm",
      location: "Machakos County",
      size: "2.5 acres",
      crop: "Onions",
      status: "Active",
      soilMoisture: 58,
      ndvi: 0.52,
      alerts: 2,
    },
    {
      id: 2,
      name: "Mwala Dairy",
      location: "Machakos County",
      size: "5 acres",
      crop: "Pasture (Dairy)",
      status: "Active",
      soilMoisture: 45,
      ndvi: 0.68,
      alerts: 0,
    },
    {
      id: 3,
      name: "Kathiani Plot",
      location: "Machakos County",
      size: "1 acre",
      crop: "Vegetables",
      status: "Planning",
      soilMoisture: 62,
      ndvi: 0.41,
      alerts: 1,
    },
  ])

  const [isAddingFarm, setIsAddingFarm] = useState(false)
  const [newFarm, setNewFarm] = useState({
    name: "",
    location: "",
    size: "",
    crop: "",
  })

  const handleAddFarm = () => {
    if (newFarm.name && newFarm.location && newFarm.size && newFarm.crop) {
      setFarms([
        ...farms,
        {
          id: farms.length + 1,
          name: newFarm.name,
          location: newFarm.location,
          size: newFarm.size,
          crop: newFarm.crop,
          status: "Planning",
          soilMoisture: 50,
          ndvi: 0.5,
          alerts: 0,
        },
      ])
      setNewFarm({ name: "", location: "", size: "", crop: "" })
      setIsAddingFarm(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Farms</h1>
            <p className="text-muted-foreground">Manage and monitor all your farms in one place</p>
          </div>

          <Dialog open={isAddingFarm} onOpenChange={setIsAddingFarm}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Farm
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Farm</DialogTitle>
                <DialogDescription>Enter the details of your new farm to start monitoring</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Farm Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Kangundo Farm"
                    value={newFarm.name}
                    onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Machakos County"
                    value={newFarm.location}
                    onChange={(e) => setNewFarm({ ...newFarm, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Farm Size</Label>
                  <Input
                    id="size"
                    placeholder="e.g., 2.5 acres"
                    value={newFarm.size}
                    onChange={(e) => setNewFarm({ ...newFarm, size: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crop">Primary Crop</Label>
                  <Select value={newFarm.crop} onValueChange={(value) => setNewFarm({ ...newFarm, crop: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Onions">Onions</SelectItem>
                      <SelectItem value="Pasture (Dairy)">Pasture (Dairy)</SelectItem>
                      <SelectItem value="Vegetables">Vegetables</SelectItem>
                      <SelectItem value="Maize">Maize</SelectItem>
                      <SelectItem value="Beans">Beans</SelectItem>
                      <SelectItem value="Tomatoes">Tomatoes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingFarm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddFarm}>Add Farm</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <Card key={farm.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{farm.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {farm.location}
                    </CardDescription>
                  </div>
                  <Badge variant={farm.status === "Active" ? "default" : "secondary"}>{farm.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Size</div>
                    <div className="font-semibold">{farm.size}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Crop</div>
                    <div className="font-semibold">{farm.crop}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-primary" />
                      <span>Soil Moisture</span>
                    </div>
                    <span className="font-semibold">{farm.soilMoisture}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-primary" />
                      <span>Crop Health (NDVI)</span>
                    </div>
                    <span className="font-semibold">{farm.ndvi}</span>
                  </div>
                  {farm.alerts > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-secondary" />
                        <span>Active Alerts</span>
                      </div>
                      <Badge variant="destructive">{farm.alerts}</Badge>
                    </div>
                  )}
                </div>

                <Button className="w-full bg-transparent" variant="outline" asChild>
                  <a href="/dashboard">View Dashboard</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
