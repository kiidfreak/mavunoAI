#!/usr/bin/env python3
"""
Add a new farmer to the database
"""

from database import SessionLocal
from services.farmer_service import FarmerService

def add_farmer():
    db = SessionLocal()
    farmer_service = FarmerService(db)
    
    try:
        # Add the new farmer
        farmer = farmer_service.create_farmer(
            phone_number="+254115568694",
            name="Test Farmer",
            email="test.farmer@example.com",
            location="Nairobi County",
            language="en"
        )
        
        print(f"✅ Created farmer: {farmer.name} ({farmer.phone_number})")
        
        # Add a farm for this farmer
        farm = farmer_service.create_farm(
            farmer_id=farmer.id,
            name="Test Farm",
            latitude=-1.2921,
            longitude=36.8219,
            location_name="Nairobi",
            size_acres=2.0,
            primary_crop="maize",
            soil_type="red soil",
            irrigation_type="rain-fed"
        )
        
        print(f"✅ Created farm: {farm.name} for {farmer.name}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    add_farmer()
