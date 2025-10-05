#!/usr/bin/env python3
"""
Add the test farmer +254115568694 to the database
"""

from database import SessionLocal
from services.farmer_service import FarmerService

def add_test_farmers():
    db = SessionLocal()
    farmer_service = FarmerService(db)
    
    try:
        # Get or create Test Farmer 1 (+254115568694)
        farmer1 = farmer_service.get_farmer_by_phone("+254115568694")
        if not farmer1:
            farmer1 = farmer_service.create_farmer(
                phone_number="+254115568694",
                name="Test Farmer",
                email="test.farmer@example.com",
                location="Nairobi County",
                language="en",
                home_latitude=-1.2921,
                home_longitude=36.8219,
                home_location_name="Nairobi",
                is_verified=True
            )
            print(f"✅ Created farmer: {farmer1.name} ({farmer1.phone_number})")
        else:
            print(f"✅ Found existing farmer: {farmer1.name} ({farmer1.phone_number})")
        
        # Add multiple farms for Test Farmer 1 (Onion Specialist)
        farm1a = farmer_service.create_farm(
            farmer_id=farmer1.id,
            name="Mwangi Onion Farm",
            latitude=-1.2921,
            longitude=36.8219,
            location_name="Nairobi",
            size_acres=2.5,
            primary_crop="onions",
            soil_type="red soil",
            irrigation_type="drip"
        )
        
        farm1b = farmer_service.create_farm(
            farmer_id=farmer1.id,
            name="Mwangi Onion Nursery",
            latitude=-1.2921,
            longitude=36.8219,
            location_name="Nairobi",
            size_acres=0.5,
            primary_crop="onions",
            soil_type="red soil",
            irrigation_type="greenhouse"
        )
        
        print(f"✅ Created farms: {farm1a.name} and {farm1b.name} for {farmer1.name} (Onion Specialist)")
        
        # Get or create Test Farmer 2 (+254111548797) - Kikuyu language, Loresho location (Apiary Specialist)
        farmer2 = farmer_service.get_farmer_by_phone("+254111548797")
        if not farmer2:
            farmer2 = farmer_service.create_farmer(
                phone_number="+254111548797",
                name="Test2",
                email="test2.farmer@example.com",
                location="Loresho KARLO",
                language="kik",
                home_latitude=-1.2921,
                home_longitude=36.8219,
                home_location_name="Loresho KARLO",
                is_verified=True
            )
            print(f"✅ Created farmer: {farmer2.name} ({farmer2.phone_number}) - Kikuyu (Apiary Specialist)")
        else:
            print(f"✅ Found existing farmer: {farmer2.name} ({farmer2.phone_number}) - Kikuyu (Apiary Specialist)")
        
        # Add multiple farms for Test Farmer 2 (Apiary Specialist)
        farm2a = farmer_service.create_farm(
            farmer_id=farmer2.id,
            name="Test2 Main Apiary",
            latitude=-1.2921,
            longitude=36.8219,
            location_name="Loresho KARLO",
            size_acres=5.0,
            primary_crop="honey",
            soil_type="black cotton soil",
            irrigation_type="natural"
        )
        
        farm2b = farmer_service.create_farm(
            farmer_id=farmer2.id,
            name="Test2 Pollination Site",
            latitude=-1.2921,
            longitude=36.8219,
            location_name="Loresho KARLO",
            size_acres=3.0,
            primary_crop="honey",
            soil_type="black cotton soil",
            irrigation_type="natural"
        )
        
        farm2c = farmer_service.create_farm(
            farmer_id=farmer2.id,
            name="Test2 Nectar Garden",
            latitude=-1.2921,
            longitude=36.8219,
            location_name="Loresho KARLO",
            size_acres=2.0,
            primary_crop="honey",
            soil_type="black cotton soil",
            irrigation_type="natural"
        )
        
        print(f"✅ Created farms: {farm2a.name}, {farm2b.name}, and {farm2c.name} for {farmer2.name} (Apiary Specialist)")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    add_test_farmers()
