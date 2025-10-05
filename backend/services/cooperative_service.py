"""
Cooperative/Community Service
Research shows Kenya's success = cooperatives
Multi-player features: leaderboards, resource sharing, collective bargaining
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from models.cooperative import (
    Cooperative, CooperativeMember, CooperativeResource, 
    CooperativeActivity, CountyLeaderboard, ResourceSharing
)
from models.farmer import Farmer

class CooperativeService:
    """Service for cooperative and community features"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
    
    def create_cooperative(self, name: str, county: str, 
                          founder_farmer_id: str) -> Dict:
        """Create a new cooperative"""
        cooperative = Cooperative(
            name=name,
            county=county,
            total_members=1,
            chama_balance_kes=0.0
        )
        
        self.db.add(cooperative)
        self.db.flush()  # Get the ID
        
        # Add founder as member
        member = CooperativeMember(
            cooperative_id=cooperative.id,
            farmer_id=founder_farmer_id,
            role="leader",
            contribution_kes=0.0
        )
        
        self.db.add(member)
        self.db.commit()
        
        return {
            'cooperative_id': cooperative.id,
            'name': cooperative.name,
            'county': cooperative.county,
            'total_members': 1,
            'chama_balance_kes': 0.0,
            'created_at': cooperative.created_at.isoformat()
        }
    
    def join_cooperative(self, cooperative_id: str, farmer_id: str, 
                        contribution_kes: float = 0.0) -> Dict:
        """Farmer joins a cooperative"""
        # Check if already a member
        existing_member = self.db.query(CooperativeMember).filter(
            CooperativeMember.cooperative_id == cooperative_id,
            CooperativeMember.farmer_id == farmer_id
        ).first()
        
        if existing_member:
            return {'error': 'Farmer is already a member of this cooperative'}
        
        # Add member
        member = CooperativeMember(
            cooperative_id=cooperative_id,
            farmer_id=farmer_id,
            contribution_kes=contribution_kes
        )
        
        self.db.add(member)
        
        # Update cooperative member count and balance
        cooperative = self.db.query(Cooperative).filter(
            Cooperative.id == cooperative_id
        ).first()
        
        if cooperative:
            cooperative.total_members += 1
            cooperative.chama_balance_kes += contribution_kes
        
        self.db.commit()
        
        return {
            'cooperative_id': cooperative_id,
            'farmer_id': farmer_id,
            'contribution_kes': contribution_kes,
            'joined_at': member.joined_at.isoformat()
        }
    
    def get_cooperative_dashboard(self, cooperative_id: str) -> Dict:
        """Get comprehensive cooperative dashboard"""
        cooperative = self.db.query(Cooperative).filter(
            Cooperative.id == cooperative_id
        ).first()
        
        if not cooperative:
            return {'error': 'Cooperative not found'}
        
        # Get members with their sustainability scores
        members = self.db.query(CooperativeMember, Farmer).join(
            Farmer, CooperativeMember.farmer_id == Farmer.id
        ).filter(CooperativeMember.cooperative_id == cooperative_id).all()
        
        # Calculate average sustainability score
        total_score = sum(member.sustainability_score for member, _ in members)
        avg_sustainability = total_score / len(members) if members else 0.0
        
        # Get recent activities
        recent_activities = self.db.query(CooperativeActivity).filter(
            CooperativeActivity.cooperative_id == cooperative_id
        ).order_by(desc(CooperativeActivity.created_at)).limit(5).all()
        
        # Get available resources
        available_resources = self.db.query(CooperativeResource).filter(
            CooperativeResource.cooperative_id == cooperative_id,
            CooperativeResource.availability_status == "available"
        ).all()
        
        # Get county ranking
        county_ranking = self.get_county_ranking(cooperative.county, "sustainability")
        
        return {
            'cooperative': {
                'id': cooperative.id,
                'name': cooperative.name,
                'county': cooperative.county,
                'total_members': cooperative.total_members,
                'total_hectares': cooperative.total_hectares,
                'avg_sustainability_score': round(avg_sustainability, 1),
                'chama_balance_kes': cooperative.chama_balance_kes
            },
            'members': [
                {
                    'farmer_id': farmer.id,
                    'name': farmer.name,
                    'role': member.role,
                    'sustainability_score': member.sustainability_score,
                    'contribution_kes': member.contribution_kes,
                    'joined_at': member.joined_at.isoformat()
                }
                for member, farmer in members
            ],
            'recent_activities': [
                {
                    'id': activity.id,
                    'type': activity.activity_type,
                    'title': activity.title,
                    'scheduled_date': activity.scheduled_date.isoformat() if activity.scheduled_date else None,
                    'status': activity.status
                }
                for activity in recent_activities
            ],
            'available_resources': [
                {
                    'id': resource.id,
                    'type': resource.resource_type,
                    'name': resource.name,
                    'quantity': resource.quantity,
                    'unit': resource.unit,
                    'cost_kes': resource.cost_kes
                }
                for resource in available_resources
            ],
            'county_ranking': county_ranking
        }
    
    def get_county_ranking(self, county: str, metric_type: str = "sustainability") -> Dict:
        """Get county leaderboard ranking"""
        # Get top cooperatives in county by metric
        rankings = self.db.query(Cooperative).filter(
            Cooperative.county == county
        ).order_by(desc(Cooperative.avg_sustainability_score)).limit(10).all()
        
        return {
            'county': county,
            'metric': metric_type,
            'rankings': [
                {
                    'rank': i + 1,
                    'cooperative_id': coop.id,
                    'name': coop.name,
                    'score': coop.avg_sustainability_score,
                    'members': coop.total_members
                }
                for i, coop in enumerate(rankings)
            ],
            'total_cooperatives': len(rankings)
        }
    
    def pool_resources(self, cooperative_id: str, resource_type: str, 
                      quantity: float, unit: str, cost_kes: float) -> Dict:
        """Pool resources within cooperative"""
        resource = CooperativeResource(
            cooperative_id=cooperative_id,
            resource_type=resource_type,
            quantity=quantity,
            unit=unit,
            cost_kes=cost_kes,
            availability_status="available"
        )
        
        self.db.add(resource)
        self.db.commit()
        
        return {
            'resource_id': resource.id,
            'cooperative_id': cooperative_id,
            'resource_type': resource_type,
            'quantity': quantity,
            'unit': unit,
            'cost_kes': cost_kes,
            'status': 'pooled'
        }
    
    def share_resource(self, from_cooperative_id: str, to_cooperative_id: str,
                      resource_type: str, quantity: float, unit: str, 
                      cost_kes: float = 0.0) -> Dict:
        """Share resources between cooperatives"""
        sharing = ResourceSharing(
            from_cooperative_id=from_cooperative_id,
            to_cooperative_id=to_cooperative_id,
            resource_type=resource_type,
            quantity=quantity,
            unit=unit,
            cost_kes=cost_kes,
            status="pending"
        )
        
        self.db.add(sharing)
        self.db.commit()
        
        return {
            'sharing_id': sharing.id,
            'from_cooperative_id': from_cooperative_id,
            'to_cooperative_id': to_cooperative_id,
            'resource_type': resource_type,
            'quantity': quantity,
            'unit': unit,
            'cost_kes': cost_kes,
            'status': 'pending'
        }
    
    def get_leaderboard(self, metric_type: str = "sustainability", 
                       period: str = "monthly") -> Dict:
        """Get county leaderboards for competition"""
        # Get all cooperatives ordered by metric
        cooperatives = self.db.query(Cooperative).order_by(
            desc(Cooperative.avg_sustainability_score)
        ).limit(20).all()
        
        return {
            'metric_type': metric_type,
            'period': period,
            'leaderboard': [
                {
                    'rank': i + 1,
                    'cooperative_id': coop.id,
                    'name': coop.name,
                    'county': coop.county,
                    'score': coop.avg_sustainability_score,
                    'members': coop.total_members,
                    'hectares': coop.total_hectares
                }
                for i, coop in enumerate(cooperatives)
            ],
            'total_cooperatives': len(cooperatives)
        }
    
    def create_activity(self, cooperative_id: str, activity_type: str,
                       title: str, description: str = None,
                       scheduled_date: datetime = None, location: str = None) -> Dict:
        """Create cooperative activity"""
        activity = CooperativeActivity(
            cooperative_id=cooperative_id,
            activity_type=activity_type,
            title=title,
            description=description,
            scheduled_date=scheduled_date,
            location=location
        )
        
        self.db.add(activity)
        self.db.commit()
        
        return {
            'activity_id': activity.id,
            'cooperative_id': cooperative_id,
            'type': activity_type,
            'title': title,
            'scheduled_date': scheduled_date.isoformat() if scheduled_date else None,
            'status': 'scheduled'
        }
    
    def get_peer_mentorship_matches(self, farmer_id: str) -> Dict:
        """Get peer mentorship matches based on complementary skills"""
        # Get farmer's profile
        farmer = self.db.query(Farmer).filter(Farmer.id == farmer_id).first()
        if not farmer:
            return {'error': 'Farmer not found'}
        
        # Find farmers with complementary skills in same county
        # This is a simplified matching algorithm
        potential_mentors = self.db.query(Farmer).filter(
            Farmer.county == farmer.county,
            Farmer.id != farmer_id
        ).limit(5).all()
        
        matches = []
        for mentor in potential_mentors:
            # Calculate compatibility score (simplified)
            compatibility_score = 75.0  # Mock score
            
            matches.append({
                'mentor_id': mentor.id,
                'mentor_name': mentor.name,
                'mentor_location': mentor.location,
                'compatibility_score': compatibility_score,
                'match_reason': 'Complementary farming practices',
                'available_for_mentorship': True
            })
        
        return {
            'farmer_id': farmer_id,
            'matches': matches,
            'total_matches': len(matches)
        }
