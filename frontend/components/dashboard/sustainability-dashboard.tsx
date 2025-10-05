"use client";

import { useState, useEffect } from 'react';
import { Trophy, Leaf, TrendingUp, Award, Activity, MapPin, Calendar, Star, Target, Zap, Shield, Users, BarChart3, Globe, Clock, CheckCircle, AlertCircle, Info, ExternalLink, MessageSquare, Phone } from 'lucide-react';

interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  location: string;
  language: string;
  mavunoPoints: number;
  level: string;
  sustainabilityScore: number;
  farms: Farm[];
  achievements: Achievement[];
  recentActivity: Activity[];
}

interface Farm {
  id: string;
  name: string;
  location: string;
  size: number;
  crop: string;
  sustainabilityMetrics: SustainabilityMetrics;
  nasaData: NASAData;
  lastUpdated: string;
}

interface SustainabilityMetrics {
  waterEfficiency: number;
  carbonFootprint: number;
  soilHealth: number;
  biodiversity: number;
  economicImpact: number;
  socialImpact: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  earnedDate: string;
  category: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  points: number;
  timestamp: string;
}

interface NASAData {
  smap: {
    soil_moisture: number;
    confidence: number;
    last_updated: string;
  };
  chirps: {
    rainfall_7day: number;
    rainfall_forecast: number;
    confidence: number;
  };
  modis: {
    ndvi: number;
    temperature: number;
    vegetation_health: string;
  };
  landsat: {
    crop_health: number;
    stress_indicators: string[];
  };
}

