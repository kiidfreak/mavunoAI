"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Droplets, 
  Cloud, 
  Leaf, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Star,
  Award,
  Phone,
  MapPin,
  Sprout,
  Sun,
  Moon,
  RefreshCw,
  Gift
} from "lucide-react";

const DEFAULT_FARMER_PHONE = "+254700000000";
const DEFAULT_FARMER_NAME = "Mwangi Wainaina";

export default function FarmerDashboard() {
  const [creditData, setCreditData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [farmerPhone, setFarmerPhone] = useState("");
  const [language, setLanguage] = useState("english");
  const [savedLocation, setSavedLocation] = useState<string | null>(null);
  const [latestAnalysis, setLatestAnalysis] = useState<any>(null);

  useEffect(() => {
    // Get farmer phone from localStorage
    const phone = localStorage.getItem('farmerPhone') || DEFAULT_FARMER_PHONE;
    setFarmerPhone(phone);

    const persistedLocation = localStorage.getItem('farmerLocation');
    if (persistedLocation) {
      setSavedLocation(persistedLocation);
    }
    
    // Fetch dashboard data
    fetchCreditScore(phone);
    fetchLatestAnalysis(phone);
  }, []);

  const fetchCreditScore = async (phone: string) => {
    setLoading(true);
    
    // Use mock data for a rich demo experience
    setCreditData(getMockData(phone));
    
    // Simulate a network request for realism
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);

    // Refresh latest analysis summary for dashboard widgets
    fetchLatestAnalysis(phone);
    
    // Optional: Try to fetch from API in the background to keep it warm,
    // but we won't use the result for the main display.
    fetch(
      `http://localhost:8000/api/v1/credit/dashboard/${phone.replace('+', '')}?latitude=-0.34&longitude=36.12&crop_type=onion`
    ).catch(err => console.log("Background API fetch failed, using mock data as intended."));
  };

  const fetchLatestAnalysis = async (phone: string) => {
    const lookup = phone.startsWith('+') ? phone.substring(1) : phone;
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/ussd/latest?phone_number=${lookup}`
      );
      if (res.ok) {
        const data = await res.json();
        setLatestAnalysis(data);
      }
    } catch (error) {
      console.log("Failed to fetch latest USSD analysis", error);
    }
  };

  const getMockData = (phone: string) => {
    const profiles: Record<string, { name: string; location: string; size_acres: number; crop: string }> = {
      '+254712345678': { name: 'Mary Wanjiru', location: 'Nakuru', size_acres: 2.0, crop: 'Onions' },
      '+254723456789': { name: 'John Kamau', location: 'Machakos', size_acres: 1.5, crop: 'Maize' },
      '+254734567890': { name: 'Grace Njeri', location: 'Kiambu', size_acres: 1.2, crop: 'Bees (Honey)' },
      '+254115568694': { name: 'Mwangi Doe', location: 'Loresho KARLO', size_acres: 1.8, crop: 'Beans' },
      [DEFAULT_FARMER_PHONE]: { name: DEFAULT_FARMER_NAME, location: 'Gatundu, Kiambu', size_acres: 1.6, crop: 'Maize' },
    };

    const profile = profiles[phone] || profiles[DEFAULT_FARMER_PHONE];
    const agrovetPartner = `Mavuno ${profile.location} Agrovet`;

    return {
      user: {
        name: profile.name,
        location: profile.location,
        agrovetPartner,
      },
      farm: {
        location: profile.location,
        size_acres: profile.size_acres,
        crop: profile.crop,
      },
      credit: {
        score: 0.82,
        risk_level: "Low Risk",
        top_factors: [
          { name: "NDVI Trend", impact: 0.12 },
          { name: "M-Pesa Activity", impact: 0.08 },
          { name: "Soil Moisture", impact: 0.06 }
        ]
      },
      satellite_insights: {
        soil_moisture: 0.28,
        rainfall_30d: 145,
        ndvi_mean: 0.62,
        ndvi_trend: "↑ Healthy",
        drought_risk: "Low"
      },
      loan_offer: {
        approved: true,
        amount_ksh: 50000,
        interest_rate: 8.0,
        term_months: 6,
        monthly_payment: 8800
      },
      yield_estimate: {
        tonnes: 1.8,
        confidence: "85%"
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">🛰️ Checking NASA Satellites...</p>
        </div>
      </div>
    );
  }


  const toTitleCase = (value?: string | null) => {
    if (!value) return undefined;
    return value
      .toLowerCase()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const score = creditData?.credit?.score || 0;
  const scorePercent = Math.round(score * 100);
  const isApproved = creditData?.loan_offer?.approved;
  const farmProfileLocation = creditData?.farm?.location || creditData?.user?.location;
  const locationFromAnalysis = latestAnalysis?.location;
  const rawLocation = savedLocation || locationFromAnalysis || farmProfileLocation || "Your County";
  const formattedLocation = toTitleCase(rawLocation) || "Your County";
  const agrovetPartner = `Mavuno ${formattedLocation} Agrovet`;
  const farmSize = creditData?.farm?.size_acres;
  const cropDisplay = latestAnalysis?.crop_display || creditData?.farm?.crop;
  const displayName = latestAnalysis?.farmer_name || creditData?.user?.name || DEFAULT_FARMER_NAME;
  const shortName = displayName.split(' ')[0] || displayName;

  const progressMilestones = [
    {
      title: "USSD Logins",
      current: 10,
      total: 15,
      barColor: "bg-green-500",
      accent: "text-green-600",
      footer: latestAnalysis
        ? `Last score ${latestAnalysis.score?.toFixed?.(2) ?? latestAnalysis.score} (${latestAnalysis.risk}) • ${latestAnalysis.timestamp ? new Date(latestAnalysis.timestamp).toLocaleTimeString() : "just now"}`
        : "Run a fresh USSD session to update your score.",
    },
    {
      title: "Training Sessions",
      current: 3,
      total: 5,
      barColor: "bg-blue-500",
      accent: "text-blue-600",
    },
    {
      title: "On-time Payments",
      current: 2,
      total: 2,
      barColor: "bg-purple-500",
      accent: "text-purple-600",
      reward: {
        headline: "Well done! You're eligible for a reward.",
        couponCode: "FARM50",
        partner: agrovetPartner,
        callout: "Show the code at checkout to redeem a KSh 1,000 fertilizer voucher.",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {shortName || 'Farmer'}!</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  {new Date().getHours() < 18 ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-gray-500" />}
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ToggleGroup
                type="single"
                value={language}
                onValueChange={(value) => value && setLanguage(value)}
                className="bg-gray-100 rounded-xl p-1 text-sm"
              >
                <ToggleGroupItem value="english" className="px-3 py-1 rounded-lg data-[state=on]:bg-green-600 data-[state=on]:text-white">
                  English
                </ToggleGroupItem>
                <ToggleGroupItem value="swahili" className="px-3 py-1 rounded-lg data-[state=on]:bg-green-600 data-[state=on]:text-white">
                  Kiswahili
                </ToggleGroupItem>
                <ToggleGroupItem value="kikuyu" className="px-3 py-1 rounded-lg data-[state=on]:bg-green-600 data-[state=on]:text-white">
                  Kikuyu
                </ToggleGroupItem>
              </ToggleGroup>
              <Button 
                onClick={() => fetchCreditScore(farmerPhone)}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 text-base rounded-xl flex items-center gap-2 transition-transform duration-200 hover:scale-105"
                disabled={loading}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh Score'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PANEL: Farm Health */}
        <div className="space-y-6">
          <Card className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-600" />
              Your Farm
            </h2>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-green-700 bg-green-100/60 border border-green-200 rounded-full">
                <MapPin className="w-4 h-4" />
                <span>{formattedLocation}</span>
              </div>
              {farmSize && (
                <Button variant="outline" size="sm" className="rounded-full border-green-200 text-green-700 bg-white">
                  Farm Size: {farmSize} acres
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-6">
              Tip: include your ward & village for the most precise satellite insights on your farm.
            </p>

            {/* Soil Moisture - Visual Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Droplets className="w-8 h-8 text-blue-500" />
                  <span className="text-lg font-semibold">Soil Water</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {Math.round((creditData?.satellite_insights?.soil_moisture || 0.28) * 100)}%
                </span>
              </div>
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${Math.round((creditData?.satellite_insights?.soil_moisture || 0.28) * 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">💧 Good moisture level</p>
            </div>

            {/* Rainfall - Visual */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cloud className="w-8 h-8 text-blue-400" />
                  <span className="text-lg font-semibold">Rain (30 days)</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {creditData?.satellite_insights?.rainfall_30d || 145} mm
                </span>
              </div>
              <div className="grid grid-cols-10 gap-1">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i}
                    className={`h-12 rounded ${
                      i < Math.floor((creditData?.satellite_insights?.rainfall_30d || 145) / 20) 
                        ? 'bg-blue-500' 
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">🌧️ Enough rain for crops</p>
            </div>

            {/* Plant Health - NDVI */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Leaf className="w-8 h-8 text-green-500" />
                  <span className="text-lg font-semibold">Plant Health</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {creditData?.satellite_insights?.ndvi_trend || "↑ Healthy"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-6 bg-gradient-to-r from-yellow-300 via-green-400 to-green-600 rounded-full" />
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600 mt-2">🌱 Plants growing well</p>
            </div>

            {/* Yield Estimate */}
            <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expected Harvest</p>
                  <p className="text-3xl font-bold text-green-700">
                    {creditData?.yield_estimate?.tonnes || 1.8} tonnes
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Based on {farmSize || 'your'} acres of {cropDisplay || 'mixed crops'}
                  </p>
                </div>
                <div className="text-5xl">🌾</div>
              </div>
            </div>
          </Card>
        </div>

        {/* CENTER PANEL: Credit Score */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">Your Credit Score</h2>
            
            {/* Big Score Circle */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="white"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - score)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl font-bold">{scorePercent}</div>
                <div className="text-sm opacity-90">out of 100</div>
              </div>
            </div>

            {/* Risk Badge */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                {score >= 0.75 ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
                <span className="text-xl font-semibold">
                  {creditData?.credit?.risk_level || "Low Risk"}
                </span>
              </div>
            </div>

            {/* Top Factors - Simple Icons */}
            <div className="space-y-3">
              <p className="text-sm opacity-90 text-center">What helps your score:</p>
              {creditData?.credit?.top_factors?.slice(0, 3).map((factor: any, i: number) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    {i === 0 && <Leaf className="w-5 h-5" />}
                    {i === 1 && <Phone className="w-5 h-5" />}
                    {i === 2 && <Droplets className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{factor.name}</p>
                  </div>
                  <div className="text-2xl font-bold">
                    {factor.impact > 0 ? '+' : ''}{Math.round(factor.impact * 100)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Loan Offer */}
          {isApproved ? (
            <Card className="bg-white rounded-3xl shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-600">✅ Approved!</h3>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-4">
                <p className="text-sm text-gray-600 text-center mb-2">You can borrow</p>
                <p className="text-5xl font-bold text-center text-green-700 mb-2">
                  {(creditData?.loan_offer?.amount_ksh || 50000).toLocaleString()}
                  <span className="text-2xl"> KSh</span>
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Interest</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {creditData?.loan_offer?.interest_rate || 8}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {creditData?.loan_offer?.term_months || 6} months
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-xl rounded-2xl">
                💰 Get Loan Now
              </Button>
            </Card>
          ) : (
            <Card className="bg-white rounded-3xl shadow-lg p-6">
              <div className="text-center">
                <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Not Approved Yet</h3>
                <p className="text-gray-600">Complete training to improve your score</p>
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT PANEL: Rewards & Progress */}
        <div className="space-y-6">
          <Card className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Your Level
            </h2>

            {/* Level Badge */}
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">⭐</div>
              <h3 className="text-3xl font-bold text-yellow-600 mb-2">Silver Farmer</h3>
              <p className="text-gray-600">2 more loans to reach Gold</p>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
              {progressMilestones.map((milestone) => {
                const progressPercent = milestone.total
                  ? Math.min(100, Math.round((milestone.current / milestone.total) * 100))
                  : 0;
                const isComplete = milestone.current >= milestone.total;

                return (
                  <div key={milestone.title} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">{milestone.title}</span>
                      <span className={`text-sm font-bold ${milestone.accent}`}>
                        {milestone.current}/{milestone.total}
                      </span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${milestone.barColor} transition-all duration-500`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    {milestone.footer && (
                      <p className="text-xs text-gray-500">{milestone.footer}</p>
                    )}
                    {isComplete && milestone.reward && (
                      <div className="flex items-start gap-3 bg-purple-50 border border-purple-100 rounded-2xl px-3 py-3 text-xs text-gray-700">
                        <div className="mt-1">
                          <Gift className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-purple-700">{milestone.reward.headline}</p>
                          <p className="mt-1">
                            Use coupon
                            <span className="ml-1 font-mono text-sm text-purple-600 bg-white px-2 py-0.5 rounded-md shadow-sm">
                              {milestone.reward.couponCode}
                            </span>
                            at {milestone.reward.partner}.
                          </p>
                          <p className="mt-1 text-gray-600">{milestone.reward.callout}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <div className="text-3xl">✅</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Repayment completed</p>
                  <p className="text-xs text-gray-600">+50 points</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <div className="text-3xl">🌧️</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Rain detected</p>
                  <p className="text-xs text-gray-600">+10 points</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                <div className="text-3xl">🎁</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Referred farmer</p>
                  <p className="text-xs text-gray-600">+20 points</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-4">💡 Improve Your Score</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-2xl">📱</span>
                <span>Use USSD regularly (+5 pts per check)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl">🤝</span>
                <span>Join a cooperative (+10% boost)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl">💳</span>
                <span>Keep M-Pesa active</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
