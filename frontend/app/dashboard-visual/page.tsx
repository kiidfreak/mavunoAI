"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Droplets, 
  Cloud, 
  Leaf, 
  TrendingUp,
  Sun,
  Wind,
  Thermometer,
  AlertCircle,
  CheckCircle,
  Sprout,
  Phone,
  MapPin,
  Calendar,
  Award,
  Users,
  BookOpen,
  Lightbulb
} from "lucide-react";

export default function VisualDashboard() {
  const [farmerData, setFarmerData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [farmerPhone, setFarmerPhone] = useState("");

  useEffect(() => {
    const phone = localStorage.getItem('farmerPhone') || '+254712345678';
    const profile = localStorage.getItem('farmerProfile');
    
    setFarmerPhone(phone);
    
    if (profile) {
      try {
        setFarmerData(JSON.parse(profile));
      } catch (e) {
        setFarmerData(getMockFarmerData());
      }
    } else {
      setFarmerData(getMockFarmerData());
    }
    
    fetchWeatherData();
  }, []);

  const getMockFarmerData = () => ({
    name: 'Mary Wanjiru',
    phone: '+254712345678',
    location: 'Nakuru County',
    crop: 'Onion',
    farm_size: 2.0,
    level: 'Silver',
    points: 85
  });

  const fetchWeatherData = async () => {
    setLoading(true);
    
    // Mock weather data
    setWeatherData({
      temperature: 24,
      humidity: 68,
      rainfall_today: 12,
      rainfall_week: 45,
      wind_speed: 8,
      soil_moisture: 0.28,
      forecast: [
        { day: 'Today', icon: '🌤️', temp: 24, rain: 60 },
        { day: 'Tomorrow', icon: '🌧️', temp: 22, rain: 80 },
        { day: 'Friday', icon: '⛅', temp: 25, rain: 40 },
        { day: 'Saturday', icon: '☀️', temp: 27, rain: 20 }
      ]
    });
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">🌱 Loading your farm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Hello, {farmerData?.name || 'Farmer'}! 👋
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {farmerData?.location || 'Nakuru County'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/credit">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-6 text-lg rounded-2xl">
                  💳 Credit Score
                </Button>
              </Link>
              <Button 
                onClick={() => fetchWeatherData()}
                variant="outline"
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-6 py-6 text-lg rounded-2xl"
              >
                🔄 Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PANEL: Weather & Farm Conditions */}
        <div className="space-y-6">
          {/* Today's Weather */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sun className="w-6 h-6" />
              Today's Weather
            </h2>
            
            <div className="text-center mb-6">
              <div className="text-7xl mb-2">☀️</div>
              <div className="text-6xl font-bold">{weatherData?.temperature || 24}°C</div>
              <p className="text-lg opacity-90 mt-2">Partly Cloudy</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Droplets className="w-5 h-5" />
                  <span className="text-sm">Humidity</span>
                </div>
                <p className="text-2xl font-bold">{weatherData?.humidity || 68}%</p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Wind className="w-5 h-5" />
                  <span className="text-sm">Wind</span>
                </div>
                <p className="text-2xl font-bold">{weatherData?.wind_speed || 8} km/h</p>
              </div>
            </div>
          </Card>

          {/* Soil Conditions */}
          <Card className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-600" />
              Soil Conditions
            </h2>

            {/* Soil Moisture */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Droplets className="w-8 h-8 text-blue-500" />
                  <span className="text-lg font-semibold">Soil Moisture</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {Math.round((weatherData?.soil_moisture || 0.28) * 100)}%
                </span>
              </div>
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${Math.round((weatherData?.soil_moisture || 0.28) * 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">💧 Optimal for {farmerData?.crop || 'crops'}</p>
            </div>

            {/* Temperature */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-8 h-8 text-orange-500" />
                  <span className="text-lg font-semibold">Soil Temp</span>
                </div>
                <span className="text-2xl font-bold text-orange-600">22°C</span>
              </div>
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600" style={{ width: '73%' }} />
              </div>
              <p className="text-sm text-gray-600 mt-2">🌡️ Good growing temperature</p>
            </div>

            {/* pH Level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-green-600">pH</span>
                  </div>
                  <span className="text-lg font-semibold">Soil pH</span>
                </div>
                <span className="text-2xl font-bold text-green-600">6.5</span>
              </div>
              <div className="h-6 bg-gradient-to-r from-red-300 via-green-400 to-blue-300 rounded-full" />
              <p className="text-sm text-gray-600 mt-2">✅ Perfect for vegetables</p>
            </div>
          </Card>

          {/* 4-Day Forecast */}
          <Card className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">📅 4-Day Forecast</h2>
            <div className="space-y-3">
              {weatherData?.forecast?.map((day: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{day.icon}</div>
                    <div>
                      <p className="font-semibold">{day.day}</p>
                      <p className="text-sm text-gray-600">{day.rain}% rain</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{day.temp}°C</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CENTER PANEL: Farm Overview & Actions */}
        <div className="space-y-6">
          {/* Farm Stats */}
          <Card className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">🌾 Your Farm</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-2xl p-4 text-center">
                <div className="text-4xl mb-2">🧅</div>
                <p className="text-sm text-gray-600">Crop</p>
                <p className="text-xl font-bold text-gray-900">{farmerData?.crop || 'Onion'}</p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4 text-center">
                <div className="text-4xl mb-2">📏</div>
                <p className="text-sm text-gray-600">Farm Size</p>
                <p className="text-xl font-bold text-gray-900">{farmerData?.farm_size || 2.0} acres</p>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-4 text-center">
                <div className="text-4xl mb-2">🌱</div>
                <p className="text-sm text-gray-600">Growth Stage</p>
                <p className="text-xl font-bold text-gray-900">Flowering</p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 text-center">
                <div className="text-4xl mb-2">📅</div>
                <p className="text-sm text-gray-600">Harvest In</p>
                <p className="text-xl font-bold text-gray-900">45 days</p>
              </div>
            </div>

            {/* Expected Yield */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expected Harvest</p>
                  <p className="text-4xl font-bold text-green-700">1.8 tonnes</p>
                  <p className="text-sm text-gray-600 mt-1">Based on NASA data</p>
                </div>
                <div className="text-6xl">🌾</div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">⚡ Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 rounded-2xl p-4 transition-all hover:scale-105">
                <div className="text-4xl mb-2">💧</div>
                <p className="font-semibold text-gray-900">Water Now</p>
              </button>

              <button className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 rounded-2xl p-4 transition-all hover:scale-105">
                <div className="text-4xl mb-2">🌱</div>
                <p className="font-semibold text-gray-900">Fertilize</p>
              </button>

              <button className="bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 border-2 border-yellow-200 rounded-2xl p-4 transition-all hover:scale-105">
                <div className="text-4xl mb-2">🐛</div>
                <p className="font-semibold text-gray-900">Pest Control</p>
              </button>

              <button className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 rounded-2xl p-4 transition-all hover:scale-105">
                <div className="text-4xl mb-2">📊</div>
                <p className="font-semibold text-gray-900">View Report</p>
              </button>
            </div>
          </Card>

          {/* Alerts */}
          <Card className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              Alerts & Tips
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                <div className="text-2xl">🌧️</div>
                <div>
                  <p className="font-semibold text-sm">Rain Expected Tomorrow</p>
                  <p className="text-xs text-gray-600">80% chance - Delay watering</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border-l-4 border-green-500">
                <div className="text-2xl">✅</div>
                <div>
                  <p className="font-semibold text-sm">Soil Moisture Good</p>
                  <p className="text-xs text-gray-600">No action needed today</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
                <div className="text-2xl">🌱</div>
                <div>
                  <p className="font-semibold text-sm">Fertilizer Reminder</p>
                  <p className="text-xs text-gray-600">Apply nitrogen in 3 days</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL: Learning & Community */}
        <div className="space-y-6">
          {/* Farmer Level */}
          <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-6 h-6" />
              Your Level
            </h2>

            <div className="text-center mb-6">
              <div className="text-8xl mb-4">⭐</div>
              <h3 className="text-3xl font-bold mb-2">{farmerData?.level || 'Silver'} Farmer</h3>
              <p className="text-lg opacity-90">{farmerData?.points || 85} points</p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm mb-2">Progress to Gold</p>
              <div className="h-4 bg-white/30 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-white" style={{ width: '70%' }} />
              </div>
              <p className="text-xs">2 more loans to reach Gold</p>
            </div>
          </Card>

          {/* Learning Resources */}
          <Card className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Learn & Grow
            </h2>

            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-2xl border-2 border-blue-200 transition-all hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🎓</div>
                  <div className="flex-1">
                    <p className="font-semibold">Onion Farming 101</p>
                    <p className="text-xs text-gray-600">15 min video</p>
                  </div>
                  <div className="text-green-600 font-bold">+10 pts</div>
                </div>
              </button>

              <button className="w-full text-left p-4 bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 rounded-2xl border-2 border-green-200 transition-all hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">💧</div>
                  <div className="flex-1">
                    <p className="font-semibold">Water Management</p>
                    <p className="text-xs text-gray-600">10 min read</p>
                  </div>
                  <div className="text-green-600 font-bold">+10 pts</div>
                </div>
              </button>

              <button className="w-full text-left p-4 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 rounded-2xl border-2 border-yellow-200 transition-all hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🐛</div>
                  <div className="flex-1">
                    <p className="font-semibold">Pest Prevention</p>
                    <p className="text-xs text-gray-600">12 min video</p>
                  </div>
                  <div className="text-green-600 font-bold">+10 pts</div>
                </div>
              </button>
            </div>
          </Card>

          {/* Community */}
          <Card className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Community
            </h2>

            <div className="space-y-3">
              <div className="p-4 bg-purple-50 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-xl">
                    👨‍🌾
                  </div>
                  <div>
                    <p className="font-semibold text-sm">John Kamau</p>
                    <p className="text-xs text-gray-600">Machakos • Maize</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">"Just harvested 2.5 tonnes! The NASA data really helped with timing."</p>
              </div>

              <div className="p-4 bg-green-50 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-xl">
                    👩‍🌾
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Grace Njeri</p>
                    <p className="text-xs text-gray-600">Kiambu • Bees</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">"Got my loan approved in 2 hours! 🎉"</p>
              </div>
            </div>

            <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl">
              💬 Join Discussion
            </Button>
          </Card>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6" />
              Today's Tip
            </h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-lg font-semibold mb-2">🌧️ Rain Tomorrow!</p>
              <p className="text-sm opacity-90">
                Skip watering today. Let nature do the work and save water. Your soil moisture is already good at 28%.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
