"""
Cooperative/Community Models
Research shows Kenya's success = cooperatives
"""

from sqlalchemy import Column, String, Integer, Float, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class Cooperative(Base):
    """Cooperative/Chama model"""
    __tablename__ = "cooperatives"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200), nullable=False)
    county = Column(String(50), nullable=False)
    total_members = Column(Integer, default=0)
    total_hectares = Column(Float, default=0.0)
    avg_sustainability_score = Column(Float, default=0.0)
    chama_balance_kes = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    members = relationship("CooperativeMember", back_populates="cooperative")
    resources = relationship("CooperativeResource", back_populates="cooperative")
    activities = relationship("CooperativeActivity", back_populates="cooperative")

class CooperativeMember(Base):
    """Cooperative member model"""
    __tablename__ = "cooperative_members"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    cooperative_id = Column(String, ForeignKey("cooperatives.id"), nullable=False)
    farmer_id = Column(String, ForeignKey("farmers.id"), nullable=False)
    role = Column(String(50), default="member")  # member, leader, treasurer, secretary
    joined_at = Column(DateTime, default=datetime.utcnow)
    contribution_kes = Column(Float, default=0.0)
    sustainability_score = Column(Float, default=0.0)
    
    # Relationships
    cooperative = relationship("Cooperative", back_populates="members")
    farmer = relationship("Farmer")

class CooperativeResource(Base):
    """Shared resources within cooperative"""
    __tablename__ = "cooperative_resources"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    cooperative_id = Column(String, ForeignKey("cooperatives.id"), nullable=False)
    resource_type = Column(String(100), nullable=False)  # water, equipment, seeds, transport
    name = Column(String(200), nullable=False)
    description = Column(Text)
    quantity = Column(Float, default=1.0)
    unit = Column(String(50))  # liters, pieces, kg, etc.
    cost_kes = Column(Float, default=0.0)
    availability_status = Column(String(50), default="available")  # available, in_use, maintenance
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    cooperative = relationship("Cooperative", back_populates="resources")

class CooperativeActivity(Base):
    """Cooperative activities and events"""
    __tablename__ = "cooperative_activities"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    cooperative_id = Column(String, ForeignKey("cooperatives.id"), nullable=False)
    activity_type = Column(String(100), nullable=False)  # meeting, training, market_day, harvest
    title = Column(String(200), nullable=False)
    description = Column(Text)
    scheduled_date = Column(DateTime)
    location = Column(String(200))
    participants_count = Column(Integer, default=0)
    status = Column(String(50), default="scheduled")  # scheduled, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    cooperative = relationship("Cooperative", back_populates="activities")

class CountyLeaderboard(Base):
    """County-level leaderboards for competition"""
    __tablename__ = "county_leaderboards"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    county = Column(String(50), nullable=False)
    metric_type = Column(String(100), nullable=False)  # sustainability, yield, points, carbon
    period = Column(String(50), nullable=False)  # monthly, quarterly, yearly
    rank = Column(Integer, nullable=False)
    cooperative_id = Column(String, ForeignKey("cooperatives.id"), nullable=False)
    score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    cooperative = relationship("Cooperative")

class ResourceSharing(Base):
    """Resource sharing between cooperatives"""
    __tablename__ = "resource_sharing"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    from_cooperative_id = Column(String, ForeignKey("cooperatives.id"), nullable=False)
    to_cooperative_id = Column(String, ForeignKey("cooperatives.id"), nullable=False)
    resource_type = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String(50))
    cost_kes = Column(Float, default=0.0)
    sharing_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="pending")  # pending, approved, completed, cancelled
    notes = Column(Text)
    
    # Relationships
    from_cooperative = relationship("Cooperative", foreign_keys=[from_cooperative_id])
    to_cooperative = relationship("Cooperative", foreign_keys=[to_cooperative_id])
