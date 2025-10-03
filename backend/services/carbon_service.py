"""
Carbon Service - Carbon metrics and sustainability tracking for Carbon Corp entities
"""

from datetime import datetime, date, timedelta
from typing import Dict, List, Any, Optional
import random
from models.schemas import CarbonMetricsRequest, CarbonMetricsResponse

class CarbonService:
    def __init__(self):
        self.entities = self._initialize_demo_entities()
        self.metrics_cache = {}
    
    def health_check(self) -> Dict[str, Any]:
        """Check if carbon service is healthy"""
        return {
            "status": "healthy",
            "entities_loaded": len(self.entities),
            "cached_metrics": len(self.metrics_cache)
        }
    
    def _initialize_demo_entities(self) -> Dict[str, Dict[str, Any]]:
        """Initialize demo Carbon Corp entities"""
        return {
            "entity_001": {
                "name": "GreenFinance Kenya Ltd",
                "type": "Agricultural Finance",
                "founded": 2018,
                "focus_areas": ["Sustainable Agriculture", "Climate Finance", "Rural Development"]
            },
            "entity_002": {
                "name": "Sustainable Agriculture Fund",
                "type": "Impact Investment",
                "founded": 2020,
                "focus_areas": ["Carbon Credits", "Agroforestry", "Soil Health"]
            },
            "entity_003": {
                "name": "Climate Action Partners",
                "type": "NGO",
                "founded": 2015,
                "focus_areas": ["Farmer Training", "Climate Adaptation", "Technology Transfer"]
            }
        }
    
    async def get_carbon_metrics(self, request: CarbonMetricsRequest) -> CarbonMetricsResponse:
        """Get carbon metrics for an entity"""
        
        entity_id = request.entity_id
        entity_info = self.entities.get(entity_id, self.entities["entity_001"])
        
        # Generate metrics based on entity and time period
        metrics = await self._generate_carbon_metrics(entity_id, request.start_date, request.end_date)
        
        response = CarbonMetricsResponse(
            entity_id=entity_id,
            entity_name=entity_info["name"],
            reporting_period={
                "start": request.start_date.isoformat(),
                "end": request.end_date.isoformat()
            },
            overview=metrics["overview"],
            carbon_metrics=metrics["carbon_metrics"],
            environmental_impact=metrics["environmental_impact"],
            social_impact=metrics["social_impact"],
            agricultural_outcomes=metrics["agricultural_outcomes"],
            spatial_data=metrics["spatial_data"],
            data_quality=metrics["data_quality"]
        )
        
        # Cache the response
        cache_key = f"{entity_id}_{request.start_date}_{request.end_date}"
        self.metrics_cache[cache_key] = response
        
        return response
    
    async def _generate_carbon_metrics(self, entity_id: str, start_date: date, end_date: date) -> Dict[str, Any]:
        """Generate carbon metrics for an entity"""
        
        # Base metrics that vary by entity
        base_farms = {"entity_001": 1250, "entity_002": 890, "entity_003": 650}.get(entity_id, 1000)
        base_hectares = {"entity_001": 3400, "entity_002": 2200, "entity_003": 1800}.get(entity_id, 2500)
        
        # Add some variation based on time period
        days_diff = (end_date - start_date).days
        time_factor = min(1.0, days_diff / 365)  # Scale by time period
        
        # Overview metrics
        overview = {
            "total_farms": int(base_farms * time_factor),
            "total_hectares": int(base_hectares * time_factor),
            "farmers_active_last_30_days": int(base_farms * time_factor * 0.7),
            "avg_farm_size_ha": round(base_hectares / base_farms, 2)
        }
        
        # Carbon metrics
        carbon_sequestered = base_hectares * time_factor * random.uniform(1.0, 1.5)  # tonnes CO2
        carbon_metrics = {
            "total_co2_sequestered_tonnes": round(carbon_sequestered, 0),
            "co2_per_hectare_tonnes": round(carbon_sequestered / base_hectares, 2),
            "methodology": "IPCC Tier 1 + satellite verification",
            "verification_status": "certified",
            "credit_value_estimate_usd": round(carbon_sequestered * 20, 0)  # $20/tonne
        }
        
        # Environmental impact
        environmental_impact = {
            "water_saved_m3": int(base_hectares * time_factor * random.uniform(30, 50)),
            "soil_health_improvement_percent": round(random.uniform(15, 25), 1),
            "forest_area_restored_ha": int(base_hectares * time_factor * random.uniform(0.01, 0.03)),
            "biodiversity_index": round(random.uniform(0.6, 0.8), 2)
        }
        
        # Social impact
        social_impact = {
            "farmers_above_poverty_line": int(base_farms * time_factor * random.uniform(0.6, 0.8)),
            "avg_income_increase_percent": round(random.uniform(18, 30), 1),
            "women_farmers_percent": round(random.uniform(35, 50), 1),
            "youth_farmers_percent": round(random.uniform(20, 35), 1)
        }
        
        # Agricultural outcomes
        agricultural_outcomes = {
            "avg_yield_increase_percent": round(random.uniform(15, 25), 1),
            "crop_diversity_index": round(random.uniform(2.0, 3.0), 1),
            "sustainable_practices_adoption_rate": round(random.uniform(0.6, 0.8), 2),
            "input_efficiency_improvement_percent": round(random.uniform(10, 20), 1)
        }
        
        # Spatial data (NDVI time series)
        spatial_data = {
            "ndvi_time_series": self._generate_ndvi_time_series(start_date, end_date),
            "land_cover_change": {
                "cropland_increase_ha": int(base_hectares * time_factor * random.uniform(0.02, 0.05)),
                "degraded_land_rehabilitated_ha": int(base_hectares * time_factor * random.uniform(0.01, 0.03))
            }
        }
        
        # Data quality metrics
        data_quality = {
            "satellite_imagery_coverage_percent": round(random.uniform(90, 98), 1),
            "ground_truth_samples": int(base_farms * time_factor * random.uniform(0.05, 0.1)),
            "confidence_score": round(random.uniform(0.85, 0.95), 2),
            "last_updated": datetime.utcnow().isoformat()
        }
        
        return {
            "overview": overview,
            "carbon_metrics": carbon_metrics,
            "environmental_impact": environmental_impact,
            "social_impact": social_impact,
            "agricultural_outcomes": agricultural_outcomes,
            "spatial_data": spatial_data,
            "data_quality": data_quality
        }
    
    def _generate_ndvi_time_series(self, start_date: date, end_date: date) -> List[Dict[str, Any]]:
        """Generate NDVI time series data"""
        time_series = []
        current_date = start_date
        base_ndvi = 0.4
        
        while current_date <= end_date:
            # Generate monthly NDVI data with seasonal variation
            month = current_date.month
            seasonal_factor = 0.8 + 0.4 * abs(6 - month) / 6  # Peak in June/July
            ndvi_value = base_ndvi * seasonal_factor + random.uniform(-0.05, 0.05)
            ndvi_value = max(0, min(1, ndvi_value))  # Clamp between 0 and 1
            
            time_series.append({
                "date": current_date.strftime("%Y-%m"),
                "avg_ndvi": round(ndvi_value, 3)
            })
            
            # Move to next month
            if current_date.month == 12:
                current_date = current_date.replace(year=current_date.year + 1, month=1)
            else:
                current_date = current_date.replace(month=current_date.month + 1)
        
        return time_series
    
    async def get_entity_dashboard(self, entity_id: str) -> Dict[str, Any]:
        """Get comprehensive dashboard data for an entity"""
        
        entity_info = self.entities.get(entity_id, self.entities["entity_001"])
        
        # Get current quarter metrics
        end_date = date.today()
        start_date = end_date - timedelta(days=90)
        
        metrics_request = CarbonMetricsRequest(
            entity_id=entity_id,
            start_date=start_date,
            end_date=end_date
        )
        
        metrics = await self.get_carbon_metrics(metrics_request)
        
        # Add additional dashboard-specific data
        dashboard = {
            "entity_info": entity_info,
            "metrics": metrics,
            "recent_activities": self._generate_recent_activities(entity_id),
            "performance_trends": self._generate_performance_trends(entity_id),
            "alerts": self._generate_entity_alerts(entity_id),
            "map_data": self._generate_map_data(entity_id)
        }
        
        return dashboard
    
    def _generate_recent_activities(self, entity_id: str) -> List[Dict[str, Any]]:
        """Generate recent activities for dashboard"""
        activities = [
            {
                "date": (datetime.now() - timedelta(days=1)).isoformat(),
                "type": "farmer_onboarded",
                "description": "5 new farmers onboarded in Machakos County",
                "impact": "Additional 12 hectares under monitoring"
            },
            {
                "date": (datetime.now() - timedelta(days=3)).isoformat(),
                "type": "carbon_verified",
                "description": "Q3 carbon sequestration verified by third party",
                "impact": "420 tonnes CO2 certified for carbon credits"
            },
            {
                "date": (datetime.now() - timedelta(days=7)).isoformat(),
                "type": "training_completed",
                "description": "Sustainable farming training completed for 25 farmers",
                "impact": "Adoption rate increased to 68%"
            }
        ]
        
        return activities
    
    def _generate_performance_trends(self, entity_id: str) -> Dict[str, List[Dict[str, Any]]]:
        """Generate performance trends data"""
        trends = {
            "carbon_sequestration": [],
            "farmer_engagement": [],
            "yield_improvement": []
        }
        
        # Generate 12 months of trend data
        for i in range(12):
            month_date = datetime.now() - timedelta(days=30*i)
            
            trends["carbon_sequestration"].append({
                "month": month_date.strftime("%Y-%m"),
                "value": random.uniform(300, 500)
            })
            
            trends["farmer_engagement"].append({
                "month": month_date.strftime("%Y-%m"),
                "value": random.uniform(60, 85)
            })
            
            trends["yield_improvement"].append({
                "month": month_date.strftime("%Y-%m"),
                "value": random.uniform(15, 25)
            })
        
        return trends
    
    def _generate_entity_alerts(self, entity_id: str) -> List[Dict[str, Any]]:
        """Generate alerts for entity dashboard"""
        alerts = [
            {
                "type": "performance",
                "priority": "medium",
                "title": "Carbon sequestration below target",
                "message": "Q3 carbon sequestration 8% below target. Review farmer practices.",
                "action_required": True
            },
            {
                "type": "data_quality",
                "priority": "low",
                "title": "Satellite imagery coverage reduced",
                "message": "Cloud cover affecting 15% of monitoring areas this month.",
                "action_required": False
            }
        ]
        
        return alerts
    
    def _generate_map_data(self, entity_id: str) -> Dict[str, Any]:
        """Generate map visualization data"""
        return {
            "farm_locations": [
                {"lat": -1.2921, "lng": 36.8219, "farmer_id": "farmer_001", "status": "active"},
                {"lat": -1.3500, "lng": 37.0000, "farmer_id": "farmer_002", "status": "active"},
                {"lat": -1.1000, "lng": 36.9000, "farmer_id": "farmer_003", "status": "inactive"}
            ],
            "ndvi_heatmap": {
                "center": {"lat": -1.2921, "lng": 36.8219},
                "radius": 50000,  # 50km radius
                "intensity": 0.75
            },
            "rainfall_zones": [
                {"name": "High Rainfall", "polygon": [], "color": "blue"},
                {"name": "Moderate Rainfall", "polygon": [], "color": "green"},
                {"name": "Low Rainfall", "polygon": [], "color": "yellow"}
            ]
        }
