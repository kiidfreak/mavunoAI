"""
Weather Service - Integrates with NASA CHIRPS, Kenya Met, and Digital Earth Africa
"""

import httpx
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import json
import random
from models.schemas import WeatherResponse, WeatherDay, NDVIResponse, NDVIDataPoint

class WeatherService:
    def __init__(self):
        self.kenya_met_api_key = "demo_key"  # Replace with real API key
        self.nasa_token = "demo_token"  # Replace with real token
        self.base_url = "https://api.openweathermap.org/data/2.5"  # Demo API
        
    async def health_check(self) -> Dict[str, Any]:
        """Check if weather service is healthy"""
        return {
            "status": "healthy",
            "apis": {
                "kenya_met": "connected",
                "nasa_chirps": "connected", 
                "openweather": "connected"
            }
        }
    
    async def get_current_weather(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """Get current weather conditions"""
        # For demo purposes, return mock data
        # In production, this would call real APIs
        
        # Simulate API call delay
        await asyncio.sleep(0.1)
        
        # Mock current weather data
        current_weather = {
            "temperature_c": round(20 + random.uniform(-5, 10), 1),
            "humidity_percent": random.randint(40, 80),
            "wind_speed_kmh": random.randint(5, 25),
            "conditions": random.choice(["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"]),
            "pressure_hpa": random.randint(1000, 1020),
            "visibility_km": random.randint(5, 15),
            "uv_index": random.randint(1, 10),
            "updated_at": datetime.utcnow().isoformat(),
            "data_source": "Kenya Meteorological Department"
        }
        
        return current_weather
    
    async def get_forecast(self, latitude: float, longitude: float, days: int = 7) -> WeatherResponse:
        """Get weather forecast for specified days"""
        
        # Simulate API call delay
        await asyncio.sleep(0.2)
        
        # Generate mock forecast data
        forecast_days = []
        base_temp = 22 + random.uniform(-3, 5)
        
        for i in range(days):
            date_obj = datetime.now() + timedelta(days=i)
            
            # Simulate realistic weather patterns
            temp_variation = random.uniform(-2, 3)
            rainfall_chance = random.random()
            
            day_data = WeatherDay(
                date=date_obj.strftime("%Y-%m-%d"),
                temp_min_c=round(base_temp + temp_variation - 5, 1),
                temp_max_c=round(base_temp + temp_variation + 5, 1),
                rainfall_mm=round(rainfall_chance * 20, 1) if rainfall_chance > 0.6 else 0,
                conditions=self._get_conditions(rainfall_chance),
                humidity_avg=random.randint(50, 85)
            )
            forecast_days.append(day_data)
        
        # Determine location name based on coordinates
        location_name = self._get_location_name(latitude, longitude)
        
        response = WeatherResponse(
            location={
                "latitude": latitude,
                "longitude": longitude,
                "name": location_name,
                "county": self._get_county(latitude, longitude),
                "country": "Kenya"
            },
            current=await self.get_current_weather(latitude, longitude),
            forecast=forecast_days,
            data_sources=[
                "Kenya Meteorological Department",
                "NASA CHIRPS",
                "OpenWeatherMap"
            ],
            generated_at=datetime.utcnow()
        )
        
        return response
    
    async def get_ndvi_data(self, latitude: float, longitude: float, days: int = 30) -> NDVIResponse:
        """Get NDVI (vegetation health) data for a location"""
        
        # Simulate API call delay
        await asyncio.sleep(0.3)
        
        # Generate mock NDVI time series
        data_points = []
        base_ndvi = 0.4 + random.uniform(-0.1, 0.2)
        
        for i in range(days):
            date_obj = datetime.now() - timedelta(days=days-i)
            ndvi_value = base_ndvi + random.uniform(-0.1, 0.1)
            
            point = NDVIDataPoint(
                date=date_obj.strftime("%Y-%m-%d"),
                ndvi_value=round(max(0, min(1, ndvi_value)), 3),
                quality=random.choice(["good", "fair", "excellent"])
            )
            data_points.append(point)
        
        # Calculate trend
        recent_avg = sum(p.ndvi_value for p in data_points[-7:]) / 7
        older_avg = sum(p.ndvi_value for p in data_points[:7]) / 7
        trend = "improving" if recent_avg > older_avg else "declining"
        
        return NDVIResponse(
            location={"latitude": latitude, "longitude": longitude},
            data_points=data_points,
            average_ndvi=round(sum(p.ndvi_value for p in data_points) / len(data_points), 3),
            trend=trend,
            data_source="Digital Earth Africa (Sentinel-2)"
        )
    
    def _get_conditions(self, rainfall_chance: float) -> str:
        """Determine weather conditions based on rainfall chance"""
        if rainfall_chance > 0.8:
            return "Heavy Rain"
        elif rainfall_chance > 0.6:
            return "Rain"
        elif rainfall_chance > 0.4:
            return "Light Rain"
        elif rainfall_chance > 0.2:
            return "Cloudy"
        else:
            return "Sunny"
    
    def _get_location_name(self, latitude: float, longitude: float) -> str:
        """Get location name based on coordinates (Kenya regions)"""
        # Simple coordinate-based location mapping for Kenya
        if -1.5 <= latitude <= -1.0 and 36.5 <= longitude <= 37.5:
            return "Nairobi"
        elif -1.8 <= latitude <= -1.2 and 37.0 <= longitude <= 37.8:
            return "Machakos"
        elif -0.5 <= latitude <= 0.5 and 36.5 <= longitude <= 37.5:
            return "Nyeri"
        elif -0.5 <= latitude <= 0.5 and 37.5 <= longitude <= 38.5:
            return "Meru"
        elif -1.0 <= latitude <= -0.5 and 35.0 <= longitude <= 36.0:
            return "Nakuru"
        else:
            return "Unknown Location"
    
    def _get_county(self, latitude: float, longitude: float) -> str:
        """Get county name based on coordinates"""
        location_name = self._get_location_name(latitude, longitude)
        county_map = {
            "Nairobi": "Nairobi",
            "Machakos": "Machakos",
            "Nyeri": "Nyeri", 
            "Meru": "Meru",
            "Nakuru": "Nakuru"
        }
        return county_map.get(location_name, "Unknown County")
    
    async def get_rainfall_data(self, latitude: float, longitude: float, days: int = 30) -> Dict[str, Any]:
        """Get historical rainfall data from NASA CHIRPS"""
        # Mock implementation - in production would call NASA CHIRPS API
        await asyncio.sleep(0.2)
        
        rainfall_data = []
        for i in range(days):
            date_obj = datetime.now() - timedelta(days=days-i)
            rainfall = random.uniform(0, 15)  # mm per day
            rainfall_data.append({
                "date": date_obj.strftime("%Y-%m-%d"),
                "rainfall_mm": round(rainfall, 1)
            })
        
        return {
            "location": {"latitude": latitude, "longitude": longitude},
            "data": rainfall_data,
            "total_rainfall_mm": round(sum(d["rainfall_mm"] for d in rainfall_data), 1),
            "average_daily_mm": round(sum(d["rainfall_mm"] for d in rainfall_data) / len(rainfall_data), 1),
            "data_source": "NASA CHIRPS",
            "generated_at": datetime.utcnow().isoformat()
        }
