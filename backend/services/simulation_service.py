"""
Simulation Service - Crop yield prediction and scenario modeling
"""

import uuid
from datetime import datetime, date, timedelta
from typing import Dict, List, Any, Optional
import random
import math
from models.schemas import (
    SimulationRequest, SimulationResponse, SimulationResult,
    SimulationInputs, CropType
)

class SimulationService:
    def __init__(self):
        self.simulations = {}  # In-memory storage for demo
        self.crop_models = self._initialize_crop_models()
    
    def health_check(self) -> Dict[str, Any]:
        """Check if simulation service is healthy"""
        return {
            "status": "healthy",
            "crop_models_loaded": len(self.crop_models),
            "active_simulations": len(self.simulations)
        }
    
    def _initialize_crop_models(self) -> Dict[str, Dict[str, Any]]:
        """Initialize crop growth models with parameters"""
        return {
            "maize": {
                "base_yield_kg_ha": 3000,
                "water_requirement_mm": 500,
                "growing_days": 120,
                "fertilizer_response": 0.8,
                "irrigation_response": 0.6,
                "optimal_temp_c": 25,
                "temp_tolerance": 5
            },
            "beans": {
                "base_yield_kg_ha": 1200,
                "water_requirement_mm": 400,
                "growing_days": 90,
                "fertilizer_response": 0.6,
                "irrigation_response": 0.4,
                "optimal_temp_c": 22,
                "temp_tolerance": 3
            },
            "tomatoes": {
                "base_yield_kg_ha": 25000,
                "water_requirement_mm": 600,
                "growing_days": 100,
                "fertilizer_response": 1.0,
                "irrigation_response": 0.8,
                "optimal_temp_c": 24,
                "temp_tolerance": 4
            },
            "coffee": {
                "base_yield_kg_ha": 800,
                "water_requirement_mm": 800,
                "growing_days": 365,
                "fertilizer_response": 0.5,
                "irrigation_response": 0.3,
                "optimal_temp_c": 20,
                "temp_tolerance": 2
            }
        }
    
    async def run_simulation(self, request: SimulationRequest) -> SimulationResponse:
        """Run crop yield simulation for given inputs"""
        
        simulation_id = f"sim_{uuid.uuid4().hex[:8]}"
        created_at = datetime.utcnow()
        
        # Get crop model
        crop_model = self.crop_models.get(request.crop.value, self.crop_models["maize"])
        
        # Run simulations for different scenarios
        results = {}
        
        for scenario in request.scenarios:
            if scenario == "current":
                result = self._simulate_scenario(request, crop_model, request.inputs)
            elif scenario == "optimal":
                optimal_inputs = self._get_optimal_inputs(request.crop, crop_model)
                result = self._simulate_scenario(request, crop_model, optimal_inputs)
            elif scenario == "budget":
                budget_inputs = self._get_budget_inputs(request.inputs)
                result = self._simulate_scenario(request, crop_model, budget_inputs)
            else:
                result = self._simulate_scenario(request, crop_model, request.inputs)
            
            results[scenario] = result
        
        # Generate recommendations
        recommendations = self._generate_recommendations(request, results, crop_model)
        
        # Get climate data
        climate_data = await self._get_climate_data(request)
        
        # Store simulation
        simulation_response = SimulationResponse(
            simulation_id=simulation_id,
            created_at=created_at,
            results=results,
            recommendations=recommendations,
            climate_data=climate_data
        )
        
        self.simulations[simulation_id] = simulation_response
        
        return simulation_response
    
    def _simulate_scenario(self, request: SimulationRequest, crop_model: Dict[str, Any], inputs: SimulationInputs) -> SimulationResult:
        """Simulate a specific scenario"""
        
        # Base yield calculation
        base_yield = crop_model["base_yield_kg_ha"]
        
        # Fertilizer effect (diminishing returns)
        fertilizer_effect = min(1.0, (inputs.fertilizer_dap_kg_ha + inputs.fertilizer_urea_kg_ha) / 100)
        fertilizer_multiplier = 1 + (fertilizer_effect * crop_model["fertilizer_response"])
        
        # Irrigation effect
        irrigation_effect = min(1.0, inputs.irrigation_mm_week * 4 / crop_model["water_requirement_mm"])
        irrigation_multiplier = 1 + (irrigation_effect * crop_model["irrigation_response"])
        
        # Temperature effect (simplified)
        temp_effect = self._calculate_temperature_effect(request, crop_model)
        
        # Random weather variation
        weather_variation = random.uniform(0.85, 1.15)
        
        # Calculate final yield
        predicted_yield = base_yield * fertilizer_multiplier * irrigation_multiplier * temp_effect * weather_variation
        
        # Add some realistic variation
        confidence_range = predicted_yield * 0.15
        lower_bound = max(0, predicted_yield - confidence_range)
        upper_bound = predicted_yield + confidence_range
        
        # Calculate costs
        costs = self._calculate_costs(inputs, request.farm_size_ha)
        
        # Calculate revenue (simplified pricing)
        price_per_kg = self._get_crop_price(request.crop)
        revenue = predicted_yield * request.farm_size_ha * price_per_kg
        
        # Calculate net profit
        net_profit = revenue - costs["total_usd"]
        roi = (net_profit / costs["total_usd"]) * 100 if costs["total_usd"] > 0 else 0
        
        # Estimate harvest date
        harvest_date = request.planting_date + timedelta(days=crop_model["growing_days"])
        
        return SimulationResult(
            predicted_yield_kg_ha=round(predicted_yield, 0),
            confidence_interval_lower=round(lower_bound, 0),
            confidence_interval_upper=round(upper_bound, 0),
            total_yield_kg=round(predicted_yield * request.farm_size_ha, 0),
            harvest_date_estimate=harvest_date,
            costs=costs,
            revenue_estimate_usd=round(revenue, 2),
            net_profit_usd=round(net_profit, 2),
            roi_percent=round(roi, 1)
        )
    
    def _calculate_temperature_effect(self, request: SimulationRequest, crop_model: Dict[str, Any]) -> float:
        """Calculate temperature effect on yield (simplified)"""
        # Mock temperature data - in production would use real weather data
        avg_temp = 24 + random.uniform(-3, 3)
        optimal_temp = crop_model["optimal_temp_c"]
        temp_tolerance = crop_model["temp_tolerance"]
        
        temp_diff = abs(avg_temp - optimal_temp)
        if temp_diff <= temp_tolerance:
            return 1.0
        else:
            # Linear decrease beyond tolerance
            return max(0.5, 1.0 - (temp_diff - temp_tolerance) / temp_tolerance * 0.5)
    
    def _calculate_costs(self, inputs: SimulationInputs, farm_size_ha: float) -> Dict[str, float]:
        """Calculate farming costs"""
        # Cost per kg (USD)
        dap_cost_per_kg = 0.8
        urea_cost_per_kg = 0.6
        water_cost_per_m3 = 0.5
        pesticide_cost_per_application = 20
        
        # Calculate costs
        fertilizer_cost = (inputs.fertilizer_dap_kg_ha * dap_cost_per_kg + 
                          inputs.fertilizer_urea_kg_ha * urea_cost_per_kg) * farm_size_ha
        
        # Irrigation cost (assuming 1mm = 10m3/ha)
        irrigation_volume = inputs.irrigation_mm_week * 4 * 10 * farm_size_ha  # 4 weeks
        irrigation_cost = irrigation_volume * water_cost_per_m3
        
        pesticide_cost = inputs.pesticide_applications * pesticide_cost_per_application * farm_size_ha
        
        total_cost = fertilizer_cost + irrigation_cost + pesticide_cost
        
        return {
            "fertilizer_usd": round(fertilizer_cost, 2),
            "irrigation_usd": round(irrigation_cost, 2),
            "pesticide_usd": round(pesticide_cost, 2),
            "total_usd": round(total_cost, 2)
        }
    
    def _get_crop_price(self, crop: CropType) -> float:
        """Get current market price per kg (USD)"""
        prices = {
            "maize": 0.3,
            "beans": 0.8,
            "tomatoes": 0.5,
            "coffee": 2.5
        }
        return prices.get(crop.value, 0.3)
    
    def _get_optimal_inputs(self, crop: CropType, crop_model: Dict[str, Any]) -> SimulationInputs:
        """Get optimal input recommendations"""
        if crop == CropType.MAIZE:
            return SimulationInputs(
                fertilizer_dap_kg_ha=60,
                fertilizer_urea_kg_ha=30,
                irrigation_mm_week=25,
                pesticide_applications=3
            )
        elif crop == CropType.TOMATOES:
            return SimulationInputs(
                fertilizer_dap_kg_ha=80,
                fertilizer_urea_kg_ha=40,
                irrigation_mm_week=30,
                pesticide_applications=4
            )
        else:
            return SimulationInputs(
                fertilizer_dap_kg_ha=50,
                fertilizer_urea_kg_ha=25,
                irrigation_mm_week=20,
                pesticide_applications=2
            )
    
    def _get_budget_inputs(self, current_inputs: SimulationInputs) -> SimulationInputs:
        """Get budget-constrained input recommendations"""
        return SimulationInputs(
            fertilizer_dap_kg_ha=max(20, current_inputs.fertilizer_dap_kg_ha * 0.7),
            fertilizer_urea_kg_ha=max(10, current_inputs.fertilizer_urea_kg_ha * 0.7),
            irrigation_mm_week=max(5, current_inputs.irrigation_mm_week * 0.5),
            pesticide_applications=max(1, current_inputs.pesticide_applications - 1)
        )
    
    def _generate_recommendations(self, request: SimulationRequest, results: Dict[str, SimulationResult], crop_model: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate farming recommendations based on simulation results"""
        recommendations = []
        
        current = results.get("current")
        optimal = results.get("optimal")
        
        if current and optimal:
            yield_improvement = optimal.predicted_yield_kg_ha - current.predicted_yield_kg_ha
            
            if yield_improvement > 200:
                recommendations.append({
                    "priority": "HIGH",
                    "action": f"Optimize fertilizer application - potential {yield_improvement:.0f} kg/ha increase",
                    "impact": f"{round(yield_improvement/current.predicted_yield_kg_ha*100, 1)}% yield improvement"
                })
            
            if optimal.costs["total_usd"] - current.costs["total_usd"] > 50:
                recommendations.append({
                    "priority": "MEDIUM", 
                    "action": "Consider budget constraints - optimal scenario requires additional investment",
                    "impact": f"Additional cost: ${optimal.costs['total_usd'] - current.costs['total_usd']:.0f}"
                })
        
        # Planting timing recommendation
        recommendations.append({
            "priority": "HIGH",
            "action": f"Plant {request.crop.value} between {request.planting_date.strftime('%b %d')} for optimal growing season",
            "impact": "15-20% yield increase from proper timing"
        })
        
        return recommendations
    
    async def _get_climate_data(self, request: SimulationRequest) -> Dict[str, Any]:
        """Get climate data for simulation context"""
        # Mock climate data - in production would use real weather service
        return {
            "rainfall_historical_avg_mm": 650 + random.uniform(-100, 100),
            "rainfall_forecast_mm": 680 + random.uniform(-50, 50),
            "temperature_avg_c": 24 + random.uniform(-2, 2),
            "ndvi_current": 0.42 + random.uniform(-0.1, 0.1),
            "soil_moisture_percent": 68 + random.uniform(-10, 10)
        }
    
    def get_simulation(self, simulation_id: str) -> Optional[SimulationResponse]:
        """Get simulation by ID"""
        return self.simulations.get(simulation_id)
