"use client";

import { Droplets, Leaf, Sun } from "lucide-react";

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: string }) => (
  <div className={`p-8 bg-white border border-gray-200 rounded-2xl shadow-sm transition-transform duration-300 hover:-translate-y-2 animate-fade-in-up ${delay}`}>
    <div className="mx-auto flex items-center justify-center w-14 h-14 bg-green-100 text-green-600 rounded-full mb-5">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

export const FarmDataSection = () => {
  return (
    <section id="farm-data" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tighter text-gray-900">Your Farm, Seen From Space</h2>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">We transform complex satellite imagery into simple, powerful insights for your farm.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Droplets size={28} />}
            title="Soil Moisture"
            description="Prevent water stress with precise irrigation guidance from NASA's SMAP satellite data."
            delay="animation-delay-200"
          />
          <FeatureCard
            icon={<Leaf size={28} />}
            title="Crop Health"
            description="Monitor plant health with NDVI imagery to detect stress early and protect your yield."
            delay="animation-delay-400"
          />
          <FeatureCard
            icon={<Sun size={28} />}
            title="Smart Forecasts"
            description="Plan activities with confidence using hyperlocal weather forecasts powered by NASA data."
            delay="animation-delay-600"
          />
        </div>
      </div>
    </section>
  );
};
