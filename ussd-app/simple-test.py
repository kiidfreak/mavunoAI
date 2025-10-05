#!/usr/bin/env python3
"""
Simple test for USSD service without backend calls
"""

import requests
import json

def test_simple_ussd():
    base_url = "http://localhost:5000"
    
    print("🧪 Testing Simple USSD Service...")
    print("=" * 50)
    
    # Test 1: Initial menu (empty text)
    print("\n1. Testing Initial Menu:")
    try:
        response = requests.post(f"{base_url}/ussd", data={
            "sessionId": "test_simple_001",
            "phoneNumber": "+254712345678",
            "text": "",
            "serviceCode": "*384*717111#"
        }, timeout=10)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 2: Help menu
    print("\n2. Testing Help Menu:")
    try:
        response = requests.post(f"{base_url}/ussd", data={
            "sessionId": "test_simple_001",
            "phoneNumber": "+254712345678", 
            "text": "0",
            "serviceCode": "*384*717111#"
        }, timeout=10)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_simple_ussd()
