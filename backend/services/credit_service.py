"""
MavunoAI Credit Service
AI-driven credit scoring using NASA satellite data + farmer behavior
No IoT needed - satellites are the sensors
"""

import numpy as np
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
import httpx
from dataclasses import dataclass


@dataclass
class CreditScore:
    """Credit score result with explainability"""
    score: float  # 0-1 probability of repayment
    risk_level: str  # Low, Medium, High
    loan_recommendation: Dict[str, Any]
    top_factors: List[Dict[str, float]]  # SHAP-like explanations
    fraud_score: float
    yield_estimate: float
    

class CreditScoringService:
    """
    Credit scoring engine that combines:
    - NASA satellite data (soil moisture, rainfall, NDVI)
    - Farmer behavior (M-Pesa, USSD engagement)
    - Location verification (fraud detection)
    """
    
    def __init__(self):
        self.nasa_power_base = "https://power.larc.nasa.gov/api/temporal/daily/point"
        
    async def score_farmer(
        self,
        phone_number: str,
        latitude: float,
        longitude: float,
        crop_type: str,
        farm_size_acres: Optional[float] = None
    ) -> CreditScore:
        """
        Main credit scoring function
        
        Args:
            phone_number: Farmer's MSISDN (identity anchor)
            latitude: Farm location lat
            longitude: Farm location lon
            crop_type: onion, maize, bees, etc.
            farm_size_acres: Optional farm size
            
        Returns:
            CreditScore with loan recommendation
        """
        
        # 1. Fetch NASA satellite features
        satellite_features = await self._fetch_satellite_features(latitude, longitude)
        
        # 2. Fetch behavioral features (simulated for demo)
        behavior_features = await self._fetch_behavior_features(phone_number)
        
        # 3. Compute fraud/location verification score
        fraud_score = await self._compute_fraud_score(
            latitude, longitude, crop_type, satellite_features
        )
        
        # 4. Estimate yield potential
        yield_estimate = self._estimate_yield(
            satellite_features, crop_type, farm_size_acres or 1.0
        )
        
        # 5. Combine features and compute credit score
        credit_score = self._compute_credit_score(
            satellite_features,
            behavior_features,
            yield_estimate,
            fraud_score
        )
        
        # 6. Generate loan recommendation
        loan_rec = self._generate_loan_recommendation(
            credit_score, fraud_score, yield_estimate, crop_type
        )
        
        # 7. Explain the score (SHAP-like)
        top_factors = self._explain_score(satellite_features, behavior_features)
        
        # 8. Classify risk level
        risk_level = self._classify_risk(credit_score)
        
        return CreditScore(
            score=credit_score,
            risk_level=risk_level,
            loan_recommendation=loan_rec,
            top_factors=top_factors,
            fraud_score=fraud_score,
            yield_estimate=yield_estimate
        )
    
    async def _fetch_satellite_features(
        self, latitude: float, longitude: float
    ) -> Dict[str, float]:
        """
        Fetch NASA POWER data (rainfall, ET, temp)
        In production, also fetch SMAP soil moisture and NDVI
        """
        
        end_date = datetime.now()
        start_date_30 = end_date - timedelta(days=30)
        start_date_90 = end_date - timedelta(days=90)
        
        try:
            # Fetch 90-day NASA POWER data
            async with httpx.AsyncClient(timeout=30.0) as client:
                params = {
                    "parameters": "PRECTOTCORR,EVPTRNS,T2M,RH2M",
                    "community": "AG",
                    "longitude": longitude,
                    "latitude": latitude,
                    "start": start_date_90.strftime("%Y%m%d"),
                    "end": end_date.strftime("%Y%m%d"),
                    "format": "JSON"
                }
                
                response = await client.get(self.nasa_power_base, params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    properties = data.get("properties", {}).get("parameter", {})
                    
                    # Extract rainfall and ET
                    rainfall = list(properties.get("PRECTOTCORR", {}).values())
                    et = list(properties.get("EVPTRNS", {}).values())
                    temp = list(properties.get("T2M", {}).values())
                    humidity = list(properties.get("RH2M", {}).values())
                    
                    # Compute features
                    rainfall_30d = sum(rainfall[-30:]) if len(rainfall) >= 30 else sum(rainfall)
                    rainfall_90d = sum(rainfall)
                    et_30d = np.mean(et[-30:]) if len(et) >= 30 else np.mean(et)
                    temp_avg = np.mean(temp[-30:]) if len(temp) >= 30 else np.mean(temp)
                    
                    # Simulate soil moisture (in production, fetch from SMAP)
                    soil_moisture = self._simulate_soil_moisture(rainfall_30d, et_30d, temp_avg)
                    
                    # Simulate NDVI (in production, fetch from Sentinel/MODIS)
                    ndvi_mean = self._simulate_ndvi(rainfall_30d, soil_moisture, temp_avg)
                    ndvi_trend = self._simulate_ndvi_trend(rainfall)
                    
                    return {
                        "soil_moisture": soil_moisture,
                        "soil_moisture_zscore": self._compute_zscore(soil_moisture, 0.25, 0.08),
                        "rainfall_30d": rainfall_30d,
                        "rainfall_90d": rainfall_90d,
                        "et_30d": et_30d,
                        "temp_avg": temp_avg,
                        "humidity_avg": np.mean(humidity[-30:]) if humidity else 65.0,
                        "ndvi_mean_90d": ndvi_mean,
                        "ndvi_trend_90d": ndvi_trend,
                        "drought_flag": 1 if rainfall_30d < 50 else 0
                    }
        
        except Exception as e:
            print(f"NASA POWER API error: {e}")
            # Return synthetic fallback data for demo
            return self._get_fallback_satellite_features()
        
        return self._get_fallback_satellite_features()
    
    def _simulate_soil_moisture(self, rainfall: float, et: float, temp: float) -> float:
        """Simulate soil moisture from rainfall and ET"""
        # Simple water balance model
        moisture = 0.15 + (rainfall / 500.0) - (et / 200.0) - ((temp - 20) / 100.0)
        return max(0.05, min(0.45, moisture))
    
    def _simulate_ndvi(self, rainfall: float, soil_moisture: float, temp: float) -> float:
        """Simulate NDVI from environmental conditions"""
        # NDVI correlates with water availability and temperature
        ndvi = 0.3 + (soil_moisture * 0.8) + (rainfall / 400.0) - abs(temp - 25) / 50.0
        return max(0.1, min(0.9, ndvi))
    
    def _simulate_ndvi_trend(self, rainfall_series: List[float]) -> float:
        """Compute NDVI trend (slope)"""
        if len(rainfall_series) < 30:
            return 0.0
        
        recent = rainfall_series[-30:]
        x = np.arange(len(recent))
        slope = np.polyfit(x, recent, 1)[0]
        return slope / 10.0  # Normalize
    
    def _compute_zscore(self, value: float, mean: float, std: float) -> float:
        """Compute z-score for anomaly detection"""
        return (value - mean) / std if std > 0 else 0.0
    
    async def _fetch_behavior_features(self, phone_number: str) -> Dict[str, float]:
        """
        Fetch farmer behavioral features
        In production: integrate with M-Pesa API, USSD logs
        For demo: simulate realistic patterns
        """
        
        # Simulate M-Pesa transaction behavior
        # In production, fetch from credit reference bureau or M-Pesa API
        
        account_age_days = hash(phone_number) % 365 + 30  # 30-395 days
        
        return {
            "mpesa_txn_count_90d": hash(phone_number) % 50 + 10,
            "mpesa_avg_balance": (hash(phone_number) % 10000) + 1000,
            "deposit_to_withdraw_ratio": 0.5 + (hash(phone_number) % 50) / 100.0,
            "ussd_engagement_count_90d": hash(phone_number) % 20 + 5,
            "account_age_days": account_age_days,
            "cooperative_member": 1 if hash(phone_number) % 3 == 0 else 0,
            "training_sessions_attended": hash(phone_number) % 5
        }
    
    async def _compute_fraud_score(
        self,
        latitude: float,
        longitude: float,
        crop_type: str,
        satellite_features: Dict[str, float]
    ) -> float:
        """
        Detect location fraud / inconsistencies
        Returns 0-1 (0 = trustworthy, 1 = suspicious)
        """
        
        fraud_signals = 0
        
        # Check 1: NDVI sanity (is this actually farmland?)
        ndvi = satellite_features.get("ndvi_mean_90d", 0.5)
        if ndvi < 0.2:  # Too low for active farming
            fraud_signals += 0.3
        
        # Check 2: Crop-climate mismatch
        rainfall = satellite_features.get("rainfall_30d", 100)
        if crop_type == "onion" and rainfall < 30:  # Onions need water
            fraud_signals += 0.2
        
        # Check 3: Soil moisture vs rainfall consistency
        soil_moisture = satellite_features.get("soil_moisture", 0.25)
        if rainfall > 150 and soil_moisture < 0.15:  # Inconsistent
            fraud_signals += 0.2
        
        # Check 4: Location bounds (Kenya)
        if not (-5 <= latitude <= 5 and 33 <= longitude <= 42):
            fraud_signals += 0.5
        
        return min(1.0, fraud_signals)
    
    def _estimate_yield(
        self,
        satellite_features: Dict[str, float],
        crop_type: str,
        farm_size_acres: float
    ) -> float:
        """
        Estimate crop yield (tonnes) using satellite proxies
        """
        
        # Yield proxy model (simplified)
        ndvi = satellite_features.get("ndvi_mean_90d", 0.5)
        soil_moisture = satellite_features.get("soil_moisture", 0.25)
        rainfall = satellite_features.get("rainfall_90d", 300)
        
        # Base yield per acre by crop
        base_yields = {
            "onion": 8.0,
            "maize": 2.5,
            "beans": 1.2,
            "bees": 0.5,  # honey production (tonnes)
            "tomato": 12.0
        }
        
        base = base_yields.get(crop_type.lower(), 2.0)
        
        # Adjust by conditions
        ndvi_factor = ndvi / 0.6  # Normalize to healthy NDVI
        moisture_factor = min(1.0, soil_moisture / 0.25)
        rainfall_factor = min(1.0, rainfall / 400.0)
        
        yield_per_acre = base * ndvi_factor * moisture_factor * rainfall_factor
        total_yield = yield_per_acre * farm_size_acres
        
        return round(total_yield, 2)
    
    def _compute_credit_score(
        self,
        satellite_features: Dict[str, float],
        behavior_features: Dict[str, float],
        yield_estimate: float,
        fraud_score: float
    ) -> float:
        """
        Core credit scoring model
        Combines satellite + behavior into repayment probability
        """
        
        # Feature weights (in production, use trained LightGBM)
        score = 0.5  # Base score
        
        # Satellite signals (40% weight)
        score += satellite_features.get("ndvi_trend_90d", 0) * 0.15
        score += satellite_features.get("soil_moisture_zscore", 0) * 0.10
        score += min(0.15, satellite_features.get("rainfall_30d", 100) / 1000.0)
        score -= satellite_features.get("drought_flag", 0) * 0.15
        
        # Behavioral signals (40% weight)
        score += min(0.15, behavior_features.get("ussd_engagement_count_90d", 0) / 100.0)
        score += min(0.10, behavior_features.get("mpesa_txn_count_90d", 0) / 200.0)
        score += behavior_features.get("cooperative_member", 0) * 0.10
        score += min(0.05, behavior_features.get("account_age_days", 0) / 3650.0)
        
        # Yield potential (10% weight)
        score += min(0.10, yield_estimate / 20.0)
        
        # Fraud penalty (10% weight)
        score -= fraud_score * 0.20
        
        # Clamp to [0, 1]
        return max(0.0, min(1.0, score))
    
    def _generate_loan_recommendation(
        self,
        credit_score: float,
        fraud_score: float,
        yield_estimate: float,
        crop_type: str
    ) -> Dict[str, Any]:
        """
        Convert credit score to loan offer
        """
        
        if fraud_score > 0.6:
            return {
                "approved": False,
                "reason": "Location verification required",
                "alternative": "Visit agent for verification",
                "microloan_available": 5000
            }
        
        if credit_score >= 0.80:
            return {
                "approved": True,
                "amount_ksh": 50000,
                "interest_rate": 8.0,
                "term_months": 6,
                "monthly_payment": 8800,
                "confidence": "High"
            }
        
        elif credit_score >= 0.60:
            return {
                "approved": True,
                "amount_ksh": 30000,
                "interest_rate": 10.0,
                "term_months": 4,
                "monthly_payment": 7875,
                "confidence": "Medium"
            }
        
        elif credit_score >= 0.40:
            return {
                "approved": True,
                "amount_ksh": 10000,
                "interest_rate": 12.0,
                "term_months": 3,
                "monthly_payment": 3533,
                "confidence": "Low",
                "requires": "M-Pesa deposit or cooperative guarantee"
            }
        
        else:
            return {
                "approved": False,
                "reason": "Credit score too low",
                "alternative": "Complete 2 training sessions to improve score",
                "savings_plan_available": True
            }
    
    def _explain_score(
        self,
        satellite_features: Dict[str, float],
        behavior_features: Dict[str, float]
    ) -> List[Dict[str, Any]]:
        """
        SHAP-like explanation of top factors
        """
        
        factors = []
        
        # Compute contributions (simplified SHAP)
        ndvi_contrib = satellite_features.get("ndvi_trend_90d", 0) * 0.15
        moisture_contrib = satellite_features.get("soil_moisture_zscore", 0) * 0.10
        engagement_contrib = min(0.15, behavior_features.get("ussd_engagement_count_90d", 0) / 100.0)
        mpesa_contrib = min(0.10, behavior_features.get("mpesa_txn_count_90d", 0) / 200.0)
        coop_contrib = behavior_features.get("cooperative_member", 0) * 0.10
        
        all_factors = [
            {"name": "NDVI Trend", "impact": ndvi_contrib, "value": satellite_features.get("ndvi_trend_90d", 0)},
            {"name": "Soil Moisture", "impact": moisture_contrib, "value": satellite_features.get("soil_moisture", 0)},
            {"name": "USSD Engagement", "impact": engagement_contrib, "value": behavior_features.get("ussd_engagement_count_90d", 0)},
            {"name": "M-Pesa Activity", "impact": mpesa_contrib, "value": behavior_features.get("mpesa_txn_count_90d", 0)},
            {"name": "Cooperative Member", "impact": coop_contrib, "value": behavior_features.get("cooperative_member", 0)}
        ]
        
        # Sort by absolute impact
        all_factors.sort(key=lambda x: abs(x["impact"]), reverse=True)
        
        return all_factors[:3]  # Top 3
    
    def _classify_risk(self, credit_score: float) -> str:
        """Classify risk level"""
        if credit_score >= 0.75:
            return "Low Risk"
        elif credit_score >= 0.50:
            return "Medium Risk"
        else:
            return "High Risk"
    
    def _get_fallback_satellite_features(self) -> Dict[str, float]:
        """Fallback synthetic data if NASA API fails"""
        return {
            "soil_moisture": 0.28,
            "soil_moisture_zscore": 0.15,
            "rainfall_30d": 145.0,
            "rainfall_90d": 380.0,
            "et_30d": 4.2,
            "temp_avg": 24.5,
            "humidity_avg": 68.0,
            "ndvi_mean_90d": 0.62,
            "ndvi_trend_90d": 0.02,
            "drought_flag": 0
        }
    
    def health_check(self) -> str:
        """Service health check"""
        return "healthy"
