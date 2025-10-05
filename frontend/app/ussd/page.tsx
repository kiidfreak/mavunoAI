import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Hash, Copy, ArrowLeft, Smartphone } from "lucide-react"
import Link from "next/link"

export default function USSDPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">USSD Access</h1>
            <p className="text-muted-foreground">Access MavunoAI from any phone, no internet required</p>
          </div>
        </div>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-6 h-6 text-primary" />
              Dial USSD Code
            </CardTitle>
            <CardDescription>Works on any mobile phone, even basic feature phones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center p-8 bg-primary/5 rounded-lg">
              <div className="text-center space-y-4">
                <Smartphone className="w-16 h-16 mx-auto text-primary" />
                <div className="text-4xl font-bold">*384*96#</div>
                <Button className="gap-2">
                  <Copy className="w-4 h-4" />
                  Copy Code
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Available Services</h3>
              <div className="grid gap-3">
                <div className="p-4 rounded-lg border">
                  <div className="font-semibold">1. Check Soil Moisture</div>
                  <p className="text-sm text-muted-foreground">Get current soil moisture levels for your farm</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="font-semibold">2. Weather Forecast</div>
                  <p className="text-sm text-muted-foreground">7-day weather forecast and rainfall predictions</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="font-semibold">3. Crop Health Status</div>
                  <p className="text-sm text-muted-foreground">NDVI-based crop health assessment</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="font-semibold">4. Irrigation Advice</div>
                  <p className="text-sm text-muted-foreground">When and how much to irrigate</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="font-semibold">5. Active Alerts</div>
                  <p className="text-sm text-muted-foreground">Critical notifications for your farm</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
              <h4 className="font-semibold mb-2">How It Works</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Dial *384*96# from your mobile phone</li>
                <li>Select your farm from the menu</li>
                <li>Choose the service you need</li>
                <li>Receive instant information via SMS</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
