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
import os

from dotenv import load_dotenv
from pydantic import BaseModel

# Import our modules
from services.weather_service import WeatherService
from services.simulation_service import SimulationService
from services.advisory_service import AdvisoryService
from services.carbon_service import CarbonService
from services.apiary_service import ApiaryService
from services.farmer_service import FarmerService
from services.aflatoxin_service import AflatoxinService
from services.cooperative_service import CooperativeService
from services.credit_service import CreditScoringService
from database import get_db, create_tables
from models.schemas import (
    WeatherRequest, WeatherResponse,
    SimulationRequest, SimulationResponse,
    AdvisoryRequest, AdvisoryResponse,
    CarbonMetricsRequest, CarbonMetricsResponse
)

# Load environment variables (e.g., Africa's Talking credentials)
load_dotenv()

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
    allow_origins=["*"],
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
aflatoxin_service = AflatoxinService()
credit_service = CreditScoringService()


class USSDAnalysisPayload(BaseModel):
    phone_number: str
    farmer_name: Optional[str] = None
    location: Optional[str] = None
    score: float
    risk: str
    mpesa_activity: Dict[str, Any]
    loan_offer: Dict[str, Any]
    ndvi_status: Optional[str] = None
    points_awarded: int = 0
    crop: Optional[str] = None
    crop_display: Optional[str] = None


latest_credit_analysis: Dict[str, Dict[str, Any]] = {}


@app.post("/api/v1/ussd/analysis")
async def capture_ussd_analysis(payload: USSDAnalysisPayload):
    """Store latest USSD AI analysis keyed by phone number."""
    latest_credit_analysis[payload.phone_number] = {
        "phone_number": payload.phone_number,
        "farmer_name": payload.farmer_name,
        "location": payload.location,
        "score": payload.score,
        "risk": payload.risk,
        "mpesa_activity": payload.mpesa_activity,
        "loan_offer": payload.loan_offer,
        "ndvi_status": payload.ndvi_status,
        "points_awarded": payload.points_awarded,
        "crop": payload.crop,
        "crop_display": payload.crop_display,
        "timestamp": datetime.utcnow().isoformat(),
    }

    return {"success": True, "message": "USSD analysis captured."}


@app.get("/api/v1/ussd/latest")
async def get_latest_analysis(phone_number: Optional[str] = None):
    """Fetch the latest stored USSD credit analysis."""
    if phone_number:
        item = latest_credit_analysis.get(phone_number)
        if not item:
            raise HTTPException(status_code=404, detail="No analysis found for this number")
        return item

    if not latest_credit_analysis:
        raise HTTPException(status_code=404, detail="No analyses recorded yet")

    # Return most recent item by timestamp
    latest_item = max(latest_credit_analysis.values(), key=lambda x: x.get("timestamp", ""))
    return latest_item

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

# Aflatoxin Prevention Endpoints
@app.get("/api/v1/aflatoxin/risk-assessment")
async def get_aflatoxin_risk(latitude: float, longitude: float, crop_stage: str):
    """Get aflatoxin risk assessment for farm location"""
    try:
        location = {"lat": latitude, "lon": longitude}
        risk_assessment = aflatoxin_service.check_aflatoxin_risk(location, crop_stage)
        return risk_assessment
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Aflatoxin risk assessment failed: {str(e)}")

@app.get("/api/v1/aflatoxin/aflasafe-recommendations")
async def get_aflasafe_recommendations(latitude: float, longitude: float, farm_size_ha: float):
    """Get Aflasafe biocontrol recommendations"""
    try:
        location = {"lat": latitude, "lon": longitude}
        recommendations = aflatoxin_service.get_aflasafe_recommendations(location, farm_size_ha)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Aflasafe recommendations failed: {str(e)}")

@app.get("/api/v1/aflatoxin/national-impact")
async def get_national_aflatoxin_impact():
    """Get national aflatoxin impact statistics"""
    try:
        impact_data = aflatoxin_service.get_national_aflatoxin_impact()
        return impact_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"National impact data failed: {str(e)}")

