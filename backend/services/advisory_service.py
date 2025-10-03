"""
Advisory Service - Agricultural recommendations and alerts
"""

from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import random
from models.schemas import (
    AdvisoryRequest, AdvisoryResponse, Alert, Recommendation,
    Priority, AdvisoryType, CropType
)

class AdvisoryService:
    def __init__(self):
        self.advisories = {}  # In-memory storage for demo
        self.market_prices = self._initialize_market_prices()
    
    def health_check(self) -> Dict[str, Any]:
        """Check if advisory service is healthy"""
        return {
            "status": "healthy",
            "rules_loaded": 15,
            "active_advisories": len(self.advisories)
        }
    
    def _initialize_market_prices(self) -> Dict[str, Dict[str, float]]:
        """Initialize market price data"""
        return {
            "maize": {
                "Nairobi": 45.0,
                "Mombasa": 38.0,
                "Kisumu": 42.0,
                "Nakuru": 40.0
            },
            "beans": {
                "Nairobi": 120.0,
                "Mombasa": 110.0,
                "Kisumu": 115.0,
                "Nakuru": 118.0
            },
            "tomatoes": {
                "Nairobi": 80.0,
                "Mombasa": 75.0,
                "Kisumu": 78.0,
                "Nakuru": 82.0
            },
            "coffee": {
                "Nairobi": 300.0,
                "Mombasa": 295.0,
                "Kisumu": 310.0,
                "Nakuru": 305.0
            }
        }
    
    async def generate_advisory(self, request: AdvisoryRequest) -> AdvisoryResponse:
        """Generate agricultural advisory for a farmer"""
        
        farmer_id = request.farmer_id
        generated_at = datetime.utcnow()
        
        # Generate alerts based on conditions
        alerts = await self._generate_alerts(request)
        
        # Generate recommendations
        recommendations = await self._generate_recommendations(request)
        
        # Calculate farm health score
        health_score = self._calculate_farm_health_score(request, alerts)
        
        # Next check-in time
        next_check_in = generated_at + timedelta(days=3)
        
        advisory = AdvisoryResponse(
            farmer_id=farmer_id,
            generated_at=generated_at,
            alerts=alerts,
            recommendations=recommendations,
            farm_health_score=health_score,
            next_check_in=next_check_in
        )
        
        # Store advisory
        self.advisories[farmer_id] = advisory
        
        return advisory
    
    async def _generate_alerts(self, request: AdvisoryRequest) -> List[Alert]:
        """Generate alerts based on current conditions"""
        alerts = []
        
        # Weather alerts
        weather_alerts = await self._check_weather_conditions(request)
        alerts.extend(weather_alerts)
        
        # Pest alerts
        pest_alerts = await self._check_pest_conditions(request)
        alerts.extend(pest_alerts)
        
        # Irrigation alerts
        irrigation_alerts = await self._check_irrigation_needs(request)
        alerts.extend(irrigation_alerts)
        
        return alerts
    
    async def _check_weather_conditions(self, request: AdvisoryRequest) -> List[Alert]:
        """Check weather-related conditions"""
        alerts = []
        
        # Mock weather data - in production would use real weather service
        rainfall_forecast = random.uniform(0, 30)  # mm
        temperature = 24 + random.uniform(-5, 5)
        
        # Heavy rain alert
        if rainfall_forecast > 25:
            alerts.append(Alert(
                id=f"weather_{random.randint(1000, 9999)}",
                priority=Priority.HIGH,
                type=AdvisoryType.WEATHER,
                title="Heavy Rain Warning",
                message=f"{rainfall_forecast:.0f}mm rainfall expected. Delay fertilizer application by 2-3 days to avoid nutrient leaching.",
                action_required=True,
                expires_at=datetime.utcnow() + timedelta(days=2)
            ))
        
        # Drought warning
        elif rainfall_forecast < 5:
            alerts.append(Alert(
                id=f"weather_{random.randint(1000, 9999)}",
                priority=Priority.MEDIUM,
                type=AdvisoryType.WEATHER,
                title="Low Rainfall Alert",
                message="Minimal rainfall expected. Consider supplemental irrigation if soil moisture is low.",
                action_required=False,
                expires_at=datetime.utcnow() + timedelta(days=5)
            ))
        
        # Temperature alerts
        if temperature > 30:
            alerts.append(Alert(
                id=f"weather_{random.randint(1000, 9999)}",
                priority=Priority.MEDIUM,
                type=AdvisoryType.WEATHER,
                title="High Temperature Alert",
                message=f"Temperatures reaching {temperature:.0f}°C. Monitor crop stress and increase irrigation if needed.",
                action_required=False,
                expires_at=datetime.utcnow() + timedelta(days=3)
            ))
        
        return alerts
    
    async def _check_pest_conditions(self, request: AdvisoryRequest) -> List[Alert]:
        """Check pest and disease conditions"""
        alerts = []
        
        # Mock pest risk assessment
        pest_risk = random.random()
        humidity = random.uniform(40, 90)
        temperature = 24 + random.uniform(-3, 3)
        
        # Fall armyworm risk for maize
        if request.crop == CropType.MAIZE and pest_risk > 0.7:
            alerts.append(Alert(
                id=f"pest_{random.randint(1000, 9999)}",
                priority=Priority.HIGH,
                type=AdvisoryType.PEST,
                title="Fall Armyworm Risk",
                message="Conditions favorable for fall armyworm. Inspect maize plants daily for egg masses on leaves.",
                action_required=True,
                expires_at=datetime.utcnow() + timedelta(days=7)
            ))
        
        # Late blight risk for tomatoes
        if request.crop == CropType.TOMATOES and temperature > 25 and humidity > 70:
            alerts.append(Alert(
                id=f"pest_{random.randint(1000, 9999)}",
                priority=Priority.HIGH,
                type=AdvisoryType.PEST,
                title="Late Blight Disease Risk",
                message="High humidity and temperature create favorable conditions for late blight. Apply fungicide preventatively.",
                action_required=True,
                expires_at=datetime.utcnow() + timedelta(days=5)
            ))
        
        return alerts
    
    async def _check_irrigation_needs(self, request: AdvisoryRequest) -> List[Alert]:
        """Check irrigation needs"""
        alerts = []
        
        # Mock soil moisture data
        soil_moisture = random.uniform(30, 80)  # percentage
        
        if soil_moisture < 40:
            alerts.append(Alert(
                id=f"irrigation_{random.randint(1000, 9999)}",
                priority=Priority.HIGH,
                type=AdvisoryType.IRRIGATION,
                title="Low Soil Moisture",
                message=f"Soil moisture at {soil_moisture:.0f}%. Irrigation recommended to maintain crop health.",
                action_required=True,
                expires_at=datetime.utcnow() + timedelta(days=1)
            ))
        elif soil_moisture > 70:
            alerts.append(Alert(
                id=f"irrigation_{random.randint(1000, 9999)}",
                priority=Priority.LOW,
                type=AdvisoryType.IRRIGATION,
                title="Adequate Soil Moisture",
                message=f"Soil moisture at {soil_moisture:.0f}%. No irrigation needed this week.",
                action_required=False,
                expires_at=datetime.utcnow() + timedelta(days=3)
            ))
        
        return alerts
    
    async def _generate_recommendations(self, request: AdvisoryRequest) -> List[Recommendation]:
        """Generate farming recommendations"""
        recommendations = []
        
        # Fertilizer recommendations
        recommendations.append(Recommendation(
            category="fertilizer",
            message=f"Apply 50kg DAP per hectare for {request.crop.value} at planting, then 25kg Urea at 4 weeks",
            confidence=0.85
        ))
        
        # Market recommendations
        market_rec = await self._get_market_recommendation(request.crop)
        if market_rec:
            recommendations.append(market_rec)
        
        # General farming advice
        recommendations.append(Recommendation(
            category="general",
            message=f"Monitor {request.crop.value} plants for signs of stress during flowering stage",
            confidence=0.75
        ))
        
        return recommendations
    
    async def _get_market_recommendation(self, crop: CropType) -> Optional[Recommendation]:
        """Get market-based recommendations"""
        prices = self.market_prices.get(crop.value, {})
        if not prices:
            return None
        
        # Find best price location
        best_location = max(prices.items(), key=lambda x: x[1])
        avg_price = sum(prices.values()) / len(prices)
        price_trend = random.choice(["increasing", "stable", "decreasing"])
        
        if price_trend == "increasing":
            message = f"{crop.value.title()} prices trending up. Consider selling soon. Best price: {best_location[1]:.0f} KES/kg in {best_location[0]}"
        elif price_trend == "decreasing":
            message = f"{crop.value.title()} prices declining. Consider holding if storage available. Current average: {avg_price:.0f} KES/kg"
        else:
            message = f"{crop.value.title()} prices stable at {avg_price:.0f} KES/kg average. Good time to sell if needed"
        
        return Recommendation(
            category="market",
            message=message,
            confidence=0.70
        )
    
    def _calculate_farm_health_score(self, request: AdvisoryRequest, alerts: List[Alert]) -> int:
        """Calculate overall farm health score (0-100)"""
        base_score = 80
        
        # Deduct points for high priority alerts
        for alert in alerts:
            if alert.priority == Priority.HIGH:
                base_score -= 15
            elif alert.priority == Priority.MEDIUM:
                base_score -= 8
            elif alert.priority == Priority.LOW:
                base_score -= 3
        
        # Add some random variation
        variation = random.uniform(-5, 5)
        final_score = max(0, min(100, int(base_score + variation)))
        
        return final_score
    
    async def get_farmer_advisory(self, farmer_id: str) -> Optional[AdvisoryResponse]:
        """Get latest advisory for a farmer"""
        return self.advisories.get(farmer_id)
    
    async def get_market_prices(self, commodity: str, location: str) -> Dict[str, Any]:
        """Get market prices for a commodity and location"""
        prices = self.market_prices.get(commodity.lower(), {})
        current_price = prices.get(location, prices.get("Nairobi", 0))
        
        # Add some price variation
        variation = random.uniform(-0.1, 0.1)
        adjusted_price = current_price * (1 + variation)
        
        # Generate historical data
        historical_data = []
        for i in range(7):
            date_obj = datetime.now() - timedelta(days=6-i)
            price_variation = random.uniform(-0.05, 0.05)
            historical_price = adjusted_price * (1 + price_variation)
            historical_data.append({
                "date": date_obj.strftime("%Y-%m-%d"),
                "price": round(historical_price, 1)
            })
        
        # Calculate trend
        recent_avg = sum(d["price"] for d in historical_data[-3:]) / 3
        older_avg = sum(d["price"] for d in historical_data[:3]) / 3
        trend = "increasing" if recent_avg > older_avg else "decreasing" if recent_avg < older_avg else "stable"
        
        return {
            "commodity": commodity,
            "location": location,
            "current_price": round(adjusted_price, 1),
            "currency": "KES",
            "unit": "kg",
            "price_change_7d_percent": round((recent_avg - older_avg) / older_avg * 100, 1),
            "trend": trend,
            "historical_data": historical_data,
            "recommendation": self._get_price_recommendation(trend, recent_avg, older_avg)
        }
    
    def _get_price_recommendation(self, trend: str, recent_avg: float, older_avg: float) -> str:
        """Generate price-based recommendation"""
        if trend == "increasing":
            return "Prices trending upward. Consider selling within next 7-10 days."
        elif trend == "decreasing":
            return "Prices declining. Hold if storage available, or sell quickly to minimize losses."
        else:
            return "Prices stable. Good time to sell if storage is limited or cash flow needed."
