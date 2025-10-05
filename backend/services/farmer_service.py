from sqlalchemy.orm import Session
from models.farmer import Farmer, Farm, FarmActivity, FarmerSession
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import secrets
import hashlib
import random

class FarmerService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_farmer(self, phone_number: str, name: str, email: Optional[str] = None, 
                     location: Optional[str] = None, language: str = "en", 
                     home_latitude: Optional[float] = None, home_longitude: Optional[float] = None,
                     home_location_name: Optional[str] = None, is_verified: bool = False) -> Farmer:
        """Create a new farmer"""
        farmer = Farmer(
            phone_number=phone_number,
            name=name,
            email=email,
            location=location,
            language=language,
            home_latitude=home_latitude,
            home_longitude=home_longitude,
            home_location_name=home_location_name,
            is_verified=is_verified
        )
        self.db.add(farmer)
        self.db.commit()
        self.db.refresh(farmer)
        return farmer
    
    def get_farmer_by_phone(self, phone_number: str) -> Optional[Farmer]:
        """Get farmer by phone number"""
        return self.db.query(Farmer).filter(Farmer.phone_number == phone_number).first()
    
    def get_farmer_by_id(self, farmer_id: int) -> Optional[Farmer]:
        """Get farmer by ID"""
        return self.db.query(Farmer).filter(Farmer.id == farmer_id).first()
    
    def authenticate_farmer(self, phone_number: str) -> Optional[Farmer]:
        """Authenticate farmer by phone number (simplified for demo)"""
        farmer = self.get_farmer_by_phone(phone_number)
        if farmer and farmer.is_active:
            return farmer
        return None
    
    def create_farm(self, farmer_id: int, name: str, latitude: float, longitude: float,
                   location_name: Optional[str] = None, size_acres: Optional[float] = None,
                   primary_crop: Optional[str] = None, soil_type: Optional[str] = None,
                   irrigation_type: Optional[str] = None) -> Farm:
        """Create a new farm for a farmer"""
        farm = Farm(
            farmer_id=farmer_id,
            name=name,
            location_name=location_name,
            latitude=latitude,
            longitude=longitude,
            size_acres=size_acres,
            primary_crop=primary_crop,
            soil_type=soil_type,
            irrigation_type=irrigation_type
        )
        self.db.add(farm)
        self.db.commit()
        self.db.refresh(farm)
        return farm
    
    def get_farmer_farms(self, farmer_id: int) -> List[Farm]:
        """Get all farms for a farmer"""
        return self.db.query(Farm).filter(
            Farm.farmer_id == farmer_id,
            Farm.is_active == True
        ).all()
    
    def get_farm_by_id(self, farm_id: int) -> Optional[Farm]:
        """Get farm by ID"""
        return self.db.query(Farm).filter(Farm.id == farm_id).first()
    
    def create_farm_activity(self, farm_id: int, activity_type: str, date: datetime,
                           crop_type: Optional[str] = None, notes: Optional[str] = None) -> FarmActivity:
        """Create a farm activity record"""
        activity = FarmActivity(
            farm_id=farm_id,
            activity_type=activity_type,
            crop_type=crop_type,
            date=date,
            notes=notes
        )
        self.db.add(activity)
        self.db.commit()
        self.db.refresh(activity)
        return activity
    
    def get_farm_activities(self, farm_id: int, limit: int = 10) -> List[FarmActivity]:
        """Get recent activities for a farm"""
        return self.db.query(FarmActivity).filter(
            FarmActivity.farm_id == farm_id
        ).order_by(FarmActivity.date.desc()).limit(limit).all()
    
    def create_session(self, farmer_id: int, device_type: str = "ussd") -> str:
        """Create a new session for a farmer"""
        # Generate secure session token
        session_token = secrets.token_urlsafe(32)
        
        # Set expiration (24 hours for demo)
        expires_at = datetime.utcnow() + timedelta(hours=24)
        
        session = FarmerSession(
            farmer_id=farmer_id,
            session_token=session_token,
            device_type=device_type,
            expires_at=expires_at
        )
        self.db.add(session)
        self.db.commit()
        return session_token
    
    def validate_session(self, session_token: str) -> Optional[Farmer]:
        """Validate session token and return farmer"""
        session = self.db.query(FarmerSession).filter(
            FarmerSession.session_token == session_token,
            FarmerSession.is_active == True,
            FarmerSession.expires_at > datetime.utcnow()
        ).first()
        
        if session:
            return self.get_farmer_by_id(session.farmer_id)
        return None
    
    def deactivate_session(self, session_token: str):
        """Deactivate a session"""
        session = self.db.query(FarmerSession).filter(
            FarmerSession.session_token == session_token
        ).first()
        if session:
            session.is_active = False
            self.db.commit()
    
    def get_farmer_summary(self, farmer_id: int) -> Dict[str, Any]:
        """Get comprehensive farmer summary"""
        farmer = self.get_farmer_by_id(farmer_id)
        if not farmer:
            return {}
        
        farms = self.get_farmer_farms(farmer_id)
        
        return {
            "farmer": {
                "id": farmer.id,
                "name": farmer.name,
                "phone": farmer.phone_number,
                "location": farmer.location,
                "language": farmer.language
            },
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
            ],
            "total_farms": len(farms),
            "total_acres": sum(farm.size_acres or 0 for farm in farms)
        }
    
    def generate_verification_code(self) -> str:
        """Generate a 6-digit verification code"""
        return str(random.randint(100000, 999999))
    
    def send_verification_code(self, phone_number: str) -> Dict[str, Any]:
        """Send SMS verification code to farmer"""
        farmer = self.get_farmer_by_phone(phone_number)
        if not farmer:
            return {"success": False, "message": "Farmer not found"}
        
        # Generate verification code
        verification_code = self.generate_verification_code()
        farmer.verification_code = verification_code
        farmer.verification_expires_at = datetime.utcnow() + timedelta(minutes=10)
        
        self.db.commit()
        
        # TODO: Send actual SMS via Africa's Talking
        # For now, return the code for testing
        return {
            "success": True, 
            "message": f"Verification code sent to {phone_number}",
            "code": verification_code,  # Remove this in production
            "expires_in": 10
        }
    
    def verify_code(self, phone_number: str, code: str) -> Dict[str, Any]:
        """Verify SMS code"""
        farmer = self.get_farmer_by_phone(phone_number)
        if not farmer:
            return {"success": False, "message": "Farmer not found"}
        
        if not farmer.verification_code or not farmer.verification_expires_at:
            return {"success": False, "message": "No verification code found"}
        
        if datetime.utcnow() > farmer.verification_expires_at:
            return {"success": False, "message": "Verification code expired"}
        
        if farmer.verification_code != code:
            return {"success": False, "message": "Invalid verification code"}
        
        # Mark as verified
        farmer.is_verified = True
        farmer.verification_code = None
        farmer.verification_expires_at = None
        
        self.db.commit()
        
        return {"success": True, "message": "Phone number verified successfully"}
    
    def update_home_location(self, farmer_id: int, latitude: float, longitude: float, 
                           location_name: str) -> Dict[str, Any]:
        """Update farmer's home location"""
        farmer = self.db.query(Farmer).filter(Farmer.id == farmer_id).first()
        if not farmer:
            return {"success": False, "message": "Farmer not found"}
        
        farmer.home_latitude = latitude
        farmer.home_longitude = longitude
        farmer.home_location_name = location_name
        
        self.db.commit()
        
        return {"success": True, "message": "Home location updated successfully"}
    
    def update_language(self, farmer_id: int, language: str) -> Dict[str, Any]:
        """Update farmer's language preference"""
        if language not in ["en", "sw", "kik"]:
            return {"success": False, "message": "Invalid language. Use: en, sw, kik"}
        
        farmer = self.db.query(Farmer).filter(Farmer.id == farmer_id).first()
        if not farmer:
            return {"success": False, "message": "Farmer not found"}
        
        farmer.language = language
        self.db.commit()
        
        return {"success": True, "message": f"Language updated to {language}"}
    
    def get_localized_text(self, language: str, key: str) -> str:
        """Get localized text for different languages"""
        translations = {
            "en": {
                "welcome": "Welcome to EO Farm Navigators!",
                "hello": "Hello",
                "weather": "Weather Forecast",
                "advice": "Farming Advice", 
                "prices": "Market Prices",
                "farm_info": "My Farm Info",
                "manage_farms": "Manage Farms",
                "help": "Help",
                "enter_verification": "Enter verification code:",
                "code_sent": "Verification code sent to your phone",
                "invalid_code": "Invalid code. Try again:",
                "verified": "Phone verified successfully!",
                "set_home": "Set your home location",
                "set_language": "Choose language: 1-English 2-Swahili 3-Kikuyu"
            },
            "sw": {
                "welcome": "Karibu EO Farm Navigators!",
                "hello": "Hujambo",
                "weather": "Hali ya Hewa",
                "advice": "Ushauri wa Kilimo",
                "prices": "Bei za Soko",
                "farm_info": "Taarifa ya Shamba",
                "manage_farms": "Simamia Mashamba",
                "help": "Msaada",
                "enter_verification": "Ingiza nambari ya uthibitisho:",
                "code_sent": "Nambari ya uthibitisho imetumwa kwenye simu yako",
                "invalid_code": "Nambari si sahihi. Jaribu tena:",
                "verified": "Simu imethibitishwa!",
                "set_home": "Weka eneo la nyumbani",
                "set_language": "Chagua lugha: 1-Kiingereza 2-Kiswahili 3-Kikuyu"
            },
            "kik": {
                "welcome": "Wamukire EO Farm Navigators!",
                "hello": "Wamukire",
                "weather": "Hali ya Riu",
                "advice": "Uthuthi wa Kurima",
                "prices": "Mari ya Githaka",
                "farm_info": "Uthuthi wa Githaka",
                "manage_farms": "Thutha Mashamba",
                "help": "Uthuthi",
                "enter_verification": "Hingia nambari ya kwongera:",
                "code_sent": "Nambari ya kwongera iriathimithwo kwa simu yaku",
                "invalid_code": "Nambari ti ya kwongera. Ria tena:",
                "verified": "Simu iriathimithwo!",
                "set_home": "Hingia kwa nyumba",
                "set_language": "Hingia lugha: 1-Kiingereza 2-Kiswahili 3-Kikuyu"
            }
        }
        
        return translations.get(language, translations["en"]).get(key, key)
