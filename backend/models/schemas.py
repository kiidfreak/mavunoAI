"""
Pydantic schemas for API request/response models
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime, date
from enum import Enum

# Enums
class Priority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class CropType(str, Enum):
    MAIZE = "maize"
    BEANS = "beans"
    TOMATOES = "tomatoes"
    COFFEE = "coffee"
    KALE = "kale"

class AdvisoryType(str, Enum):
    WEATHER = "weather"
    PEST = "pest"
    IRRIGATION = "irrigation"
    FERTILIZER = "fertilizer"
    MARKET = "market"

# Weather Models
class WeatherRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, description="Latitude coordinate")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude coordinate")
    days: int = Field(7, ge=1, le=14, description="Number of forecast days")

class WeatherDay(BaseModel):
    date: str
    temp_min_c: float
    temp_max_c: float
    rainfall_mm: float
    conditions: str
    humidity_avg: float

class WeatherResponse(BaseModel):
    location: Dict[str, Any]
    current: Dict[str, Any]
    forecast: List[WeatherDay]
    data_sources: List[str]
    generated_at: datetime

# Simulation Models
class SimulationInputs(BaseModel):
    fertilizer_dap_kg_ha: float = Field(50, ge=0, le=200)
    fertilizer_urea_kg_ha: float = Field(25, ge=0, le=100)
    irrigation_mm_week: float = Field(20, ge=0, le=100)
    pesticide_applications: int = Field(2, ge=0, le=10)

class SimulationRequest(BaseModel):
    latitude: float
    longitude: float
    crop: CropType
    variety: Optional[str] = "hybrid_614"
    planting_date: date
    farm_size_ha: float = Field(2.0, ge=0.1, le=1000)
    inputs: SimulationInputs
    scenarios: List[str] = ["current", "optimal", "budget"]

class SimulationResult(BaseModel):
    predicted_yield_kg_ha: float
    confidence_interval_lower: float
    confidence_interval_upper: float
    total_yield_kg: float
    harvest_date_estimate: date
    costs: Dict[str, float]
    revenue_estimate_usd: float
    net_profit_usd: float
    roi_percent: float

class SimulationResponse(BaseModel):
    simulation_id: str
    created_at: datetime
    results: Dict[str, SimulationResult]
    recommendations: List[Dict[str, Any]]
    climate_data: Dict[str, Any]

# Advisory Models
class AdvisoryRequest(BaseModel):
    farmer_id: str
    latitude: float
    longitude: float
    crop: CropType
    farm_size_ha: float
    current_conditions: Optional[Dict[str, Any]] = None

class Alert(BaseModel):
    id: str
    priority: Priority
    type: AdvisoryType
    title: str
    message: str
    action_required: bool
    expires_at: Optional[datetime] = None

class Recommendation(BaseModel):
    category: str
    message: str
    confidence: float

class AdvisoryResponse(BaseModel):
    farmer_id: str
    generated_at: datetime
    alerts: List[Alert]
    recommendations: List[Recommendation]
    farm_health_score: int
    next_check_in: datetime

# Carbon Models
class CarbonMetricsRequest(BaseModel):
    entity_id: str
    start_date: date
    end_date: date
    granularity: str = "monthly"

class CarbonMetricsResponse(BaseModel):
    entity_id: str
    entity_name: str
    reporting_period: Dict[str, str]
    overview: Dict[str, Any]
    carbon_metrics: Dict[str, Any]
    environmental_impact: Dict[str, Any]
    social_impact: Dict[str, Any]
    agricultural_outcomes: Dict[str, Any]
    spatial_data: Dict[str, Any]
    data_quality: Dict[str, Any]

# Market Price Models
class MarketPrice(BaseModel):
    commodity: str
    location: str
    current_price: float
    currency: str = "KES"
    unit: str = "kg"
    price_change_7d_percent: float
    trend: str
    historical_data: List[Dict[str, Any]]

# NDVI Models
class NDVIDataPoint(BaseModel):
    date: str
    ndvi_value: float
    quality: str

class NDVIResponse(BaseModel):
    location: Dict[str, float]
    data_points: List[NDVIDataPoint]
    average_ndvi: float
    trend: str
    data_source: str
