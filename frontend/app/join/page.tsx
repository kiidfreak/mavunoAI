"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center justify-center space-x-4 mb-12">
    <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-primary' : 'border-gray-400'}`}>
        1
      </div>
      <span className="font-semibold">Phone Number</span>
    </div>
    <div className={`h-px w-16 ${currentStep > 1 ? 'bg-primary' : 'bg-gray-300'}`}></div>
    <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-primary' : 'border-gray-400'}`}>
        2
      </div>
      <span className="font-semibold">Farm Location</span>
    </div>
  </div>
);

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call to check/create user
    await new Promise(resolve => setTimeout(resolve, 1000));
    localStorage.setItem('farmerPhone', phone);
    // In a real app, you'd get a response and maybe show a message
    // alert('New account created!');
    setIsLoading(false);
    setStep(2);
  };

  const handleLocationSubmit = async () => {
    setIsLoading(true);
    // Simulate getting location and saving it
    await new Promise(resolve => setTimeout(resolve, 1500));
    // For demo, we assume location is fetched and stored
    router.push('/credit');
  };
  
  const handleAutoLocation = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, you'd save these coords
        console.log(position.coords.latitude, position.coords.longitude);
        handleLocationSubmit();
      },
      (error) => {
        console.error("Error getting location: ", error);
        alert("Could not get your location. Please enter it manually.");
        setIsLoading(false);
      }
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">Join MavunoAI</h1>
        <p className="text-center text-gray-600 mb-8">Just two quick steps to get started.</p>
        
        <StepIndicator currentStep={step} />

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          {step === 1 && (
            <form onSubmit={handlePhoneSubmit}>
              <h2 className="text-xl font-semibold mb-1">Enter Your Phone Number</h2>
              <p className="text-gray-500 mb-6">We'll use this to set up your account.</p>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  type="tel" 
                  placeholder="+254 712 345 678"
                  className="pl-10 h-12 text-lg"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full mt-6 h-12 text-lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Continue'}
                {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>
            </form>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-1">What's Your Farm's Location?</h2>
              <p className="text-gray-500 mb-6">This helps us get accurate satellite data.</p>
              <Button onClick={handleAutoLocation} className="w-full h-12 text-lg mb-4" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Use My Current Location'}
                {!isLoading && <Zap className="ml-2 w-5 h-5" />}
              </Button>
              <div className="text-center text-sm text-gray-500">or enter manually</div>
              {/* Manual input form can be added here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
