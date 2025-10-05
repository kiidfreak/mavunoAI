#!/usr/bin/env python3
"""
Test script for MavunoAI USSD service
Simulates Africa's Talking webhook calls
"""

import requests
import json

# Test the USSD service locally
def test_ussd_service():
    base_url = "http://localhost:5000"
    
    # Test 1: Initial menu (empty text)
    print("🧪 Testing USSD Service...")
    print("=" * 50)
    
    # Test initial menu
    print("\n1. Testing Initial Menu:")
    response = requests.post(f"{base_url}/ussd", data={
        "sessionId": "test_session_001",
        "phoneNumber": "+254712345678",
        "text": "",
        "serviceCode": "*384*717111#"
    })
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Test weather menu
    print("\n2. Testing Weather Menu:")
    response = requests.post(f"{base_url}/ussd", data={
        "sessionId": "test_session_001", 
        "phoneNumber": "+254712345678",
        "text": "1",
        "serviceCode": "*384*717111#"
    })
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Test farm management
    print("\n3. Testing Farm Management:")
    response = requests.post(f"{base_url}/ussd", data={
        "sessionId": "test_session_001",
        "phoneNumber": "+254712345678", 
        "text": "5",
        "serviceCode": "*384*717111#"
    })
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == "__main__":
    test_ussd_service()
