"""
EO Farm Navigators - FastAPI Backend
Main application entry point for hackathon demo
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime, timedelta
import asyncio
from typing import List, Dict, Any, Optional
import json

# Import our modules
from services.weather_service import WeatherService
from services.simulation_service import SimulationService
from services.advisory_service import AdvisoryService
from services.carbon_service import CarbonService
from services.apiary_service import ApiaryService
from services.farmer_service import FarmerService
from database import get_db, create_tables
from models.schemas import (
    WeatherRequest, WeatherResponse,
    SimulationRequest, SimulationResponse,
    AdvisoryRequest, AdvisoryResponse,
    CarbonMetricsRequest, CarbonMetricsResponse
)

# Initialize FastAPI app
app = FastAPI(
    title="EO Farm Navigators API",
    description="Agricultural intelligence platform powered by NASA and Digital Earth Africa data",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for web frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
weather_service = WeatherService()
simulation_service = SimulationService()
advisory_service = AdvisoryService()
carbon_service = CarbonService()
apiary_service = ApiaryService()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "🌍 EO Farm Navigators API",
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "weather": await weather_service.health_check(),
            "simulation": simulation_service.health_check(),
            "advisory": advisory_service.health_check(),
            "carbon": carbon_service.health_check(),
            "apiary": "healthy"
        },
        "timestamp": datetime.utcnow().isoformat()
    }

# Weather API Endpoints
@app.post("/api/v1/weather/forecast", response_model=WeatherResponse)
async def get_weather_forecast(request: WeatherRequest):
    """Get weather forecast for a location"""
    try:
        forecast = await weather_service.get_forecast(
            latitude=request.latitude,
            longitude=request.longitude,
            days=request.days
        )
        return forecast
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/weather/current")
async def get_current_weather(latitude: float, longitude: float):
    """Get current weather conditions"""
    try:
        current = await weather_service.get_current_weather(latitude, longitude)
        return current
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Simulation API Endpoints
@app.post("/api/v1/simulate", response_model=SimulationResponse)
async def simulate_crop_yield(request: SimulationRequest):
    """Simulate crop yield based on farmer inputs"""
    try:
        simulation = await simulation_service.run_simulation(request)
        return simulation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/simulate/{simulation_id}")
async def get_simulation(simulation_id: str):
    """Get simulation results by ID"""
    try:
        result = simulation_service.get_simulation(simulation_id)
        if not result:
            raise HTTPException(status_code=404, detail="Simulation not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Advisory API Endpoints
@app.post("/api/v1/advisory", response_model=AdvisoryResponse)
async def get_advisory(request: AdvisoryRequest):
    """Get agricultural advisory for a farmer"""
    try:
        advisory = await advisory_service.generate_advisory(request)
        return advisory
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/advisory/farmer/{farmer_id}")
async def get_farmer_advisory(farmer_id: str):
    """Get latest advisory for a specific farmer"""
    try:
        advisory = await advisory_service.get_farmer_advisory(farmer_id)
        return advisory
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Carbon Dashboard API Endpoints
@app.post("/api/v1/carbon/metrics", response_model=CarbonMetricsResponse)
async def get_carbon_metrics(request: CarbonMetricsRequest):
    """Get carbon metrics for an entity"""
    try:
        metrics = await carbon_service.get_carbon_metrics(request)
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/carbon/entity/{entity_id}")
async def get_entity_dashboard(entity_id: str):
    """Get carbon dashboard for an entity"""
    try:
        dashboard = await carbon_service.get_entity_dashboard(entity_id)
        return dashboard
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Market Prices API
@app.get("/api/v1/market/prices")
async def get_market_prices(commodity: str = "maize", location: str = "Nairobi"):
    """Get current market prices for commodities"""
    try:
        prices = await advisory_service.get_market_prices(commodity, location)
        return prices
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Satellite Data API
@app.get("/api/v1/satellite/ndvi")
async def get_ndvi_data(latitude: float, longitude: float, days: int = 30):
    """Get NDVI data for a location"""
    try:
        ndvi = await weather_service.get_ndvi_data(latitude, longitude, days)
        return ndvi
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Apiary API Endpoints
@app.get("/api/v1/apiary/nectar-flow")
async def get_nectar_flow_prediction(latitude: float, longitude: float, date: str = None):
    """Get nectar flow prediction for beekeepers"""
    try:
        location = {"lat": latitude, "lon": longitude}
        prediction = apiary_service.predict_nectar_flow(location, date)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/apiary/hive-move-opportunity")
async def get_hive_move_opportunity(latitude: float, longitude: float):
    """Check if beekeeper should move hives this week"""
    try:
        location = {"lat": latitude, "lon": longitude}
        opportunity = apiary_service.predict_hive_move_opportunity(location)
        return opportunity
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/apiary/optimal-locations")
async def get_optimal_hive_locations(latitude: float, longitude: float, radius_km: int = 20):
    """Find optimal hive locations within search radius"""
    try:
        location = {"lat": latitude, "lon": longitude}
        locations = apiary_service.find_optimal_hive_locations(location, radius_km)
        return {"optimal_locations": locations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Farmer Authentication Endpoints
@app.post("/api/v1/farmer/login")
async def farmer_login(phone_number: str, db=Depends(get_db)):
    """Authenticate farmer by phone number"""
    try:
        farmer_service = FarmerService(db)
        farmer = farmer_service.authenticate_farmer(phone_number)
        
        if not farmer:
            raise HTTPException(status_code=404, detail="Farmer not found")
        
        # Create session
        session_token = farmer_service.create_session(farmer.id, "web")
        
        return {
            "success": True,
            "farmer": {
                "id": farmer.id,
                "name": farmer.name,
                "phone": farmer.phone_number,
                "location": farmer.location,
                "language": farmer.language,
                "is_verified": farmer.is_verified,
                "home_latitude": farmer.home_latitude,
                "home_longitude": farmer.home_longitude,
                "home_location_name": farmer.home_location_name
            },
            "session_token": session_token
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/farmer/profile")
async def get_farmer_profile(session_token: str, db=Depends(get_db)):
    """Get farmer profile and farms"""
    try:
        farmer_service = FarmerService(db)
        farmer = farmer_service.validate_session(session_token)
        
        if not farmer:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        summary = farmer_service.get_farmer_summary(farmer.id)
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/farmer/farms")
async def create_farm(
    session_token: str,
    name: str,
    latitude: float,
    longitude: float,
    location_name: str = None,
    size_acres: float = None,
    primary_crop: str = None,
    soil_type: str = None,
    irrigation_type: str = None,
    db=Depends(get_db)
):
    """Create a new farm for authenticated farmer"""
    try:
        farmer_service = FarmerService(db)
        farmer = farmer_service.validate_session(session_token)
        
        if not farmer:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        farm = farmer_service.create_farm(
            farmer_id=farmer.id,
            name=name,
            latitude=latitude,
            longitude=longitude,
            location_name=location_name,
            size_acres=size_acres,
            primary_crop=primary_crop,
            soil_type=soil_type,
            irrigation_type=irrigation_type
        )
        
        return {
            "success": True,
            "farm": {
                "id": farm.id,
                "name": farm.name,
                "location": farm.location_name,
                "coordinates": {"lat": farm.latitude, "lon": farm.longitude},
                "size_acres": farm.size_acres,
                "primary_crop": farm.primary_crop
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/farmer/farms")
async def get_farmer_farms(session_token: str, db=Depends(get_db)):
    """Get all farms for authenticated farmer"""
    try:
        farmer_service = FarmerService(db)
        farmer = farmer_service.validate_session(session_token)
        
        if not farmer:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        farms = farmer_service.get_farmer_farms(farmer.id)
        
        return {
            "farms": [
                {
                    "id": farm.id,
                    "name": farm.name,
                    "location": farm.location_name,
                    "coordinates": {"lat": farm.latitude, "lon": farm.longitude},
                    "size_acres": farm.size_acres,
                    "primary_crop": farm.primary_crop,
                    "soil_type": farm.soil_type,
                    "irrigation_type": farm.irrigation_type
                }
                for farm in farms
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/farmer/logout")
async def farmer_logout(session_token: str, db=Depends(get_db)):
    """Logout farmer and deactivate session"""
    try:
        farmer_service = FarmerService(db)
        farmer_service.deactivate_session(session_token)
        
        return {"success": True, "message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/farmer/send-verification")
async def send_verification_code(phone_number: str, db=Depends(get_db)):
    """Send SMS verification code to farmer"""
    try:
        farmer_service = FarmerService(db)
        result = farmer_service.send_verification_code(phone_number)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/farmer/verify-code")
async def verify_code(phone_number: str, code: str, db=Depends(get_db)):
    """Verify SMS code"""
    try:
        farmer_service = FarmerService(db)
        result = farmer_service.verify_code(phone_number, code)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/farmer/update-home-location")
async def update_home_location(phone_number: str, latitude: float, longitude: float, location_name: str, db=Depends(get_db)):
    """Update farmer's home location"""
    try:
        farmer_service = FarmerService(db)
        farmer = farmer_service.get_farmer_by_phone(phone_number)
        if not farmer:
            raise HTTPException(status_code=404, detail="Farmer not found")
        
        result = farmer_service.update_home_location(farmer.id, latitude, longitude, location_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/farmer/update-language")
async def update_language(phone_number: str, language: str, db=Depends(get_db)):
    """Update farmer's language preference"""
    try:
        farmer_service = FarmerService(db)
        farmer = farmer_service.get_farmer_by_phone(phone_number)
        if not farmer:
            raise HTTPException(status_code=404, detail="Farmer not found")
        
        result = farmer_service.update_language(farmer.id, language)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Demo Data Endpoints (for hackathon)
@app.get("/api/v1/demo/farmers")
async def get_demo_farmers():
    """Get demo farmer data for presentation"""
    return {
        "farmers": [
            {
                "id": "farmer_001",
                "name": "John Mwangi",
                "location": "Machakos",
                "phone": "+254712345678",
                "farm_size": 2.0,
                "crops": ["maize", "beans"]
            },
            {
                "id": "farmer_002", 
                "name": "Grace Njeri",
                "location": "Kiambu",
                "phone": "+254723456789",
                "farm_size": 10.0,
                "crops": ["tomatoes", "coffee"]
            }
        ]
    }

@app.get("/api/v1/demo/entities")
async def get_demo_entities():
    """Get demo Carbon Corp entities for presentation"""
    return {
        "entities": [
            {
                "id": "entity_001",
                "name": "GreenFinance Kenya Ltd",
                "farms_financed": 1250,
                "hectares_monitored": 3400,
                "carbon_sequestered": 4200
            },
            {
                "id": "entity_002",
                "name": "Sustainable Agriculture Fund",
                "farms_financed": 890,
                "hectares_monitored": 2200,
                "carbon_sequestered": 2800
            }
        ]
    }

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    create_tables()
    print("✅ Database tables created/verified")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
