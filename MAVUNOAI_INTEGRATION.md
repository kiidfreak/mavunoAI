# 🔗 MavunoAI Frontend Integration Guide

## Overview

This guide explains how to integrate the mavunoAI Next.js frontend with the EO Farm Navigators backend API to create the complete MavunoAI platform.

## Project Structure

```
mavunoAI/
├── frontend/                 # mavunoAI Next.js app (your upload)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/                  # FastAPI backend
│   ├── main.py
│   ├── services/
│   └── ...
├── whatsapp-bot/            # WhatsApp integration
├── ussd-app/               # USSD service
└── MAVUNOAI_ROADMAP.md     # Complete roadmap
```

## API Integration

### Backend Endpoints

The backend provides these key endpoints for the mavunoAI frontend:

#### Weather Data
```typescript
// GET /api/weather/current?lat=1.2921&lon=36.8219
interface WeatherResponse {
  temperature: number;
  humidity: number;
  rainfall: number;
  forecast: WeatherForecast[];
  source: string;
  timestamp: string;
}
```

#### Simulation Data
```typescript
// POST /api/simulation/onion
interface SimulationRequest {
  location: { lat: number; lon: number };
  farmSize: number;
  cropStage: number;
  soilMoisture: number;
}

interface SimulationResponse {
  yieldPrediction: number;
  riskFactors: RiskFactor[];
  recommendations: Recommendation[];
  costBenefit: CostBenefit;
}
```

#### Advisory Data
```typescript
// GET /api/advisory/onion?lat=1.2921&lon=36.8219
interface AdvisoryResponse {
  irrigation: IrrigationAdvice;
  disease: DiseaseRisk;
  harvest: HarvestTiming;
  market: MarketInfo;
}
```

#### Apiary Data
```typescript
// GET /api/apiary/nectar-flow?lat=1.2921&lon=36.8219
interface NectarFlowResponse {
  nectar_score: number;
  ndvi: number;
  rainfall_7d: number;
  temperature: TemperatureData;
  recommendations: ApiaryRecommendations;
  data_sources: string[];
  confidence: string;
}

// GET /api/apiary/hive-move-opportunity?lat=1.2921&lon=36.8219
interface HiveMoveOpportunity {
  recommendation: 'MOVE' | 'STAY';
  current_ndvi: number;
  best_location_ndvi?: number;
  ndvi_difference?: number;
  distance_km?: number;
  expected_yield_increase?: string;
  move_cost_kes?: number;
  data_sources: string[];
  confidence: string;
}
```

#### Carbon Dashboard Data
```typescript
// GET /api/carbon/dashboard?entity_id=123
interface CarbonDashboard {
  carbonSequestration: number;
  waterConservation: number;
  biodiversityIndex: number;
  farmerMetrics: FarmerMetrics[];
  satelliteVerification: SatelliteData;
}
```

## Frontend Integration Steps

### 1. Environment Setup

Create `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_NASA_API_KEY=your_nasa_key
```

### 2. API Client Setup

Create `src/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  }

  // Weather API
  async getWeather(lat: number, lon: number) {
    return this.get<WeatherResponse>(`/api/weather/current?lat=${lat}&lon=${lon}`);
  }

  // Simulation API
  async runSimulation(data: SimulationRequest) {
    return this.post<SimulationResponse>('/api/simulation/onion', data);
  }

  // Advisory API
  async getAdvisory(lat: number, lon: number) {
    return this.get<AdvisoryResponse>(`/api/advisory/onion?lat=${lat}&lon=${lon}`);
  }

  // Carbon Dashboard API
  async getCarbonDashboard(entityId: string) {
    return this.get<CarbonDashboard>(`/api/carbon/dashboard?entity_id=${entityId}`);
  }

  // Apiary API
  async getNectarFlow(lat: number, lon: number, date?: string) {
    const params = new URLSearchParams({ lat: lat.toString(), lon: lon.toString() });
    if (date) params.append('date', date);
    return this.get<NectarFlowResponse>(`/api/apiary/nectar-flow?${params}`);
  }

  async getHiveMoveOpportunity(lat: number, lon: number) {
    return this.get<HiveMoveOpportunity>(`/api/apiary/hive-move-opportunity?lat=${lat}&lon=${lon}`);
  }

  async getOptimalHiveLocations(lat: number, lon: number, radiusKm: number = 20) {
    return this.get<{optimal_locations: any[]}>(`/api/apiary/optimal-locations?lat=${lat}&lon=${lon}&radius_km=${radiusKm}`);
  }
}

export const apiClient = new ApiClient();
```

### 3. React Hooks for Data Fetching

Create `src/hooks/useWeather.ts`:

