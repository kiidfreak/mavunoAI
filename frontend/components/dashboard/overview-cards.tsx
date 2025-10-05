"use client";

import { Card, CardContent } from "@/components/ui/card"
import { Droplets, Leaf, AlertCircle, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

const metrics = [
  {
    icon: Droplets,
    label: "Soil Moisture",
    value: "58%",
    status: "LOW",
    statusColor: "bg-destructive text-destructive-foreground",
    trend: "-12%",
    trendLabel: "Last 7 days",
    progress: 58,
    action: "Check Now",
    color: "text-chart-4",
  },
  {
    icon: Leaf,
    label: "Crop Health",
    value: "0.52",
    status: "FAIR",
    statusColor: "bg-secondary text-secondary-foreground",
    trend: "+0.06",
    trendLabel: "NDVI Index",
    progress: 65,
    action: "View Details",
    color: "text-primary",
  },
  {
    icon: AlertCircle,
    label: "Next Action",
    value: "Irrigate",
    status: "URGENT",
    statusColor: "bg-destructive text-destructive-foreground",
    trend: "24h",
    trendLabel: "Within 24 hours",
    progress: 85,
    action: "Plan Now",
    color: "text-destructive",
  },
  {
    icon: TrendingUp,
    label: "Season Impact",
    value: "+KES 48k",
    status: "PROFIT",
    statusColor: "bg-primary text-primary-foreground",
    trend: "+60%",
    trendLabel: "Projected gain/acre",
    progress: 75,
    action: "View Breakdown",
    color: "text-primary",
  },
]

export function OverviewCards() {
  const [currentMetrics, setCurrentMetrics] = useState(metrics);
  const [loadingStates, setLoadingStates] = useState<{[key: number]: boolean}>({});

  // Fetch data from backend API
  const fetchData = async (metricIndex: number, endpoint: string) => {
    setLoadingStates(prev => ({ ...prev, [metricIndex]: true }));
    
    try {
      const response = await fetch(`http://localhost:8000${endpoint}`);
      const data = await response.json();
      
      // Update the specific metric with real data
      setCurrentMetrics(prev => {
        const newMetrics = [...prev];
        const metric = newMetrics[metricIndex];
        
        if (endpoint.includes('weather')) {
          // Weather data for soil moisture
          metric.value = `${Math.floor(data.temperature || 25)}°C`;
          metric.status = data.temperature > 30 ? "HIGH" : data.temperature < 20 ? "LOW" : "GOOD";
          metric.statusColor = data.temperature > 30 ? "bg-destructive text-destructive-foreground" : 
                               data.temperature < 20 ? "bg-secondary text-secondary-foreground" : 
                               "bg-primary text-primary-foreground";
          metric.trend = `${data.humidity || 65}%`;
          metric.progress = Math.min(100, Math.max(0, (data.temperature || 25) * 2));
        } else if (endpoint.includes('satellite')) {
          // NDVI data for crop health
          metric.value = (data.ndvi || 0.52).toFixed(2);
          metric.status = data.ndvi > 0.6 ? "GOOD" : data.ndvi > 0.4 ? "FAIR" : "POOR";
          metric.statusColor = data.ndvi > 0.6 ? "bg-primary text-primary-foreground" : 
                               data.ndvi > 0.4 ? "bg-secondary text-secondary-foreground" : 
                               "bg-destructive text-destructive-foreground";
          metric.trend = `+${((data.ndvi || 0.52) * 100).toFixed(1)}%`;
          metric.progress = Math.min(100, Math.max(0, (data.ndvi || 0.52) * 100));
        } else if (endpoint.includes('advisory')) {
          // Advisory data for next action
          metric.value = data.recommendation || "Irrigate";
          metric.status = data.priority === "HIGH" ? "URGENT" : data.priority === "MEDIUM" ? "MEDIUM" : "LOW";
          metric.statusColor = data.priority === "HIGH" ? "bg-destructive text-destructive-foreground" : 
                               data.priority === "MEDIUM" ? "bg-secondary text-secondary-foreground" : 
                               "bg-primary text-primary-foreground";
          metric.trend = data.timeframe || "24h";
          metric.progress = Math.min(100, Math.max(70, (data.confidence || 85)));
        } else if (endpoint.includes('carbon')) {
          // Carbon/impact data
          metric.value = `+KES ${(data.profit || 48000).toLocaleString()}`;
          metric.status = "PROFIT";
          metric.statusColor = "bg-primary text-primary-foreground";
          metric.trend = `+${data.percentage || 60}%`;
          metric.progress = Math.min(100, Math.max(50, data.projected || 75));
        }
        
        return newMetrics;
      });
    } catch (error) {
      console.error(`Error fetching data for metric ${metricIndex}:`, error);
      // Fallback to simulated data if API fails
      const simulatedData = generateSimulatedData(metricIndex);
      setCurrentMetrics(prev => {
        const newMetrics = [...prev];
        newMetrics[metricIndex] = { ...newMetrics[metricIndex], ...simulatedData };
        return newMetrics;
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [metricIndex]: false }));
    }
  };

  const generateSimulatedData = (metricIndex: number) => {
    const simulatedData = {
      0: { // Soil Moisture
        value: `${Math.floor(Math.random() * 30) + 45}%`,
        status: Math.random() > 0.7 ? "GOOD" : Math.random() > 0.4 ? "FAIR" : "LOW",
        statusColor: Math.random() > 0.7 ? "bg-primary text-primary-foreground" : Math.random() > 0.4 ? "bg-secondary text-secondary-foreground" : "bg-destructive text-destructive-foreground",
        trend: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 15)}%`,
        progress: Math.floor(Math.random() * 40) + 40,
      },
      1: { // Crop Health
        value: (Math.random() * 0.4 + 0.3).toFixed(2),
        status: Math.random() > 0.6 ? "GOOD" : Math.random() > 0.3 ? "FAIR" : "POOR",
        statusColor: Math.random() > 0.6 ? "bg-primary text-primary-foreground" : Math.random() > 0.3 ? "bg-secondary text-secondary-foreground" : "bg-destructive text-destructive-foreground",
        trend: `+${(Math.random() * 0.2).toFixed(2)}`,
        progress: Math.floor(Math.random() * 40) + 50,
      },
      2: { // Next Action
        value: ["Irrigate", "Fertilize", "Harvest", "Spray", "Plant"][Math.floor(Math.random() * 5)],
        status: Math.random() > 0.7 ? "URGENT" : Math.random() > 0.4 ? "MEDIUM" : "LOW",
        statusColor: Math.random() > 0.7 ? "bg-destructive text-destructive-foreground" : Math.random() > 0.4 ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground",
        trend: ["24h", "48h", "1 week", "2 weeks"][Math.floor(Math.random() * 4)],
        progress: Math.floor(Math.random() * 30) + 70,
      },
      3: { // Season Impact
        value: `+KES ${(Math.floor(Math.random() * 100000) + 20000).toLocaleString()}`,
        status: "PROFIT",
        statusColor: "bg-primary text-primary-foreground",
        trend: `+${Math.floor(Math.random() * 80) + 20}%`,
        progress: Math.floor(Math.random() * 50) + 50,
      }
    };
    return simulatedData[metricIndex as keyof typeof simulatedData] || {};
  };

  const handleButtonClick = (metricIndex: number, action: string) => {
    let endpoint = '';
    
    switch (action) {
      case 'Check Now':
        endpoint = '/api/v1/weather/current?latitude=-1.2921&longitude=36.8219';
        break;
      case 'View Details':
        endpoint = '/api/v1/satellite/ndvi?latitude=-1.2921&longitude=36.8219&days=30';
        break;
      case 'Plan Now':
        endpoint = '/api/v1/advisory/onion?latitude=-1.2921&longitude=36.8219';
        break;
      case 'View Breakdown':
        endpoint = '/api/v1/carbon/entity/entity_001';
        break;
      default:
        endpoint = '/api/v1/weather/current?latitude=-1.2921&longitude=36.8219';
    }
    
    fetchData(metricIndex, endpoint);
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {currentMetrics.map((metric, index) => (
        <Card key={index} className="border-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </div>
              <Badge className={metric.statusColor}>{metric.status}</Badge>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-3xl font-bold">{metric.value}</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{metric.trend}</span>
                  <span className="text-muted-foreground">{metric.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${metric.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{metric.trendLabel}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-transparent"
                onClick={() => handleButtonClick(index, metric.action)}
                disabled={loadingStates[index]}
              >
                {loadingStates[index] ? '🔄 Loading...' : metric.action}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
