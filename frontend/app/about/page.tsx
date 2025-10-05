import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Satellite, Users, Target, Award, TrendingUp, Sprout, Milk } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
                Empowering African Farmers with <span className="text-primary">Space Technology</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty">
                MavunoAI bridges the gap between NASA's satellite data and smallholder farmers, making precision
                agriculture accessible to everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Our Mission</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Making Satellite Data Accessible</h2>
                <p className="text-lg text-muted-foreground">
                  We believe every farmer deserves access to the same technology used by large agricultural
                  corporations. By translating complex NASA satellite data into simple, actionable insights, we're
                  helping smallholder farmers increase yields, save water, and build climate resilience.
                </p>
                <div className="flex gap-4">
                  <Link href="/dashboard">
                    <Button size="lg">Start Free Trial</Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/african-farmland-from-satellite-view-with-green-fi.jpg"
                  alt="Satellite view of farmland"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">60+</div>
                  <div className="text-sm text-muted-foreground">Farms Connected</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center space-y-2">
                  <div className="text-4xl font-bold text-secondary">KES 1.2M</div>
                  <div className="text-sm text-muted-foreground">Max Annual Benefit</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center space-y-2">
                  <div className="text-4xl font-bold text-accent">50%</div>
                  <div className="text-sm text-muted-foreground">Loss Reduction</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center space-y-2">
                  <div className="text-4xl font-bold text-chart-4">4</div>
                  <div className="text-sm text-muted-foreground">NASA Data Sources</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Cost-Benefit Analysis Impact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Real Impact</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Turning Satellite Data into Farmer Income</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  MavunoAI creates measurable financial impact by preventing losses and optimizing resources. Here's the
                  math, explained simply.
                </p>
              </div>

              {/* Onions Impact */}
              <Card className="border-2 border-primary/20">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Sprout className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Onions - Loss Prevention</h3>
                      <p className="text-muted-foreground">
                        High-loss crops mean high ROI in a single season. Perfect for immediate impact.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-6 rounded-lg bg-muted/50">
                      <div className="font-semibold text-lg">Smallholder (1 acre)</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gross revenue:</span>
                          <span className="font-semibold">KES 320k</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Current losses (30%):</span>
                          <span className="font-semibold text-destructive">-KES 96k</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">With MavunoAI (15% loss):</span>
                          <span className="font-semibold text-muted-foreground">-KES 48k</span>
                        </div>
                        <div className="pt-2 border-t flex justify-between">
                          <span className="font-semibold">Net gain per acre:</span>
                          <span className="font-bold text-primary text-lg">+KES 48k</span>
                        </div>
                        <div className="text-xs text-muted-foreground">≈ 60% more profit</div>
                      </div>
                    </div>

                    <div className="space-y-4 p-6 rounded-lg bg-muted/50">
                      <div className="font-semibold text-lg">Large Farmer (10 acres)</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gross revenue:</span>
                          <span className="font-semibold">KES 3.2M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Current losses (30%):</span>
                          <span className="font-semibold text-destructive">-KES 960k</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">With MavunoAI (15% loss):</span>
                          <span className="font-semibold text-muted-foreground">-KES 480k</span>
                        </div>
                        <div className="pt-2 border-t flex justify-between">
                          <span className="font-semibold">Recovered per season:</span>
                          <span className="font-bold text-primary text-lg">+KES 480k</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dairy Impact */}
              <Card className="border-2 border-secondary/20">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Milk className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Dairy - Feed Optimization</h3>
                      <p className="text-muted-foreground">
                        Steady monthly savings make it perfect for partnerships with SACCOs and cooperatives.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-6 rounded-lg bg-muted/50">
                      <div className="font-semibold text-lg">Smallholder (3 cows)</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Baseline margin:</span>
                          <span className="font-semibold">KES 17k/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Feed cost reduction:</span>
                          <span className="font-semibold text-secondary">20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stabilized yields:</span>
                          <span className="font-semibold text-secondary">+5%</span>
                        </div>
                        <div className="pt-2 border-t flex justify-between">
                          <span className="font-semibold">Annual benefit:</span>
                          <span className="font-bold text-secondary text-lg">+KES 50-60k</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-6 rounded-lg bg-muted/50">
                      <div className="font-semibold text-lg">Large Farmer (50 cows)</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Feed cost savings:</span>
                          <span className="font-semibold">KES 480k/year</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Extra yield revenue:</span>
                          <span className="font-semibold">KES 720k/year</span>
                        </div>
                        <div className="pt-2 border-t flex justify-between">
                          <span className="font-semibold">Total annual benefit:</span>
                          <span className="font-bold text-secondary text-lg">+KES 1.2M</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Why It Matters */}
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2">
                <CardContent className="p-8 space-y-4">
                  <h3 className="text-xl font-bold">Why Both Crops Matter</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="font-semibold flex items-center gap-2">
                        <Sprout className="w-5 h-5 text-primary" />
                        Onions: Seasonal Impact
                      </div>
                      <p className="text-sm text-muted-foreground">
                        High-loss crops demonstrate immediate ROI in a single season. Farmers see results fast, making
                        it easy to prove value and scale adoption.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="font-semibold flex items-center gap-2">
                        <Milk className="w-5 h-5 text-secondary" />
                        Dairy: Continuous Impact
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Steady monthly savings create predictable income streams, perfect for partnerships with SACCOs,
                        cooperatives, and agricultural insurers.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t text-center">
                    <p className="font-semibold text-lg italic">
                      "MavunoAI turns Earth Observation into measurable farmer income."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
              <p className="text-lg text-muted-foreground">Built on principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Accessibility First</h3>
                  <p className="text-muted-foreground">
                    Technology should work for everyone, regardless of location, device, or technical expertise.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Satellite className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold">Data-Driven</h3>
                  <p className="text-muted-foreground">
                    We leverage the best satellite technology to provide accurate, real-time insights.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold">Farmer Success</h3>
                  <p className="text-muted-foreground">
                    Every feature we build is designed to help farmers grow more with less.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">See MavunoAI in Action</h2>
              <div className="aspect-video bg-card rounded-lg border shadow-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Satellite className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Demo video coming soon</p>
                  <Link href="/farmsim">
                    <Button>Try FarmSim Game Instead</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