export function SustainabilityDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sustainability' | 'achievements' | 'rewards'>('overview');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);

  useEffect(() => {
    // Only run on client side to prevent hydration issues
    if (typeof window === 'undefined') return;
    
    // Get farmer profile from localStorage
    const storedProfile = localStorage.getItem('farmerProfile');
    console.log('Stored profile:', storedProfile);
    
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      console.log('Parsed profile:', profile);
      // Create full farmer profile with mock data
      const fullProfile: FarmerProfile = {
        id: 'farmer_1',
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        language: profile.language,
        mavunoPoints: profile.phone === '+254111548797' ? 1890 : 2450,
        level: profile.phone === '+254111548797' ? 'Eco Beekeeper' : 'Sustainable Pioneer',
        sustainabilityScore: profile.phone === '+254111548797' ? 91 : 87,
        farms: profile.phone === '+254111548797' ? [
          {
            id: 'farm_3',
            name: 'Test2 Main Apiary',
            location: 'Loresho KARLO',
            size: 5.0,
            crop: 'honey',
            sustainabilityMetrics: {
              waterEfficiency: 100,
              carbonFootprint: 5,
              soilHealth: 95,
              biodiversity: 98,
              economicImpact: 92,
              socialImpact: 88
            },
            nasaData: {
              smap: { soil_moisture: 58, confidence: 88, last_updated: '2025-10-05T04:30:00Z' },
              chirps: { rainfall_7day: 15, rainfall_forecast: 22, confidence: 90 },
              modis: { ndvi: 0.75, temperature: 26, vegetation_health: 'excellent' },
              landsat: { crop_health: 96, stress_indicators: [] }
            },
            lastUpdated: '2025-10-05T04:30:00Z'
          }
        ] : [
          {
            id: 'farm_1',
            name: 'Mwangi Onion Farm',
            location: 'Nairobi',
            size: 2.5,
            crop: 'onions',
            sustainabilityMetrics: {
              waterEfficiency: 85,
              carbonFootprint: 12,
              soilHealth: 78,
              biodiversity: 65,
              economicImpact: 88,
              socialImpact: 82
            },
            nasaData: {
              smap: { soil_moisture: 45, confidence: 85, last_updated: '2025-10-05T04:30:00Z' },
              chirps: { rainfall_7day: 8, rainfall_forecast: 15, confidence: 80 },
              modis: { ndvi: 0.68, temperature: 24, vegetation_health: 'excellent' },
              landsat: { crop_health: 89, stress_indicators: [] }
            },
            lastUpdated: '2025-10-05T04:30:00Z'
          },
          {
            id: 'farm_2',
            name: 'Mwangi Onion Nursery',
            location: 'Nairobi',
            size: 0.5,
            crop: 'onions',
            sustainabilityMetrics: {
              waterEfficiency: 90,
              carbonFootprint: 8,
              soilHealth: 85,
              biodiversity: 70,
              economicImpact: 85,
              socialImpact: 80
            },
            nasaData: {
              smap: { soil_moisture: 72, confidence: 95, last_updated: '2025-10-05T04:30:00Z' },
              chirps: { rainfall_7day: 12, rainfall_forecast: 18, confidence: 85 },
              modis: { ndvi: 0.72, temperature: 24, vegetation_health: 'excellent' },
              landsat: { crop_health: 94, stress_indicators: [] }
            },
            lastUpdated: '2025-10-05T04:30:00Z'
          }
        ],
        achievements: [
          {
            id: 'water_warrior',
            title: 'Water Warrior',
            description: 'Achieved 90%+ water efficiency for 3 consecutive months',
            points: 500,
            earnedDate: '2025-09-15',
            category: 'sustainability'
          },
          {
            id: 'data_driven',
            title: 'Data-Driven Farmer',
            description: 'Used NASA satellite data for 30+ farming decisions',
            points: 300,
            earnedDate: '2025-09-20',
            category: 'innovation'
          }
        ],
        recentActivity: [
          {
            id: 'activity_1',
            type: 'sustainability',
            description: 'Implemented drip irrigation system',
            points: 100,
            timestamp: '2025-10-04T10:30:00Z'
          },
          {
            id: 'activity_2',
            type: 'data_usage',
            description: 'Analyzed SMAP soil moisture data',
            points: 50,
            timestamp: '2025-10-03T14:20:00Z'
          }
        ]
      };
      setFarmerProfile(fullProfile);
    } else {
      // Create default profile if none exists
      console.log('No stored profile found, creating default');
      const defaultProfile: FarmerProfile = {
        id: 'farmer_default',
        name: 'Test Farmer',
        phone: '+254115568694',
        location: 'Nairobi County',
        language: 'en',
        mavunoPoints: 2450,
        level: 'Sustainable Pioneer',
        sustainabilityScore: 87,
        farms: [
          {
            id: 'farm_1',
            name: 'Mwangi Onion Farm',
            location: 'Nairobi',
            size: 2.5,
            crop: 'onions',
            sustainabilityMetrics: {
              waterEfficiency: 85,
              carbonFootprint: 12,
              soilHealth: 78,
              biodiversity: 65,
              economicImpact: 88,
              socialImpact: 82
            },
            nasaData: {
              smap: { soil_moisture: 45, confidence: 85, last_updated: '2025-10-05T04:30:00Z' },
              chirps: { rainfall_7day: 8, rainfall_forecast: 15, confidence: 80 },
              modis: { ndvi: 0.68, temperature: 24, vegetation_health: 'excellent' },
              landsat: { crop_health: 89, stress_indicators: [] }
            },
            lastUpdated: '2025-10-05T04:30:00Z'
          }
        ],
        achievements: [
          {
            id: 'water_warrior',
            title: 'Water Warrior',
            description: 'Achieved 90%+ water efficiency for 3 consecutive months',
            points: 500,
            earnedDate: '2025-09-15',
            category: 'sustainability'
          }
        ],
        recentActivity: [
          {
            id: 'activity_1',
            type: 'sustainability',
            description: 'Implemented drip irrigation system',
            points: 100,
            timestamp: '2025-10-04T10:30:00Z'
          }
        ]
      };
      setFarmerProfile(defaultProfile);
    }
  }, []);

  const getLevelColor = (level: string) => {
    if (level.includes('Pioneer')) return 'text-purple-600 bg-purple-100';
    if (level.includes('Eco')) return 'text-green-600 bg-green-100';
    if (level.includes('Master')) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getKikuyuText = (key: string) => {
    const translations: { [key: string]: string } = {
      'sustainable_farming_dashboard': 'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ Gĩa Mũgũnda',
      'mavuno_points': 'Mavuno Points',
      'sustainability_score': 'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ',
      'your_farms': 'Mĩgũnda Yaku',
      'available_rewards': 'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ',
      'organic_seeds': 'Mbeũ cia Gũthũngũrũrũ',
      'weather_station': 'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ',
      'farming_course': 'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ',
      'how_to_earn': 'Gũthũngũrũrũ Gĩa Gũthũngũrũrũ',
      'next_level': 'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ',
      'whatsapp_integration': 'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ',
      'connect_whatsapp': 'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ',
      'sms_setup': 'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ'
    };
    return translations[key] || key;
  };

  const getSustainabilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  if (!farmerProfile) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading farmer profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🌱 {farmerProfile.name}'s Sustainable Farming Dashboard
            </h2>
            <p className="text-gray-600">
              {farmerProfile.location} • {farmerProfile.language === 'en' ? 'English' : 
               farmerProfile.language === 'sw' ? 'Swahili' : 'Kikuyu'}
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {farmerProfile.mavunoPoints.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Mavuno Points</div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getLevelColor(farmerProfile.level)}`}>
              {farmerProfile.level}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <nav className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'sustainability', label: 'Sustainability', icon: Leaf },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'rewards', label: 'Rewards', icon: Award }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sustainability Score */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🌱 Sustainability Score</h3>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getSustainabilityColor(farmerProfile.sustainabilityScore)}`}>
                  {farmerProfile.sustainabilityScore}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${farmerProfile.sustainabilityScore}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {farmerProfile.sustainabilityScore >= 90 ? 'Excellent!' : 
                   farmerProfile.sustainabilityScore >= 80 ? 'Great job!' : 
                   farmerProfile.sustainabilityScore >= 70 ? 'Good progress!' : 'Keep improving!'}
                </p>
              </div>
            </div>
          </div>

          {/* Farms Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">🏡 Your Farms</h3>
              <div className="space-y-4">
                {farmerProfile.farms.map((farm) => (
                  <div key={farm.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{farm.name}</h4>
                        <p className="text-sm text-gray-600">{farm.location} • {farm.size} acres</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">
                          {farm.sustainabilityMetrics.waterEfficiency}% Water Efficiency
                        </div>
                        <div className="text-xs text-gray-500">
                          {farm.crop === 'honey' ? '🐝 Apiary' : '🧅 Onions'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Carbon Footprint:</span>
                        <span className="font-semibold ml-2">{farm.sustainabilityMetrics.carbonFootprint} kg CO₂</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Soil Health:</span>
                        <span className="font-semibold ml-2">{farm.sustainabilityMetrics.soilHealth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">🎁 Available Rewards</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900">🌱 Organic Seeds Package</h4>
                    <span className="text-sm font-bold text-green-600">500 pts</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">High-quality organic seeds for sustainable farming</p>
                  <button 
                    onClick={() => alert('Reward redemption coming soon!')}
                    disabled={farmerProfile.mavunoPoints < 500}
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {farmerProfile.mavunoPoints >= 500 ? 'Redeem' : 'Not enough points'}
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900">📱 Premium Weather Station</h4>
                    <span className="text-sm font-bold text-green-600">1000 pts</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Advanced weather monitoring equipment</p>
                  <button 
                    onClick={() => alert('Reward redemption coming soon!')}
                    disabled={farmerProfile.mavunoPoints < 1000}
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {farmerProfile.mavunoPoints >= 1000 ? 'Redeem' : 'Not enough points'}
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900">🎓 Sustainable Farming Course</h4>
                    <span className="text-sm font-bold text-green-600">750 pts</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Online course on advanced sustainable farming techniques</p>
                  <button 
                    onClick={() => alert('Reward redemption coming soon!')}
                    disabled={farmerProfile.mavunoPoints < 750}
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {farmerProfile.mavunoPoints >= 750 ? 'Redeem' : 'Not enough points'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">💎 Your Mavuno Points</h3>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {farmerProfile.mavunoPoints.toLocaleString()}
                </div>
                <p className="text-gray-600">Available Points</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">How to Earn Points</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Use NASA satellite data: +50 pts</li>
                    <li>• Implement sustainable practices: +100 pts</li>
                    <li>• Achieve water efficiency targets: +75 pts</li>
                    <li>• Maintain soil health: +50 pts</li>
                    <li>• Community knowledge sharing: +25 pts</li>
                  </ul>
                </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Next Level</h4>
                <p className="text-sm text-blue-700">
                  Earn {3000 - farmerProfile.mavunoPoints} more points to reach "Sustainable Master" level
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">📊 Daily Points Alert</h4>
                <p className="text-sm text-orange-700">
                  Max points today: 500 (You can earn {Math.max(0, 500 - farmerProfile.mavunoPoints)} more)
                </p>
                <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (farmerProfile.mavunoPoints / 500) * 100)}%` }}
                  ></div>
                </div>
              </div>
              </div>
            </div>
          </div>
          
          {/* WhatsApp Integration */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">📱 WhatsApp Integration</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Connect your WhatsApp for instant notifications</p>
                  <p className="text-xs text-gray-500">Get reward confirmations and farming tips</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-green-600">Ready</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => window.open(`https://wa.me/${farmerProfile?.phone?.replace('+', '')}?text=Hello%20MavunoAI!%20I%20want%20to%20connect%20my%20WhatsApp%20for%20farming%20notifications.`, '_blank')}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Connect WhatsApp
                </button>
                
                <button 
                  onClick={() => window.open(`sms:${farmerProfile?.phone}?body=Hello%20MavunoAI!%20I%20want%20to%20receive%20SMS%20notifications%20for%20my%20farming%20activities.`, '_self')}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  SMS Setup
                </button>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Get instant reward confirmations via WhatsApp</p>
                <p>• Receive farming tips and weather updates via SMS</p>
                <p>• Track your sustainability progress in real-time</p>
                <p>• Connect with the farming community</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
