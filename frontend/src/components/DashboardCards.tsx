"use client";

import { useState, useEffect } from 'react';

interface DashboardData {
  soilMoisture: {
    current: number;
    change: number;
    status: 'LOW' | 'FAIR' | 'GOOD';
  };
  cropHealth: {
    ndvi: number;
    change: number;
    status: 'POOR' | 'FAIR' | 'GOOD';
  };
  nextAction: {
    action: string;
    urgency: 'LOW' | 'MEDIUM' | 'URGENT';
    timeframe: string;
    confidence: number;
  };
  seasonImpact: {
    profit: number;
    percentage: number;
    projected: number;
  };
}

export default function DashboardCards() {
  const [data, setData] = useState<DashboardData>({
    soilMoisture: { current: 58, change: -12, status: 'LOW' },
    cropHealth: { current: 0.52, change: 6.65, status: 'FAIR' },
    nextAction: { 
      action: 'Irrigate', 
      urgency: 'URGENT', 
      timeframe: '24h', 
      confidence: 85 
    },
    seasonImpact: { 
      profit: 48000, 
      percentage: 60, 
      projected: 75 
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const simulateData = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate new realistic data
    const newData: DashboardData = {
      soilMoisture: {
        current: Math.floor(Math.random() * 30) + 45, // 45-75%
        change: Math.floor(Math.random() * 20) - 10, // -10 to +10
        status: Math.random() > 0.7 ? 'GOOD' : Math.random() > 0.4 ? 'FAIR' : 'LOW'
      },
      cropHealth: {
        ndvi: Math.round((Math.random() * 0.4 + 0.3) * 100) / 100, // 0.3-0.7
        change: Math.floor(Math.random() * 15) - 5, // -5 to +10
        status: Math.random() > 0.6 ? 'GOOD' : Math.random() > 0.3 ? 'FAIR' : 'POOR'
      },
      nextAction: {
        action: ['Irrigate', 'Fertilize', 'Harvest', 'Spray', 'Plant'][Math.floor(Math.random() * 5)],
        urgency: Math.random() > 0.7 ? 'URGENT' : Math.random() > 0.4 ? 'MEDIUM' : 'LOW',
        timeframe: ['24h', '48h', '1 week', '2 weeks'][Math.floor(Math.random() * 4)],
        confidence: Math.floor(Math.random() * 30) + 70 // 70-100%
      },
      seasonImpact: {
        profit: Math.floor(Math.random() * 100000) + 20000, // 20k-120k
        percentage: Math.floor(Math.random() * 80) + 20, // 20-100%
        projected: Math.floor(Math.random() * 50) + 50 // 50-100%
      }
    };
    
    setData(newData);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LOW': case 'POOR': case 'URGENT': return 'text-red-600 bg-red-50';
      case 'FAIR': case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'GOOD': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'URGENT': return 'text-red-600 bg-red-50 border-red-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌍 MavunoAI Farm Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time agricultural intelligence powered by NASA Earth Observation data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Soil Moisture Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Soil Moisture</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data.soilMoisture.status)}`}>
                {data.soilMoisture.status}
              </span>
            </div>
            
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {data.soilMoisture.current}%
            </div>
            
            <div className="flex items-center text-sm">
              <span className={`font-medium ${data.soilMoisture.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.soilMoisture.change >= 0 ? '+' : ''}{data.soilMoisture.change}%
              </span>
              <span className="text-gray-500 ml-2">Last 7 days</span>
            </div>
          </div>

          {/* Crop Health Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Crop Health</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data.cropHealth.status)}`}>
                {data.cropHealth.status}
              </span>
            </div>
            
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {data.cropHealth.ndvi}
            </div>
            
            <div className="flex items-center text-sm">
              <span className="font-medium text-green-600">
                +{data.cropHealth.change}%
              </span>
              <span className="text-gray-500 ml-2">NDVI Index</span>
            </div>
          </div>

          {/* Next Action Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Next Action</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(data.nextAction.urgency)}`}>
                {data.nextAction.urgency}
              </span>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {data.nextAction.action}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{data.nextAction.timeframe}</span>
              <span className="font-medium text-blue-600">{data.nextAction.confidence}%</span>
            </div>
          </div>

          {/* Season Impact Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Season Impact</h3>
              <span className="px-3 py-1 rounded-full text-sm font-medium text-green-600 bg-green-50">
                PROFIT
              </span>
            </div>
            
            <div className="text-3xl font-bold text-gray-900 mb-2">
              +KES {data.seasonImpact.profit.toLocaleString()}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600 font-medium">+{data.seasonImpact.percentage}%</span>
              <span className="text-gray-500">{data.seasonImpact.projected}%</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Projected gain/acre</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={simulateData}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '🔄 Simulating...' : '🔄 Simulate New Data'}
          </button>
          
          <button
            onClick={() => window.open('http://localhost:8000/docs', '_blank')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            📡 View API Docs
          </button>
          
          <button
            onClick={() => window.open('http://localhost:3000/game', '_blank')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            🎮 Play Game
          </button>
        </div>

        {/* NASA Data Sources */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📡 NASA Data Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">🌍</div>
              <h4 className="font-medium text-gray-800">SMAP</h4>
              <p className="text-sm text-gray-600">Soil Moisture</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">🌧️</div>
              <h4 className="font-medium text-gray-800">CHIRPS</h4>
              <p className="text-sm text-gray-600">Rainfall</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl mb-2">🛰️</div>
              <h4 className="font-medium text-gray-800">Landsat</h4>
              <p className="text-sm text-gray-600">NDVI</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl mb-2">🌡️</div>
              <h4 className="font-medium text-gray-800">MODIS</h4>
              <p className="text-sm text-gray-600">Temperature</p>
            </div>
          </div>
        </div>

        {/* Module Status */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🧅 Onion Module</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Loss Prevention:</span>
                <span className="font-medium text-green-600">40%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Savings:</span>
                <span className="font-medium text-green-600">KES 150K/acre</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Active</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🐝 Apiary Module</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Yield Increase:</span>
                <span className="font-medium text-green-600">30%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Revenue:</span>
                <span className="font-medium text-green-600">KES 120K/year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
