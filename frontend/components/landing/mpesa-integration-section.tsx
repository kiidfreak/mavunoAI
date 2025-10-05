"use client"

import { Smartphone, CreditCard, Users, Trophy, Gift, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MpesaIntegrationSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 to-sky-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            💰 M-Pesa Integration
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Turn your farming success into real rewards through Kenya's most trusted payment system
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Virtual Marketplace */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-emerald-600" />
              </div>
              <CardTitle className="text-xl">Virtual Marketplace</CardTitle>
              <CardDescription>
                Sell harvests for M-Pesa points (virtual currency mirroring real money)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Convert 1 ton onions → 2,500 M-Pesa points
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Trade points with other farmers
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Real-time market prices
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Input Purchasing */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-sky-600" />
              </div>
              <CardTitle className="text-xl">Input Purchasing</CardTitle>
              <CardDescription>
                Buy seeds, fertilizer using earned M-Pesa points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-sky-500 rounded-full mr-3"></span>
                  Organic seeds: 500 points
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-sky-500 rounded-full mr-3"></span>
                  Fertilizer: 1,200 points
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-sky-500 rounded-full mr-3"></span>
                  Equipment: 3,000+ points
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cooperative Savings */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <CardTitle className="text-xl">Cooperative Savings</CardTitle>
              <CardDescription>
                Join virtual chamas pooling resources for collective purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                  Pool 10,000+ points for bulk discounts
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                  Shared equipment access
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                  Collective market bargaining
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-World Rewards */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Real-World Rewards</h3>
            <p className="text-gray-600">
              Top performers receive input vouchers redeemable via M-Pesa at partner agrovets
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">Top 10%</div>
              <div className="text-sm text-gray-600">Get KES 5,000 input vouchers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-600 mb-2">Top 25%</div>
              <div className="text-sm text-gray-600">Get KES 2,500 input vouchers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">Top 50%</div>
              <div className="text-sm text-gray-600">Get KES 1,000 input vouchers</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
            Start Earning M-Pesa Points
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
