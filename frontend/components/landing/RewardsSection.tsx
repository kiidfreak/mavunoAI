"use client";

import { Award, Gift, Users } from "lucide-react";

const RewardCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: string }) => (
  <div className={`p-8 bg-white border border-gray-200 rounded-2xl shadow-sm transition-transform duration-300 hover:-translate-y-2 animate-fade-in-up ${delay}`}>
    <div className="mx-auto flex items-center justify-center w-14 h-14 bg-yellow-100 text-yellow-600 rounded-full mb-5">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

export const RewardsSection = () => {
  return (
    <section id="rewards" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tighter text-gray-900">Good Farming Pays Off</h2>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">Our platform rewards you for sustainable practices and community engagement.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <RewardCard
            icon={<Gift size={28} />}
            title="M-Pesa Points"
            description="Earn points for smart farming and redeem them for inputs or real-world vouchers."
            delay="animation-delay-200"
          />
          <RewardCard
            icon={<Users size={28} />}
            title="Farmer Cooperatives"
            description="Join forces with other farmers to access collective bargaining power and shared resources."
            delay="animation-delay-400"
          />
          <RewardCard
            icon={<Award size={28} />}
            title="County Competitions"
            description="Compete in friendly leaderboards, showcase your skills, and win recognition."
            delay="animation-delay-600"
          />
        </div>
      </div>
    </section>
  );
};
