from database import engine, SessionLocal, create_tables
from models.farmer import Base, Farmer, Farm, FarmActivity
from services.farmer_service import FarmerService
from datetime import datetime, timedelta
import random

def seed_database():
    """Seed the database with sample farmers and farms"""
    
    # Create tables with new schema
    create_tables()
    
    db = SessionLocal()
    farmer_service = FarmerService(db)
    
    try:
        # Sample farmers data
        farmers_data = [
            {
                "phone_number": "+254712345678",
                "name": "John Mwangi",
                "email": "john.mwangi@example.com",
                "location": "Nakuru County",
                "language": "en",
                "home_latitude": -1.2921,
                "home_longitude": 36.8219,
                "home_location_name": "Nairobi",
                "is_verified": True
            },
            {
                "phone_number": "+254723456789",
                "name": "Mary Wanjiku",
                "email": "mary.wanjiku@example.com",
                "location": "Kiambu County",
                "language": "sw",
                "home_latitude": -1.2921,
                "home_longitude": 36.8219,
                "home_location_name": "Nairobi",
                "is_verified": True
            },
            {
                "phone_number": "+254734567890",
                "name": "Peter Kiprop",
                "email": "peter.kiprop@example.com",
                "location": "Uasin Gishu County",
                "language": "en",
                "home_latitude": -1.2921,
                "home_longitude": 36.8219,
                "home_location_name": "Nairobi",
                "is_verified": True
            },
            {
                "phone_number": "+254745678901",
                "name": "Grace Akinyi",
                "email": "grace.akinyi@example.com",
                "location": "Kisumu County",
                "language": "sw",
                "home_latitude": -1.2921,
                "home_longitude": 36.8219,
                "home_location_name": "Nairobi",
                "is_verified": True
            },
            {
                "phone_number": "+254756789012",
                "name": "David Kimani",
                "email": "david.kimani@example.com",
                "location": "Machakos County",
                "language": "en",
                "home_latitude": -1.2921,
                "home_longitude": 36.8219,
                "home_location_name": "Nairobi",
                "is_verified": True
            }
        ]
        
        # Sample farms data with realistic Kenyan coordinates
        farms_data = [
            # John Mwangi's farms
            {
                "farmer_phone": "+254712345678",
                "name": "Mwangi Onion Farm",
                "location_name": "Naivasha",
                "latitude": -0.7172,
                "longitude": 36.4306,
                "size_acres": 5.0,
                "primary_crop": "onions",
                "soil_type": "volcanic",
                "irrigation_type": "drip"
            },
            {
                "farmer_phone": "+254712345678",
                "name": "Mwangi Apiary Site",
                "location_name": "Naivasha",
                "latitude": -0.7200,
                "longitude": 36.4400,
                "size_acres": 2.0,
                "primary_crop": "beekeeping",
                "soil_type": "volcanic",
                "irrigation_type": "rain-fed"
            },
            
            # Mary Wanjiku's farms
            {
                "farmer_phone": "+254723456789",
                "name": "Wanjiku Mixed Farm",
                "location_name": "Thika",
                "latitude": -1.0333,
                "longitude": 37.0833,
                "size_acres": 8.0,
                "primary_crop": "maize",
                "soil_type": "red soil",
                "irrigation_type": "sprinkler"
            },
            
            # Peter Kiprop's farms
            {
                "farmer_phone": "+254734567890",
                "name": "Kiprop Wheat Farm",
                "location_name": "Eldoret",
                "latitude": 0.5167,
                "longitude": 35.2833,
                "size_acres": 15.0,
                "primary_crop": "wheat",
                "soil_type": "black cotton",
                "irrigation_type": "rain-fed"
            },
            {
                "farmer_phone": "+254734567890",
                "name": "Kiprop Apiary",
                "location_name": "Eldoret",
                "latitude": 0.5200,
                "longitude": 35.2900,
                "size_acres": 3.0,
                "primary_crop": "beekeeping",
                "soil_type": "black cotton",
                "irrigation_type": "rain-fed"
            },
            
            # Grace Akinyi's farms
            {
                "farmer_phone": "+254745678901",
                "name": "Akinyi Rice Farm",
                "location_name": "Kisumu",
                "latitude": -0.0917,
                "longitude": 34.7681,
                "size_acres": 12.0,
                "primary_crop": "rice",
                "soil_type": "clay",
                "irrigation_type": "flood"
            },
            
            # David Kimani's farms
            {
                "farmer_phone": "+254756789012",
                "name": "Kimani Horticulture",
                "location_name": "Machakos",
                "latitude": -1.5167,
                "longitude": 37.2667,
                "size_acres": 4.0,
                "primary_crop": "tomatoes",
                "soil_type": "red soil",
                "irrigation_type": "drip"
            }
        ]
        
        # Create farmers
        created_farmers = {}
        for farmer_data in farmers_data:
            farmer = farmer_service.create_farmer(**farmer_data)
            created_farmers[farmer.phone_number] = farmer
            print(f"Created farmer: {farmer.name} ({farmer.phone_number})")
        
        # Create farms
        for farm_data in farms_data:
            farmer_phone = farm_data.pop("farmer_phone")
            farmer = created_farmers.get(farmer_phone)
            if farmer:
                farm = farmer_service.create_farm(
                    farmer_id=farmer.id,
                    **farm_data
                )
                print(f"Created farm: {farm.name} for {farmer.name}")
                
                # Add some sample activities
                activities = [
                    {
                        "activity_type": "planting",
                        "crop_type": farm.primary_crop,
                        "date": datetime.now() - timedelta(days=30),
                        "notes": f"Planted {farm.primary_crop} on {farm.name}"
                    },
                    {
                        "activity_type": "irrigation",
                        "crop_type": farm.primary_crop,
                        "date": datetime.now() - timedelta(days=15),
                        "notes": f"Applied irrigation on {farm.name}"
                    },
                    {
                        "activity_type": "fertilizer_application",
                        "crop_type": farm.primary_crop,
                        "date": datetime.now() - timedelta(days=7),
                        "notes": f"Applied fertilizer on {farm.name}"
                    }
                ]
                
                for activity_data in activities:
                    farmer_service.create_farm_activity(
                        farm_id=farm.id,
                        **activity_data
                    )
        
        print(f"\n✅ Database seeded successfully!")
        print(f"📊 Created {len(farmers_data)} farmers and {len(farms_data)} farms")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