```typescript
import { useState, useEffect } from 'react';
import { apiClient, WeatherResponse } from '@/lib/api';

export function useWeather(lat: number, lon: number) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getWeather(lat, lon);
        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather');
      } finally {
        setLoading(false);
      }
    };

    if (lat && lon) {
      fetchWeather();
    }
  }, [lat, lon]);

  return { weather, loading, error };
}
```

### 4. Game Integration

For the educational game component, integrate with simulation API:

#### Onion Game Component

```typescript
// src/components/Game/OnionGame.tsx
import { useState } from 'react';
import { apiClient, SimulationRequest, SimulationResponse } from '@/lib/api';

export function OnionGame() {
  const [simulation, setSimulation] = useState<SimulationResponse | null>(null);
  const [gameState, setGameState] = useState({
    day: 1,
    soilMoisture: 65,
    cropStage: 30,
    budget: 50000,
    farmSize: 2
  });

  const runSimulation = async () => {
    const request: SimulationRequest = {
      location: { lat: -1.2921, lon: 36.8219 }, // Machakos
      farmSize: gameState.farmSize,
      cropStage: gameState.cropStage,
      soilMoisture: gameState.soilMoisture
    };

    try {
      const result = await apiClient.runSimulation(request);
      setSimulation(result);
    } catch (error) {
      console.error('Simulation failed:', error);
    }
  };

  return (
    <div className="onion-game">
      {/* Game UI components */}
      <button onClick={runSimulation}>
        Run Simulation
      </button>
      
      {simulation && (
        <div className="simulation-results">
          <h3>Simulation Results</h3>
          <p>Predicted Yield: {simulation.yieldPrediction} tons/ha</p>
          <p>Risk Level: {simulation.riskFactors[0]?.level}</p>
          <p>Recommendation: {simulation.recommendations[0]?.action}</p>
        </div>
      )}
    </div>
  );
}
```

#### Apiary Game Component

```typescript
// src/components/Game/ApiaryGame.tsx
import { useState } from 'react';
import { apiClient, NectarFlowResponse, HiveMoveOpportunity } from '@/lib/api';

export function ApiaryGame() {
  const [nectarFlow, setNectarFlow] = useState<NectarFlowResponse | null>(null);
  const [moveOpportunity, setMoveOpportunity] = useState<HiveMoveOpportunity | null>(null);
  const [gameState, setGameState] = useState({
    day: 1,
    hives: 10,
    currentLocation: { lat: -1.2921, lon: 36.8219 }, // Machakos
    budget: 50000,
    honeyProduction: 15 // kg/month
  });

  const checkNectarFlow = async () => {
    try {
      const result = await apiClient.getNectarFlow(
        gameState.currentLocation.lat, 
        gameState.currentLocation.lon
      );
      setNectarFlow(result);
    } catch (error) {
      console.error('Nectar flow check failed:', error);
    }
  };

  const checkMoveOpportunity = async () => {
    try {
      const result = await apiClient.getHiveMoveOpportunity(
        gameState.currentLocation.lat, 
        gameState.currentLocation.lon
      );
      setMoveOpportunity(result);
    } catch (error) {
      console.error('Move opportunity check failed:', error);
    }
  };

  const makeMoveDecision = (decision: 'MOVE' | 'STAY') => {
    if (decision === 'MOVE' && moveOpportunity?.recommendation === 'MOVE') {
      // Update game state with move
      setGameState(prev => ({
        ...prev,
        budget: prev.budget - (moveOpportunity.move_cost_kes || 0),
        honeyProduction: Math.round(prev.honeyProduction * 1.25) // 25% increase
      }));
    }
  };

  return (
    <div className="apiary-game">
      <h2>🐝 The Nectar Rush - Beekeeping Challenge</h2>
      
      <div className="game-stats">
        <p>Day: {gameState.day}</p>
        <p>Hives: {gameState.hives}</p>
        <p>Budget: {gameState.budget} KES</p>
        <p>Honey Production: {gameState.honeyProduction} kg/month</p>
      </div>

      <div className="game-actions">
        <button onClick={checkNectarFlow}>
          Check Nectar Flow
        </button>
        <button onClick={checkMoveOpportunity}>
          Check Move Opportunity
        </button>
      </div>

      {nectarFlow && (
        <div className="nectar-flow-results">
          <h3>Nectar Flow Analysis</h3>
          <p>Score: {nectarFlow.nectar_score}/100</p>
          <p>NDVI: {nectarFlow.ndvi}</p>
          <p>Rainfall (7d): {nectarFlow.rainfall_7d}mm</p>
          <p>Recommendation: {nectarFlow.recommendations.action}</p>
          <p>Message: {nectarFlow.recommendations.message}</p>
        </div>
      )}

      {moveOpportunity && (
        <div className="move-opportunity">
          <h3>Hive Move Opportunity</h3>
          <p>Recommendation: {moveOpportunity.recommendation}</p>
          
          {moveOpportunity.recommendation === 'MOVE' && (
            <div>
              <p>Current NDVI: {moveOpportunity.current_ndvi}</p>
              <p>Best Location NDVI: {moveOpportunity.best_location_ndvi}</p>
              <p>Expected Yield Increase: {moveOpportunity.expected_yield_increase}</p>
              <p>Move Cost: {moveOpportunity.move_cost_kes} KES</p>
              <p>Distance: {moveOpportunity.distance_km} km</p>
              
              <div className="decision-buttons">
                <button onClick={() => makeMoveDecision('MOVE')}>
                  Move Hives (Cost: {moveOpportunity.move_cost_kes} KES)
                </button>
                <button onClick={() => makeMoveDecision('STAY')}>
                  Stay Put
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### 5. Map Integration

For the farm map with NASA data overlays:

```typescript
// src/components/Map/FarmMap.tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useWeather } from '@/hooks/useWeather';