# Cooperative/Community Endpoints
@app.post("/api/v1/cooperative/create")
async def create_cooperative(name: str, county: str, founder_farmer_id: str, db=Depends(get_db)):
    """Create a new cooperative"""
    try:
        cooperative_service = CooperativeService(db)
        result = cooperative_service.create_cooperative(name, county, founder_farmer_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cooperative creation failed: {str(e)}")

@app.post("/api/v1/cooperative/join")
async def join_cooperative(cooperative_id: str, farmer_id: str, contribution_kes: float = 0.0, db=Depends(get_db)):
    """Farmer joins a cooperative"""
    try:
        cooperative_service = CooperativeService(db)
        result = cooperative_service.join_cooperative(cooperative_id, farmer_id, contribution_kes)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Join cooperative failed: {str(e)}")

@app.get("/api/v1/cooperative/{cooperative_id}/dashboard")
async def get_cooperative_dashboard(cooperative_id: str, db=Depends(get_db)):
    """Get comprehensive cooperative dashboard"""
    try:
        cooperative_service = CooperativeService(db)
        dashboard = cooperative_service.get_cooperative_dashboard(cooperative_id)
        return dashboard
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cooperative dashboard failed: {str(e)}")

@app.get("/api/v1/cooperative/county-ranking")
async def get_county_ranking(county: str, metric_type: str = "sustainability", db=Depends(get_db)):
    """Get county leaderboard ranking"""
    try:
        cooperative_service = CooperativeService(db)
        ranking = cooperative_service.get_county_ranking(county, metric_type)
        return ranking
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"County ranking failed: {str(e)}")

@app.get("/api/v1/cooperative/leaderboard")
async def get_leaderboard(metric_type: str = "sustainability", period: str = "monthly", db=Depends(get_db)):
    """Get county leaderboards for competition"""
    try:
        cooperative_service = CooperativeService(db)
        leaderboard = cooperative_service.get_leaderboard(metric_type, period)
        return leaderboard
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Leaderboard failed: {str(e)}")

@app.post("/api/v1/cooperative/pool-resources")
async def pool_resources(cooperative_id: str, resource_type: str, quantity: float, unit: str, cost_kes: float, db=Depends(get_db)):
    """Pool resources within cooperative"""
    try:
        cooperative_service = CooperativeService(db)
        result = cooperative_service.pool_resources(cooperative_id, resource_type, quantity, unit, cost_kes)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resource pooling failed: {str(e)}")

@app.post("/api/v1/cooperative/share-resource")
async def share_resource(from_cooperative_id: str, to_cooperative_id: str, resource_type: str, quantity: float, unit: str, cost_kes: float = 0.0, db=Depends(get_db)):
    """Share resources between cooperatives"""
    try:
        cooperative_service = CooperativeService(db)
        result = cooperative_service.share_resource(from_cooperative_id, to_cooperative_id, resource_type, quantity, unit, cost_kes)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resource sharing failed: {str(e)}")

@app.get("/api/v1/cooperative/peer-mentorship")
async def get_peer_mentorship_matches(farmer_id: str, db=Depends(get_db)):
    """Get peer mentorship matches based on complementary skills"""
    try:
        cooperative_service = CooperativeService(db)
        matches = cooperative_service.get_peer_mentorship_matches(farmer_id)
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Peer mentorship failed: {str(e)}")

