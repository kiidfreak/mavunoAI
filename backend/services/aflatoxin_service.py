"""
Aflatoxin Prevention Service
Critical for onion module - this saves lives
Based on research: 55% market contamination, 125 deaths in 2004
Temp >25°C + moisture = danger zone
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
import requests
import math

class AflatoxinService:
    """Service for aflatoxin risk assessment and prevention"""
    
    def __init__(self):
        self.nasa_api_key = "demo_key"  # Replace with actual NASA API key
        self.base_url = "https://appeears.earthdatacloud.nasa.gov/api"
    
    def check_aflatoxin_risk(self, farm_location: Dict[str, float], crop_stage: str) -> Dict:
        """
        Critical aflatoxin risk assessment based on research
        Based on research: 55% market contamination, 125 deaths in 2004
        Temp >25°C + moisture = danger zone
        
        Args:
            farm_location: {'lat': float, 'lon': float}
            crop_stage: 'pre-harvest', 'drying', 'storage', 'post-harvest'
        
        Returns:
            Dict with risk assessment and recommendations
        """
        # Get MODIS land surface temperature
        modis_temp = self._get_modis_lst(farm_location)
        
        # Get SMAP soil moisture
        smap_moisture = self._get_smap_surface(farm_location)
        
        # Calculate risk level
        risk_level = self._calculate_risk_level(modis_temp, smap_moisture, crop_stage)
        
        # Generate recommendations
        recommendations = self._generate_aflatoxin_recommendations(
            risk_level, modis_temp, smap_moisture, crop_stage
        )
        
        return {
            'farm_location': farm_location,
            'crop_stage': crop_stage,
            'risk_level': risk_level,
            'temperature_celsius': modis_temp,
            'soil_moisture': smap_moisture,
            'recommendations': recommendations,
            'research_context': {
                'market_contamination_rate': '55%',
                'historical_deaths': 125,
                'year': 2004,
                'critical_temp_threshold': 25,
                'data_sources': ['MODIS LST', 'SMAP Soil Moisture']
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def get_aflasafe_recommendations(self, farm_location: Dict[str, float], 
                                   farm_size_ha: float) -> Dict:
        """
        Get Aflasafe biocontrol recommendations
        KSh 400 per 2kg bag application
        """
        # Calculate required Aflasafe amount
        aflasafe_per_ha = 2.0  # kg per hectare
        total_aflasafe = farm_size_ha * aflasafe_per_ha
        cost_per_kg = 400  # KES
        total_cost = total_aflasafe * cost_per_kg
        
        # Get current risk level
        risk_assessment = self.check_aflatoxin_risk(farm_location, 'pre-harvest')
        
        return {
            'farm_size_ha': farm_size_ha,
            'aflasafe_required_kg': total_aflasafe,
            'cost_per_kg': cost_per_kg,
            'total_cost_kes': total_cost,
            'application_timing': 'Pre-harvest (2-3 weeks before)',
            'current_risk': risk_assessment['risk_level'],
            'recommendation': 'APPLY_AFLASAFE' if risk_assessment['risk_level'] in ['HIGH', 'CRITICAL'] else 'MONITOR',
            'benefits': {
                'contamination_reduction': '80-90%',
                'market_price_premium': '+15-20%',
                'health_protection': 'Prevents aflatoxin poisoning'
            }
        }
    
    def get_national_aflatoxin_impact(self) -> Dict:
        """
        Get national aflatoxin impact statistics
        Based on research data
        """
        return {
            'market_contamination': {
                'rate': '55%',
                'description': 'of maize samples contaminated'
            },
            'economic_impact': {
                'annual_losses': '6-7 million bags',
                'value_lost': 'KES 8-10 billion',
                'description': 'Annual economic losses from aflatoxin'
            },
            'health_impact': {
                'deaths_2004': 125,
                'affected_counties': ['Eastern', 'Central', 'Rift Valley'],
                'vulnerable_groups': ['Children', 'Elderly', 'Immunocompromised']
            },
            'prevention_effectiveness': {
                'aflasafe_reduction': '80-90%',
                'proper_drying': '60-70%',
                'early_harvest': '40-50%'
            }
        }
    
    def _get_modis_lst(self, location: Dict[str, float]) -> float:
        """Get MODIS land surface temperature (mock implementation)"""
        import random
        # Base temperature varies by latitude and season
        base_temp = 25 + (location['lat'] * 0.3)
        # Add seasonal variation
        seasonal_factor = 1 + 0.2 * math.sin(datetime.now().timetuple().tm_yday / 365.25 * 2 * math.pi)
        return round(base_temp * seasonal_factor + random.uniform(-2, 3), 1)
    
    def _get_smap_surface(self, location: Dict[str, float]) -> float:
        """Get SMAP soil moisture (mock implementation)"""
        import random
        # Soil moisture varies by location and recent rainfall
        base_moisture = 0.3 + (location['lat'] * 0.01)
        return round(base_moisture + random.uniform(-0.1, 0.2), 3)
    
    def _calculate_risk_level(self, temp: float, moisture: float, crop_stage: str) -> str:
        """
        Calculate aflatoxin risk level
        Critical factors: Temp >25°C + moisture + crop stage
        """
        # High risk conditions
        if temp > 25 and moisture > 0.4:
            if crop_stage in ['pre-harvest', 'drying']:
                return 'CRITICAL'
            elif crop_stage in ['storage', 'post-harvest']:
                return 'HIGH'
        
        # Medium risk conditions
        elif temp > 25 or moisture > 0.4:
            if crop_stage in ['pre-harvest', 'drying', 'storage']:
                return 'MEDIUM'
        
        # Low risk conditions
        elif temp <= 25 and moisture <= 0.4:
            return 'LOW'
        
        return 'MEDIUM'  # Default
    
    def _generate_aflatoxin_recommendations(self, risk_level: str, temp: float, 
                                          moisture: float, crop_stage: str) -> Dict:
        """Generate actionable aflatoxin prevention recommendations"""
        
        recommendations = {
            'immediate_action': '',
            'prevention_measures': [],
            'monitoring_schedule': '',
            'emergency_protocol': ''
        }
        
        if risk_level == 'CRITICAL':
            if crop_stage == 'pre-harvest':
                recommendations.update({
                    'immediate_action': 'HARVEST_IMMEDIATELY',
                    'prevention_measures': [
                        'Harvest within 24-48 hours',
                        'Apply Aflasafe biocontrol (KSh 400 per 2kg bag)',
                        'Ensure proper drying facilities are ready',
                        'Separate contaminated and clean grain'
                    ],
                    'monitoring_schedule': 'Daily temperature and moisture checks',
                    'emergency_protocol': 'Contact extension officer immediately'
                })
            elif crop_stage == 'drying':
                recommendations.update({
                    'immediate_action': 'EMERGENCY_DRYING',
                    'prevention_measures': [
                        'Increase drying temperature to 60-70°C',
                        'Improve air circulation',
                        'Reduce grain moisture to <13%',
                        'Apply Aflasafe if not already done'
                    ],
                    'monitoring_schedule': 'Every 2 hours during drying',
                    'emergency_protocol': 'Consider discarding heavily contaminated grain'
                })
        
        elif risk_level == 'HIGH':
            recommendations.update({
                'immediate_action': 'URGENT_PREVENTION',
                'prevention_measures': [
                    'Apply Aflasafe biocontrol immediately',
                    'Improve drying conditions',
                    'Monitor temperature and moisture closely',
                    'Consider early harvest if possible'
                ],
                'monitoring_schedule': 'Twice daily',
                'emergency_protocol': 'Prepare for emergency harvest if conditions worsen'
            })
        
        elif risk_level == 'MEDIUM':
            recommendations.update({
                'immediate_action': 'PREVENTIVE_MEASURES',
                'prevention_measures': [
                    'Apply Aflasafe as preventive measure',
                    'Ensure proper drying conditions',
                    'Monitor weather conditions',
                    'Plan harvest timing carefully'
                ],
                'monitoring_schedule': 'Daily',
                'emergency_protocol': 'Standard monitoring protocol'
            })
        
        else:  # LOW risk
            recommendations.update({
                'immediate_action': 'MONITOR',
                'prevention_measures': [
                    'Continue normal farming practices',
                    'Apply Aflasafe as preventive measure',
                    'Maintain good storage conditions',
                    'Regular quality checks'
                ],
                'monitoring_schedule': 'Weekly',
                'emergency_protocol': 'Standard protocol'
            })
        
        return recommendations

# Example usage for testing
if __name__ == "__main__":
    service = AflatoxinService()
    
    # Test location (Machakos, Kenya)
    test_location = {'lat': -1.2921, 'lon': 36.8219}
    
    # Test aflatoxin risk assessment
    risk_assessment = service.check_aflatoxin_risk(test_location, 'pre-harvest')
    print("Aflatoxin Risk Assessment:")
    print(f"Risk Level: {risk_assessment['risk_level']}")
    print(f"Temperature: {risk_assessment['temperature_celsius']}°C")
    print(f"Soil Moisture: {risk_assessment['soil_moisture']}")
    print(f"Action: {risk_assessment['recommendations']['immediate_action']}")
    
    # Test Aflasafe recommendations
    aflasafe_rec = service.get_aflasafe_recommendations(test_location, 2.5)
    print(f"\nAflasafe Recommendations:")
    print(f"Required: {aflasafe_rec['aflasafe_required_kg']} kg")
    print(f"Cost: {aflasafe_rec['total_cost_kes']} KES")
    print(f"Recommendation: {aflasafe_rec['recommendation']}")
