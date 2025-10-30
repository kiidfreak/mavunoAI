"use client";

import { Star, TrendingUp, Zap } from "lucide-react";

const Step = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: string }) => (
  <div className={`flex items-start space-x-6 animate-fade-in-up ${delay}`}>
    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 bg-blue-100 text-blue-600 rounded-full">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  </div>
);

export const CreditScoringSection = () => {
  return (
    <section id="credit-scoring" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Visual */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
            <div className="relative text-center">
              <div className="inline-block p-8 bg-white border rounded-full shadow-xl">
                <Star className="w-24 h-24 text-blue-500" />
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-700">Unlock Your Financial Future</p>
            </div>
          </div>

          {/* Right Column: Steps */}
          <div>
            <h2 className="text-4xl font-bold tracking-tighter text-gray-900">From Farm Data to Financial Identity</h2>
            <p className="text-lg text-gray-600 mt-3">Our AI-powered process is simple, fair, and fast.</p>
            <div className="mt-10 space-y-8">
              <Step
                icon={<Zap size={28} />} 
                title="1. Instant Scoring"
                description="Get a credit score in minutes on any phone. Just dial a USSD code or use our app."
                delay="animation-delay-200"
              />
              <Step
                icon={<TrendingUp size={28} />}
                title="2. Dynamic & Fair"
                description="Your score is based on real-time satellite data, rewarding sustainable farming."
                delay="animation-delay-400"
              />
              <Step
                icon={<Star size={28} />}
                title="3. Access Capital"
                description="A good score unlocks pre-approved loans and access to our exclusive rewards program."
                delay="animation-delay-600"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
