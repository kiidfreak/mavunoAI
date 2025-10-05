from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from typing import Optional

Base = declarative_base()

class Farmer(Base):
    __tablename__ = "farmers"
    
    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(15), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True)
    location = Column(String(100))  # County/District
    language = Column(String(10), default="en")  # en, sw, kik
    home_latitude = Column(Float)
    home_longitude = Column(Float)
    home_location_name = Column(String(200))
    is_verified = Column(Boolean, default=False)
    verification_code = Column(String(6))
    verification_expires_at = Column(DateTime)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    farms = relationship("Farm", back_populates="farmer", cascade="all, delete-orphan")
    sessions = relationship("FarmerSession", back_populates="farmer", cascade="all, delete-orphan")

class Farm(Base):
    __tablename__ = "farms"
    
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    name = Column(String(100), nullable=False)
    location_name = Column(String(100))  # Village/Area name
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    size_acres = Column(Float)
    primary_crop = Column(String(50))  # onions, maize, etc.
    soil_type = Column(String(50))
    irrigation_type = Column(String(50))  # drip, sprinkler, rain-fed
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    farmer = relationship("Farmer", back_populates="farms")
    activities = relationship("FarmActivity", back_populates="farm", cascade="all, delete-orphan")

class FarmActivity(Base):
    __tablename__ = "farm_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    activity_type = Column(String(50), nullable=False)  # planting, harvesting, irrigation, etc.
    crop_type = Column(String(50))
    date = Column(DateTime, nullable=False)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    farm = relationship("Farm", back_populates="activities")

class FarmerSession(Base):
    __tablename__ = "farmer_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    session_token = Column(String(100), unique=True, index=True)
    device_type = Column(String(20))  # ussd, whatsapp, web
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)
    
    # Relationships
    farmer = relationship("Farmer", back_populates="sessions")
