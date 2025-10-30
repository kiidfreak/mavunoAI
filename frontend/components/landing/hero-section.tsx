"use client";

import { Button } from "@/components/ui/button"
import { Satellite, Droplets, Leaf, Star } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-white">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center min-h-screen pt-24 pb-12">
        {/* Left Column: Text Content */}
        <div className="z-10 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full">
            <Satellite className="w-4 h-4" />
            <span>Powered by NASA Satellite Data</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-gray-900 leading-tight">
            The Future of Farming is Here.
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-xl">
            MavunoAI uses satellite data to give you a credit score, unlock loans, and provide insights to increase your harvest. All on your phone.
          </p>
          <Link href="/join" className="mt-8">
            <Button size="lg" className="text-lg px-8 shadow-lg hover:shadow-xl transition-shadow">
              Start with us
            </Button>
          </Link>
        </div>

        {/* Right Column: Visual Element */}
        <div className="relative h-full flex items-center justify-center">
          <div className="absolute w-full h-full bg-green-200/30 rounded-full blur-3xl"></div>
          <div className="relative p-8 bg-white/60 backdrop-blur-md border rounded-full shadow-2xl">
            <Satellite className="w-32 h-32 text-green-600" />
          </div>
        </div>
      </div>
    </section>
  )
}