# 🌟 MAVUNOAI CREDIT - AI-Driven Credit Scoring Endpoints
@app.post("/api/v1/credit/score")
async def get_credit_score(
    phone_number: str,
    latitude: float,
    longitude: float,
    crop_type: str,
    farm_size_acres: float = 1.0
):
    """
    Get AI-powered credit score for a farmer
    Uses NASA satellite data + behavioral signals
    No IoT needed - satellites are the sensors!
    """
    try:
        score_result = await credit_service.score_farmer(
            phone_number=phone_number,
            latitude=latitude,
            longitude=longitude,
            crop_type=crop_type,
            farm_size_acres=farm_size_acres
        )
        
        return {
            "success": True,
            "phone_number": phone_number,
            "location": {"lat": latitude, "lon": longitude},
            "crop": crop_type,
            "credit_score": score_result.score,
            "risk_level": score_result.risk_level,
            "loan_recommendation": score_result.loan_recommendation,
            "top_factors": score_result.top_factors,
            "yield_estimate_tonnes": score_result.yield_estimate,
            "fraud_score": score_result.fraud_score,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Credit scoring failed: {str(e)}")

@app.get("/api/v1/credit/simulate-risk")
async def simulate_risk_scenario(
    phone_number: str,
    latitude: float,
    longitude: float,
    crop_type: str,
    rainfall_change_percent: float = 0.0
):
    """
    Simulate how credit score changes with weather scenarios
    E.g., "What if rainfall drops by 20%?"
    """
    try:
        # Get baseline score
        baseline = await credit_service.score_farmer(
            phone_number, latitude, longitude, crop_type
        )
        
        # Simulate scenario (simplified - adjust rainfall impact)
        rainfall_factor = 1.0 + (rainfall_change_percent / 100.0)
        simulated_score = baseline.score * (0.7 + 0.3 * max(0.5, rainfall_factor))
        simulated_score = max(0.0, min(1.0, simulated_score))
        
        return {
            "baseline_score": baseline.score,
            "simulated_score": simulated_score,
            "scenario": f"Rainfall change: {rainfall_change_percent:+.0f}%",
            "impact": simulated_score - baseline.score,
            "recommendation": "Consider weather-indexed insurance" if simulated_score < 0.5 else "Low climate risk"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/credit/dashboard/{phone_number}")
async def get_credit_dashboard(
    phone_number: str,
    latitude: float,
    longitude: float,
    crop_type: str
):
    """
    Get full credit dashboard data for farmer
    Includes: score, NASA data, loan offers, rewards
    """
    try:
        score_result = await credit_service.score_farmer(
            phone_number, latitude, longitude, crop_type
        )
        
        # Get satellite features for display
        satellite_features = await credit_service._fetch_satellite_features(latitude, longitude)
        
        return {
            "farmer": {
                "phone": phone_number,
                "location": {"lat": latitude, "lon": longitude},
                "crop": crop_type
            },
            "credit": {
                "score": score_result.score,
                "risk_level": score_result.risk_level,
                "top_factors": score_result.top_factors
            },
            "satellite_insights": {
                "soil_moisture": satellite_features.get("soil_moisture"),
                "rainfall_30d": satellite_features.get("rainfall_30d"),
                "ndvi_mean": satellite_features.get("ndvi_mean_90d"),
                "ndvi_trend": "↑ Healthy" if satellite_features.get("ndvi_trend_90d", 0) > 0 else "↓ Declining",
                "drought_risk": "High" if satellite_features.get("drought_flag") else "Low",
                "last_updated": "3 hours ago (Near Real-Time)"
            },
            "loan_offer": score_result.loan_recommendation,
            "yield_estimate": {
                "tonnes": score_result.yield_estimate,
                "confidence": "85%"
            },
            "ai_recommendations": [
                "Soil moisture slightly low — irrigate within 3 days" if satellite_features.get("soil_moisture", 0.3) < 0.25 else "Soil moisture optimal",
                "Apply nitrogen fertilizer after next rain" if satellite_features.get("rainfall_30d", 0) > 100 else "Monitor rainfall forecast",
                f"Predicted yield: {score_result.yield_estimate:.1f} tonnes"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    create_tables()
    print("✅ Database tables created/verified")
    print("🌟 MavunoAI Credit - AI-Powered Agri-Finance Ready!")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