export function FarmMap() {
  const { weather, loading } = useWeather(-1.2921, 36.8219);

  return (
    <MapContainer
      center={[-1.2921, 36.8219]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      
      <Marker position={[-1.2921, 36.8219]}>
        <Popup>
          <div>
            <h3>Your Farm</h3>
            {weather && (
              <div>
                <p>Temperature: {weather.temperature}°C</p>
                <p>Humidity: {weather.humidity}%</p>
                <p>Rainfall: {weather.rainfall}mm</p>
                <p>Source: {weather.source}</p>
              </div>
            )}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
```

### 6. Dashboard Integration

For the Carbon Corp entity dashboard:

```typescript
// src/pages/dashboard/carbon.tsx
import { useState, useEffect } from 'react';
import { apiClient, CarbonDashboard } from '@/lib/api';

export default function CarbonDashboard() {
  const [dashboard, setDashboard] = useState<CarbonDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await apiClient.getCarbonDashboard('entity_123');
        setDashboard(data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!dashboard) return <div>No data available</div>;

  return (
    <div className="carbon-dashboard">
      <h1>Carbon Impact Dashboard</h1>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Carbon Sequestration</h3>
          <p>{dashboard.carbonSequestration} tonnes CO₂</p>
        </div>
        
        <div className="metric-card">
          <h3>Water Conservation</h3>
          <p>{dashboard.waterConservation} m³ saved</p>
        </div>
        
        <div className="metric-card">
          <h3>Biodiversity Index</h3>
          <p>{dashboard.biodiversityIndex}</p>
        </div>
      </div>

      <div className="farmer-metrics">
        <h3>Farmer Performance</h3>
        {dashboard.farmerMetrics.map((farmer, index) => (
          <div key={index} className="farmer-card">
            <p>{farmer.name}</p>
            <p>Yield: {farmer.yieldImprovement}%</p>
            <p>Income: +{farmer.incomeIncrease}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Demo Scenarios

### 1. Educational Game
1. Open http://localhost:3000/game
2. Select "Onion Farming" or "Beekeeping" module
3. Make irrigation/hive placement decisions based on NASA data
4. See real-time simulation results from backend API

### 2. Real-Time Advisory
1. Open http://localhost:3000/advisory
2. Enter farm location (Machakos: -1.2921, 36.8219)
3. View current weather and soil conditions
4. Get irrigation and disease risk recommendations

### 3. Carbon Dashboard
1. Open http://localhost:3000/dashboard/carbon
2. View entity-level impact metrics
3. See farmer performance data
4. Access satellite verification data

### 4. Multi-Channel Integration
1. Test USSD: Dial *384*96# (if configured)
2. Test WhatsApp: Send "weather" to bot
3. Test Web: All features available at localhost:3000

## Development Workflow

### 1. Start Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Test Integration
- Backend API: http://localhost:8000/docs
- Frontend App: http://localhost:3000
- Test API calls in browser console

## Troubleshooting

### Common Issues

1. **CORS Errors**: Backend needs to allow frontend origin
2. **API Timeout**: Check backend is running on port 8000
3. **Data Not Loading**: Check API endpoints in browser dev tools
4. **Map Not Showing**: Verify Mapbox token in environment variables

### Debug Steps

1. Check browser console for errors
2. Verify API responses in Network tab
3. Test API endpoints directly with curl/Postman
4. Check backend logs for errors

## Next Steps

1. **Customize UI**: Adapt mavunoAI design to match EO Farm Navigators branding
2. **Add Features**: Implement additional game scenarios and dashboard widgets
3. **Optimize Performance**: Add caching and error handling
4. **Deploy**: Set up production deployment with proper environment variables

This integration creates a complete MavunoAI platform that combines the educational game, real-time advisory, and carbon impact tracking into a unified user experience.
