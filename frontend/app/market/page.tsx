"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, MapPin, Phone } from "lucide-react"

export default function MarketPage() {
  const marketPrices = [
    {
      crop: "Onions (Red)",
      currentPrice: "KES 45/kg",
      trend: "up",
      change: "+12%",
      forecast: "Prices expected to rise next week due to low supply",
      buyers: [
        { name: "Wakulima Market", location: "Nairobi", price: "KES 48/kg", phone: "+254 712 345 678" },
        { name: "Gikomba Traders", location: "Nairobi", price: "KES 46/kg", phone: "+254 723 456 789" },
      ],
    },
    {
      crop: "Milk (Raw)",
      currentPrice: "KES 50/liter",
      trend: "stable",
      change: "0%",
      forecast: "Stable prices expected through the month",
      buyers: [
        { name: "Brookside Dairy", location: "Machakos", price: "KES 52/liter", phone: "+254 734 567 890" },
        { name: "Local Cooperative", location: "Kangundo", price: "KES 48/liter", phone: "+254 745 678 901" },
      ],
    },
    {
      crop: "Tomatoes",
      currentPrice: "KES 35/kg",
      trend: "down",
      change: "-8%",
      forecast: "Oversupply in market, consider delaying harvest if possible",
      buyers: [
        { name: "City Market", location: "Nairobi", price: "KES 38/kg", phone: "+254 756 789 012" },
        { name: "Fresh Produce Ltd", location: "Thika", price: "KES 36/kg", phone: "+254 767 890 123" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Market Prices</h1>
          <p className="text-muted-foreground">Real-time market prices and buyer connections</p>
        </div>

        <div className="grid gap-6">
          {marketPrices.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{item.crop}</CardTitle>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-3xl font-bold text-primary">{item.currentPrice}</span>
                      <Badge
                        variant={item.trend === "up" ? "default" : item.trend === "down" ? "destructive" : "secondary"}
                        className="gap-1"
                      >
                        {item.trend === "up" ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : item.trend === "down" ? (
                          <TrendingDown className="w-3 h-3" />
                        ) : (
                          <DollarSign className="w-3 h-3" />
                        )}
                        {item.change}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold">Market Forecast: </span>
                    {item.forecast}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Potential Buyers</h4>
                  <div className="space-y-3">
                    {item.buyers.map((buyer, buyerIndex) => (
                      <div key={buyerIndex} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="space-y-1">
                          <div className="font-semibold">{buyer.name}</div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {buyer.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {buyer.phone}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">{buyer.price}</div>
                          <Button size="sm" className="mt-2">
                            Contact
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
