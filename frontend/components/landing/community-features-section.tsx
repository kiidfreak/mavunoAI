"use client"

import { Users, MessageCircle, Trophy, MapPin, Heart, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CommunityFeaturesSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-sky-50 to-emerald-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🤝 Community Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with fellow farmers, share knowledge, and compete in friendly county competitions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Farmer Network */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-sky-600" />
              </div>
              <CardTitle className="text-xl">Farmer Network</CardTitle>
              <CardDescription>
                Share successful strategies, warn about pest outbreaks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-sky-500 rounded-full mr-3"></span>
                  Real-time pest alerts
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-sky-500 rounded-full mr-3"></span>
                  Success story sharing
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-sky-500 rounded-full mr-3"></span>
                  Local weather updates
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mentor Matching */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-emerald-600" />
              </div>
              <CardTitle className="text-xl">Mentor Matching</CardTitle>
              <CardDescription>
                Experienced players guide newcomers through challenging seasons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  AI-powered matching
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Complementary skills
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Earn points for mentoring
                </div>
              </div>
            </CardContent>
          </Card>

          {/* County Competitions */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-amber-600" />
              </div>
              <CardTitle className="text-xl">County Competitions</CardTitle>
              <CardDescription>
                Leaderboards by region foster friendly rivalry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                  Machakos vs Kiambu
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                  Monthly challenges
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                  County pride rewards
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cooperative Mode */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Cooperative Mode</CardTitle>
              <CardDescription>
                Join shamba groups managing collective fields
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Shared field management
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Collective decision making
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Resource pooling
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Community Stats */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Live Community Stats</h3>
            <p className="text-gray-600">
              Join thousands of farmers already using MavunoAI
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">2,450</div>
              <div className="text-sm text-gray-600">Mavuno Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-sky-600 mb-2">72</div>
              <div className="text-sm text-gray-600">Active Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">15</div>
              <div className="text-sm text-gray-600">Cooperatives</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">91%</div>
              <div className="text-sm text-gray-600">Sustainability Score</div>
            </div>
          </div>
        </div>

        {/* County Leaderboard Preview */}
        <div className="bg-gradient-to-r from-emerald-500 to-sky-500 rounded-2xl shadow-xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">🏆 County Leaderboard</h3>
            <p className="text-emerald-100">
              Current month competition
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">🥇 Machakos</div>
              <div className="text-lg">87.5% avg score</div>
              <div className="text-sm text-emerald-200">25 farmers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">🥈 Kiambu</div>
              <div className="text-lg">84.2% avg score</div>
              <div className="text-sm text-emerald-200">18 farmers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">🥉 Kajiado</div>
              <div className="text-lg">81.7% avg score</div>
              <div className="text-sm text-emerald-200">12 farmers</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3">
            Join the Community
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
