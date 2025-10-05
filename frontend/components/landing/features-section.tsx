import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Leaf, CloudRain, TrendingUp, Smartphone, Globe, CreditCard, Users, Trophy } from "lucide-react"

const features = [
  {
    icon: Droplets,
    title: "Soil Moisture Monitoring",
    description:
      "Real-time soil moisture data from NASA SMAP satellites helps you irrigate at the perfect time. Onion farmers reduce losses from 30% to 15%, saving KES 48k per acre per season.",
    color: "text-chart-4",
  },
  {
    icon: Leaf,
    title: "Crop Health Analysis",
    description:
      "NDVI satellite imagery shows exactly where your crops are thriving or struggling. Catch problems early and prevent losses before they spread across your fields.",
    color: "text-primary",
  },
  {
    icon: CloudRain,
    title: "Weather Forecasts",
    description:
      "Hyperlocal weather predictions powered by CHIRPS rainfall data help you plan planting, harvesting, and protection strategies with confidence.",
    color: "text-chart-4",
  },
  {
    icon: TrendingUp,
    title: "Yield Predictions",
    description:
      "AI-powered forecasts estimate your harvest size weeks in advance. Dairy farmers save KES 480k annually on feed costs while increasing milk yields by 5%.",
    color: "text-accent",
  },
  {
    icon: Smartphone,
    title: "Multi-Channel Access",
    description:
      "Get insights via WhatsApp, USSD, or web dashboard. No smartphone required - we meet you where you are with simple, actionable advice.",
    color: "text-secondary",
  },
  {
    icon: Globe,
    title: "Localized Recommendations",
    description:
      "Advice tailored to your specific crop, location, and farming practices. Start with onions or dairy, expand as you grow. Both seasonal and continuous impact.",
    color: "text-primary",
  },
  {
    icon: CreditCard,
    title: "M-Pesa Integration",
    description:
      "Earn M-Pesa points for successful farming decisions. Trade harvests for virtual currency, buy inputs with points, and receive real-world rewards from top cooperatives.",
    color: "text-emerald-600",
  },
  {
    icon: Users,
    title: "Farmer Network",
    description:
      "Connect with fellow farmers, share successful strategies, and get real-time pest alerts. Join cooperatives for collective bargaining and resource sharing.",
    color: "text-sky-600",
  },
  {
    icon: Trophy,
    title: "County Competitions",
    description:
      "Compete in friendly county leaderboards. Machakos vs Kiambu rivalry drives innovation. Top performers earn input vouchers and recognition.",
    color: "text-amber-600",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
            NASA Technology, <span className="text-primary">Farmer-Friendly</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            We translate complex satellite data into simple, actionable insights that help you make better farming
            decisions every day.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
