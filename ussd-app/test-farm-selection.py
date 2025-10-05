#!/usr/bin/env python3
"""
Test USSD Farm Selection Flow
"""

import requests
import json

def test_ussd_flow():
    """Test the complete USSD flow including farm selection"""
    
    base_url = "http://localhost:5000"
    session_id = "test_farm_selection_123"
    phone_number = "+254712345678"
    
    print("🧪 Testing USSD Farm Selection Flow...")
    print("=" * 50)
    
    # Step 1: Initial menu
    print("\n1. Testing Initial Menu:")
    response = requests.post(f"{base_url}/ussd", data={
        "sessionId": session_id,
        "phoneNumber": phone_number,
        "text": "",
        "serviceCode": "*384*12345#"
    })
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Step 2: Select Weather (1)
    print("\n2. Testing Weather Selection:")
    response = requests.post(f"{base_url}/ussd", data={
        "sessionId": session_id,
        "phoneNumber": phone_number,
        "text": "1",
        "serviceCode": "*384*12345#"
    })
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Step 3: Select first farm (1*1)
    print("\n3. Testing Farm Selection (1*1):")
    response = requests.post(f"{base_url}/ussd", data={
        "sessionId": session_id,
        "phoneNumber": phone_number,
        "text": "1*1",
        "serviceCode": "*384*12345#"
    })
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Step 4: Test second farm (1*2)
    print("\n4. Testing Second Farm Selection (1*2):")
    response = requests.post(f"{base_url}/ussd", data={
        "sessionId": session_id,
        "phoneNumber": phone_number,
        "text": "1*2",
        "serviceCode": "*384*12345#"
    })
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == "__main__":
    test_ussd_flow()
