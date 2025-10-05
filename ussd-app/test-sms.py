#!/usr/bin/env python3
"""
Test SMS functionality with Africa's Talking
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_sms_configuration():
    """Test SMS configuration and send a test message"""
    
    # Get configuration from environment
    at_username = os.getenv('AT_USERNAME', 'sandbox')
    at_api_key = os.getenv('AT_API_KEY', 'your_api_key_here')
    at_sender_id = os.getenv('AT_SENDER_ID', '29187')
    
    print("🧪 Testing SMS Configuration...")
    print("=" * 50)
    print(f"Username: {at_username}")
    print(f"API Key: {at_api_key[:10]}..." if at_api_key != 'your_api_key_here' else "API Key: Not configured")
    print(f"Sender ID: {at_sender_id}")
    print()
    
    if at_api_key == 'your_api_key_here' or not at_api_key:
        print("❌ SMS not configured!")
        print("Please:")
        print("1. Get your API key from Africa's Talking dashboard")
        print("2. Create a .env file with:")
        print("   AT_USERNAME=your_username")
        print("   AT_API_KEY=your_api_key")
        print("   AT_SENDER_ID=29187")
        return False
    
    # Test SMS sending
    test_phone = "+254712345678"  # Test number
    test_message = "MavunoAI Test SMS - Weather service is working!"
    
    try:
        url = "https://api.africastalking.com/version1/messaging"
        headers = {
            "apiKey": at_api_key,
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        }
        data = {
            "username": at_username,
            "to": test_phone,
            "message": test_message,
            "from": at_sender_id
        }
        
        print(f"📱 Sending test SMS to {test_phone}...")
        response = requests.post(url, headers=headers, data=data, timeout=10)
        
        print(f"Response Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ SMS sent successfully!")
            return True
        else:
            print("❌ SMS failed to send")
            return False
            
    except Exception as e:
        print(f"❌ SMS error: {e}")
        return False

if __name__ == "__main__":
    test_sms_configuration()
