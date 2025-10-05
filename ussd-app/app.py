"""
EO Farm Navigators - USSD Application
Handles feature phone interactions via Africa's Talking USSD API
"""

from flask import Flask, request, jsonify
import requests
import json
import os
from datetime import datetime, timedelta
import random

app = Flask(__name__)

# Backend API URL
API_BASE_URL = os.getenv('API_BASE_URL', 'http://localhost:8000')

# Africa's Talking Configuration
AT_USERNAME = os.getenv('AT_USERNAME', 'sandbox')
AT_API_KEY = os.getenv('AT_API_KEY', 'your_api_key_here')
AT_SENDER_ID = os.getenv('AT_SENDER_ID', 'EOFarm')

# User sessions storage (in production, use Redis)
user_sessions = {}

# Demo farmer data
demo_farmers = {
    '254712345678': {
        'name': 'John Mwangi',
        'location': 'Machakos',
        'latitude': -1.2921,
        'longitude': 36.8219,
        'crops': ['maize', 'beans'],
        'farm_size': 2.0
    },
    '254723456789': {
        'name': 'Grace Njeri',
        'location': 'Kiambu', 
        'latitude': -1.2000,
        'longitude': 36.9000,
        'crops': ['tomatoes', 'coffee'],
        'farm_size': 10.0
    }
}

# Mock data for instant responses
MOCK_WEATHER_DATA = {
    'machakos': {
        'current': {
            'conditions': 'Partly Cloudy',
            'temperature_c': 24.5,
            'humidity_percent': 65,
            'wind_speed_kmh': 12
        },
        'forecast': [
            {'conditions': 'Sunny', 'temp_min_c': 18, 'temp_max_c': 28},
            {'conditions': 'Light Rain', 'temp_min_c': 16, 'temp_max_c': 25},
            {'conditions': 'Cloudy', 'temp_min_c': 17, 'temp_max_c': 26},
            {'conditions': 'Sunny', 'temp_min_c': 19, 'temp_max_c': 29},
            {'conditions': 'Heavy Rain', 'temp_min_c': 15, 'temp_max_c': 23},
            {'conditions': 'Partly Cloudy', 'temp_min_c': 17, 'temp_max_c': 27},
            {'conditions': 'Sunny', 'temp_min_c': 20, 'temp_max_c': 30}
        ]
    },
    'nairobi': {
        'current': {
            'conditions': 'Sunny',
            'temperature_c': 26.2,
            'humidity_percent': 58,
            'wind_speed_kmh': 8
        },
        'forecast': [
            {'conditions': 'Sunny', 'temp_min_c': 20, 'temp_max_c': 30},
            {'conditions': 'Partly Cloudy', 'temp_min_c': 18, 'temp_max_c': 28},
            {'conditions': 'Light Rain', 'temp_min_c': 16, 'temp_max_c': 25},
            {'conditions': 'Sunny', 'temp_min_c': 19, 'temp_max_c': 29},
            {'conditions': 'Cloudy', 'temp_min_c': 17, 'temp_max_c': 26},
            {'conditions': 'Sunny', 'temp_min_c': 21, 'temp_max_c': 31},
            {'conditions': 'Partly Cloudy', 'temp_min_c': 19, 'temp_max_c': 28}
        ]
    },
    'meru': {
        'current': {
            'conditions': 'Cloudy',
            'temperature_c': 22.8,
            'humidity_percent': 72,
            'wind_speed_kmh': 15
        },
        'forecast': [
            {'conditions': 'Heavy Rain', 'temp_min_c': 15, 'temp_max_c': 22},
            {'conditions': 'Light Rain', 'temp_min_c': 16, 'temp_max_c': 24},
            {'conditions': 'Cloudy', 'temp_min_c': 17, 'temp_max_c': 25},
            {'conditions': 'Sunny', 'temp_min_c': 18, 'temp_max_c': 27},
            {'conditions': 'Partly Cloudy', 'temp_min_c': 19, 'temp_max_c': 28},
            {'conditions': 'Sunny', 'temp_min_c': 20, 'temp_max_c': 29},
            {'conditions': 'Light Rain', 'temp_min_c': 17, 'temp_max_c': 26}
        ]
    },
    'nakuru': {
        'current': {
            'conditions': 'Partly Cloudy',
            'temperature_c': 21.3,
            'humidity_percent': 68,
            'wind_speed_kmh': 10
        },
        'forecast': [
            {'conditions': 'Sunny', 'temp_min_c': 16, 'temp_max_c': 26},
            {'conditions': 'Cloudy', 'temp_min_c': 15, 'temp_max_c': 24},
            {'conditions': 'Light Rain', 'temp_min_c': 14, 'temp_max_c': 22},
            {'conditions': 'Sunny', 'temp_min_c': 17, 'temp_max_c': 27},
            {'conditions': 'Partly Cloudy', 'temp_min_c': 18, 'temp_max_c': 28},
            {'conditions': 'Sunny', 'temp_min_c': 19, 'temp_max_c': 29},
            {'conditions': 'Cloudy', 'temp_min_c': 16, 'temp_max_c': 25}
        ]
    }
}

MOCK_ADVISORY_DATA = {
    'alerts': [
        {
            'priority': 'high',
            'title': 'Pest Alert',
            'message': 'Fall armyworm detected in your area. Apply neem-based pesticides immediately.'
        },
        {
            'priority': 'medium',
            'title': 'Weather Warning',
            'message': 'Heavy rainfall expected in 3 days. Harvest mature crops now.'
        }
    ],
    'recommendations': [
        {
            'message': 'Plant drought-resistant maize varieties for better yield in dry conditions.'
        },
        {
            'message': 'Apply organic compost to improve soil fertility and water retention.'
        }
    ],
    'farm_health_score': 78
}

MOCK_MARKET_DATA = {
    'maize': {
        'location': 'Nairobi',
        'current_price': 45,
        'trend': 'increasing',
        'price_change_7d_percent': 5.2,
        'recommendation': 'Good time to sell. Prices expected to rise further.'
    },
    'beans': {
        'location': 'Nairobi',
        'current_price': 120,
        'trend': 'stable',
        'price_change_7d_percent': 0.8,
        'recommendation': 'Hold for better prices. Market is stable.'
    },
    'tomatoes': {
        'location': 'Nairobi',
        'current_price': 80,
        'trend': 'decreasing',
        'price_change_7d_percent': -3.1,
        'recommendation': 'Sell quickly. Prices are declining.'
    },
    'coffee': {
        'location': 'Nairobi',
        'current_price': 180,
        'trend': 'increasing',
        'price_change_7d_percent': 2.5,
        'recommendation': 'Excellent time to sell. Export demand is high.'
    }
}

def get_farmer_data(phone_number):
    """Get farmer data by phone number from backend API"""
    try:
        # Try to authenticate with backend
        response = requests.post(f"{API_BASE_URL}/api/v1/farmer/login", 
                               params={"phone_number": phone_number}, 
                               timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                farmer_info = data.get('farmer', {})
                return {
                    'name': farmer_info.get('name', 'Farmer'),
                    'location': farmer_info.get('location', 'Unknown'),
                    'latitude': farmer_info.get('home_latitude', -1.2921),
                    'longitude': farmer_info.get('home_longitude', 36.8219),
                    'crops': ['maize'],
                    'farm_size': 1.0,
                    'session_token': data.get('session_token'),
                    'farmer_id': farmer_info.get('id'),
                    'language': farmer_info.get('language', 'en'),
                    'is_verified': farmer_info.get('is_verified', False),
                    'home_location_name': farmer_info.get('home_location_name', 'Unknown')
                }
    except Exception as e:
        print(f"Backend authentication failed: {e}")
    
    # Fallback to demo data
    return demo_farmers.get(phone_number, {
        'name': 'Farmer',
        'location': 'Unknown',
        'latitude': -1.2921,
        'longitude': 36.8219,
        'crops': ['maize'],
        'farm_size': 1.0
    })

def get_localized_text(language):
    """Get localized text for different languages"""
    translations = {
        "en": {
            "welcome": "Welcome to EO Farm Navigators!",
            "hello": "Hello",
            "weather": "Weather Forecast",
            "advice": "Farming Advice", 
            "prices": "Market Prices",
            "farm_info": "My Farm Info",
            "manage_farms": "Manage Farms",
            "help": "Help",
            "settings": "Settings"
        },
        "sw": {
            "welcome": "Karibu EO Farm Navigators!",
            "hello": "Hujambo",
            "weather": "Hali ya Hewa",
            "advice": "Ushauri wa Kilimo",
            "prices": "Bei za Soko",
            "farm_info": "Taarifa ya Shamba",
            "manage_farms": "Simamia Mashamba",
            "help": "Msaada",
            "settings": "Mipangilio"
        },
        "kik": {
            "welcome": "Wamukire EO Farm Navigators!",
            "hello": "Wamukire",
            "weather": "Hali ya Riu",
            "advice": "Uthuthi wa Kurima",
            "prices": "Mari ya Githaka",
            "farm_info": "Uthuthi wa Githaka",
            "manage_farms": "Thutha Mashamba",
            "help": "Uthuthi",
            "settings": "Mikurire"
        }
    }
    
    return translations.get(language, translations["en"])

def get_user_session(session_id):
    """Get or create user session"""
    if session_id not in user_sessions:
        user_sessions[session_id] = {
            'state': 'main_menu',
            'data': {},
            'last_activity': datetime.now()
        }
    return user_sessions[session_id]

def update_user_session(session_id, updates):
    """Update user session"""
    session = get_user_session(session_id)
    session.update(updates)
    session['last_activity'] = datetime.now()
    user_sessions[session_id] = session

def call_backend_api(endpoint, data=None):
    """Call backend API - now returns mock data for instant responses"""
    print(f"Using mock data for: {endpoint}")
    
    # Return mock data based on endpoint
    if '/weather/forecast' in endpoint:
        location = 'nairobi'  # Default location
        if data and 'latitude' in data:
            lat = data['latitude']
            if lat < -1.0:  # Machakos area
                location = 'machakos'
            elif lat > -0.5:  # Meru area
                location = 'meru'
            elif lat < -0.8:  # Nakuru area
                location = 'nakuru'
        return MOCK_WEATHER_DATA.get(location, MOCK_WEATHER_DATA['nairobi'])
    
    elif '/advisory' in endpoint:
        return MOCK_ADVISORY_DATA
    
    elif '/market' in endpoint:
        commodity = 'maize'  # Default
        if data and 'commodity' in data:
            commodity = data['commodity']
        return MOCK_MARKET_DATA.get(commodity, MOCK_MARKET_DATA['maize'])
    
    # For other endpoints, try real API but with shorter timeout
    try:
        url = f"{API_BASE_URL}{endpoint}"
        print(f"Calling backend API: {url}")
        if data:
            response = requests.post(url, json=data, timeout=3)  # Shorter timeout
        else:
            response = requests.get(url, timeout=3)
        
        print(f"Backend response status: {response.status_code}")
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Backend API error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Backend API error: {e}")
        return None

def send_sms(phone_number, message):
    """Send SMS via Africa's Talking"""
    try:
        # Check if API key is configured
        if AT_API_KEY == 'your_api_key_here' or not AT_API_KEY:
            print(f"SMS not sent - API key not configured. Message would be: {message[:100]}...")
            return False
            
        url = "https://api.africastalking.com/version1/messaging"
        headers = {
            "apiKey": AT_API_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        }
        data = {
            "username": AT_USERNAME,
            "to": phone_number,
            "message": message,
            "from": AT_SENDER_ID
        }
        
        print(f"Attempting to send SMS to {phone_number} via Africa's Talking...")
        response = requests.post(url, headers=headers, data=data, timeout=10)
        print(f"SMS API response: {response.status_code} - {response.text}")
        
        if response.status_code == 201:
            print(f"SMS sent successfully to {phone_number}: {message[:50]}...")
            return True
        else:
            print(f"SMS failed: {response.text}")
            return False
    except Exception as e:
        print(f"SMS error: {e}")
        return False

def send_weather_sms(phone_number, weather_data, location_name):
    """Send detailed weather SMS"""
    try:
        print(f"send_weather_sms called for {phone_number} at {location_name}")
        if not weather_data:
            print("No weather data provided")
            return False
            
        sms_message = f"MavunoAI - {location_name} Weather\n\n"
        current = weather_data.get('current', {})
        sms_message += f"Today: {current.get('conditions', 'Unknown')}, {current.get('temperature_c', 0)}°C\n"
        sms_message += f"Humidity: {current.get('humidity_percent', 0)}%\n"
        sms_message += f"Wind: {current.get('wind_speed_kmh', 0)} km/h\n\n"
        
        forecast = weather_data.get('forecast', [])
        if forecast:
            sms_message += "7-Day Forecast:\n"
            for i, day in enumerate(forecast[:7]):
                sms_message += f"Day {i+1}: {day.get('conditions', 'Unknown')} - {day.get('temp_min_c', 0)}-{day.get('temp_max_c', 0)}°C\n"
        
        # Add rainfall info
        total_rainfall = sum(day.get('rainfall_mm', 0) for day in forecast[:7])
        sms_message += f"\nWeekly Rainfall: {total_rainfall:.0f}mm"
        
        if total_rainfall > 20:
            sms_message += "\nGood planting conditions!"
        elif total_rainfall > 10:
            sms_message += "\nModerate rainfall expected"
        else:
            sms_message += "\nLow rainfall - consider irrigation"
        
        return send_sms(phone_number, sms_message)
    except Exception as e:
        print(f"Weather SMS error: {e}")
        return False

def format_weather_response(weather_data, location_name):
    """Format weather data for USSD display"""
    if not weather_data:
        return "Weather data unavailable. Try again later."
    
    current = weather_data.get('current', {})
    forecast = weather_data.get('forecast', [])
    
    response = f"Weather for {location_name}:\n"
    response += f"Today: {current.get('conditions', 'Unknown')}, {current.get('temperature_c', 0)}°C\n"
    
    if forecast:
        tomorrow = forecast[0]
        response += f"Tomorrow: {tomorrow.get('conditions', 'Unknown')}, {tomorrow.get('temp_min_c', 0)}-{tomorrow.get('temp_max_c', 0)}°C\n"
        
        # Add rainfall info
        total_rainfall = sum(day.get('rainfall_mm', 0) for day in forecast[:7])
        response += f"This week: {total_rainfall:.0f}mm rain expected\n"
        
        if total_rainfall > 20:
            response += "Good planting conditions!"
        elif total_rainfall > 10:
            response += "Moderate rainfall expected"
        else:
            response += "Low rainfall - consider irrigation"
    
    return response

def format_advisory_response(advisory_data):
    """Format advisory data for USSD display"""
    if not advisory_data:
        return "Advisory data unavailable. Try again later."
    
    response = "Farming Advisory:\n"
    
    alerts = advisory_data.get('alerts', [])
    if alerts:
        response += "Alerts:\n"
        for alert in alerts[:2]:  # Limit to 2 alerts for USSD
            priority = "HIGH" if alert.get('priority') == 'high' else "MED"
            response += f"{priority}: {alert.get('title', 'Alert')}\n"
            response += f"{alert.get('message', '')[:50]}...\n"
    
    recommendations = advisory_data.get('recommendations', [])
    if recommendations:
        response += "Recommendations:\n"
        for rec in recommendations[:2]:  # Limit to 2 recommendations
            response += f"• {rec.get('message', '')[:60]}...\n"
    
    health_score = advisory_data.get('farm_health_score', 0)
    response += f"Farm Health: {health_score}/100"
    
    return response

def format_market_response(market_data, commodity):
    """Format market data for USSD display"""
    if not market_data:
        return "Market data unavailable. Try again later."
    
    response = f"{commodity.upper()} Prices:\n"
    response += f"{market_data.get('location', 'Nairobi')}: {market_data.get('current_price', 0)} KES/kg\n"
    
    trend = market_data.get('trend', 'stable')
    trend_emoji = "📈" if trend == 'increasing' else "📉" if trend == 'decreasing' else "➡️"
    response += f"Trend: {trend_emoji} {trend}\n"
    
    change_7d = market_data.get('price_change_7d_percent', 0)
    response += f"7-day change: {change_7d:+.1f}%\n"
    
    recommendation = market_data.get('recommendation', '')
    if recommendation:
        response += f"Tip: {recommendation[:50]}..."
    
    return response

@app.route('/ussd', methods=['GET', 'POST'])
def ussd_handler():
    """Main USSD handler for Africa's Talking"""
    try:
        # Handle GET requests (testing/health check)
        if request.method == 'GET':
            return jsonify({
                'message': 'MavunoAI USSD Service',
                'status': 'ready',
                'endpoint': '/ussd',
                'methods': ['GET', 'POST']
            })
        
        # Africa's Talking USSD webhook format
        session_id = request.values.get('sessionId')
        phone_number = request.values.get('phoneNumber', '')
        # Ensure phone number has + prefix for backend API
        if not phone_number.startswith('+'):
            phone_number = '+' + phone_number
        text = request.values.get('text', '').strip()
        service_code = request.values.get('serviceCode', '*384*12345#')
        
        print(f"USSD Request - Session: {session_id}, Phone: {phone_number}, Text: '{text}', Service: {service_code}")
        
        # Get farmer data
        try:
            farmer = get_farmer_data(phone_number)
            print(f"Farmer data retrieved: {farmer.get('name', 'Unknown')}")
        except Exception as e:
            print(f"Error getting farmer data: {e}")
            farmer = {
                'name': 'Farmer',
                'location': 'Unknown',
                'latitude': -1.2921,
                'longitude': 36.8219,
                'crops': ['maize'],
                'farm_size': 1.0
            }
        
        session = get_user_session(session_id)
        
        # Handle different states
        if text == '':
            # Check if farmer is verified
            if not farmer.get('is_verified', False):
                # Send verification code
                try:
                    verify_response = requests.post(f"{API_BASE_URL}/api/v1/farmer/send-verification", 
                                                 params={"phone_number": phone_number}, timeout=5)
                    if verify_response.status_code == 200:
                        verify_data = verify_response.json()
                        if verify_data.get('success'):
                            response = "CON Phone verification required!\n\n"
                            response += f"Verification code sent to {phone_number}\n"
                            response += "Enter the 6-digit code:\n"
                            response += "0. Back"
                            update_user_session(session_id, {'state': 'verification'})
                        else:
                            response = "END Service temporarily unavailable.\nPlease try again later."
                    else:
                        response = "END Service temporarily unavailable.\nPlease try again later."
                except Exception as e:
                    print(f"Verification error: {e}")
                    response = "END Service temporarily unavailable.\nPlease try again later."
            else:
                # Show personalized menu
                language = farmer.get('language', 'en')
                localized_text = get_localized_text(language)
                
                response = f"CON {localized_text['welcome']}\n"
                response += f"{localized_text['hello']} {farmer['name']}!\n"
                response += "Powered by NASA satellite data\n\n"
                response += f"1. {localized_text['weather']}\n"
                response += f"2. {localized_text['advice']}\n"
                response += f"3. {localized_text['prices']}\n"
                response += f"4. {localized_text['farm_info']}\n"
                response += f"5. {localized_text['manage_farms']}\n"
                response += f"6. Settings\n"
                response += f"0. {localized_text['help']}"
                
                update_user_session(session_id, {'state': 'main_menu', 'farmer': farmer, 'session_token': farmer.get('session_token')})
        
        elif session.get('state') == 'verification':
            # Handle verification code
            if text.isdigit() and len(text) == 6:
                try:
                    verify_response = requests.post(f"{API_BASE_URL}/api/v1/farmer/verify-code", 
                                                   params={"phone_number": phone_number, "code": text}, timeout=5)
                    if verify_response.status_code == 200:
                        verify_data = verify_response.json()
                        if verify_data.get('success'):
                            # Verification successful, show language selection
                            response = "CON Phone verified successfully!\n\n"
                            response += "Choose your language:\n"
                            response += "1. English\n"
                            response += "2. Kiswahili\n"
                            response += "3. Kikuyu\n"
                            response += "0. Back"
                            update_user_session(session_id, {'state': 'language_selection'})
                        else:
                            response = f"CON Invalid code. Try again:\n\n"
                            response += f"Enter 6-digit code:\n"
                            response += "0. Back"
                    else:
                        response = "CON Invalid code. Try again:\n\n"
                        response += f"Enter 6-digit code:\n"
                        response += "0. Back"
                except Exception as e:
                    print(f"Verification error: {e}")
                    response = "END Service temporarily unavailable.\nPlease try again later."
            elif text == '0':
                response = "END Thank you for using EO Farm Navigators!"
            else:
                response = "CON Invalid code format.\n\n"
                response += f"Enter 6-digit code:\n"
                response += "0. Back"
        
        elif session.get('state') == 'language_selection':
            # Handle language selection
            if text == '1':
                language = 'en'
            elif text == '2':
                language = 'sw'
            elif text == '3':
                language = 'kik'
            elif text == '0':
                response = "END Thank you for using EO Farm Navigators!"
            else:
                response = "CON Invalid selection.\n\n"
                response += "Choose your language:\n"
                response += "1. English\n"
                response += "2. Kiswahili\n"
                response += "3. Kikuyu\n"
                response += "0. Back"
                return response
            
            # Update farmer language
            try:
                lang_response = requests.post(f"{API_BASE_URL}/api/v1/farmer/update-language", 
                                            params={"phone_number": phone_number, "language": language}, timeout=5)
                if lang_response.status_code == 200:
                    # Show main menu with selected language
                    localized_text = get_localized_text(language)
                    response = f"CON {localized_text['welcome']}\n"
                    response += f"{localized_text['hello']} {farmer['name']}!\n"
                    response += "Powered by NASA satellite data\n\n"
                    response += f"1. {localized_text['weather']}\n"
                    response += f"2. {localized_text['advice']}\n"
                    response += f"3. {localized_text['prices']}\n"
                    response += f"4. {localized_text['farm_info']}\n"
                    response += f"5. {localized_text['manage_farms']}\n"
                    response += f"6. Settings\n"
                    response += f"0. {localized_text['help']}"
                    update_user_session(session_id, {'state': 'main_menu', 'farmer': farmer, 'session_token': farmer.get('session_token')})
                else:
                    response = "END Service temporarily unavailable.\nPlease try again later."
            except Exception as e:
                print(f"Language update error: {e}")
                response = "END Service temporarily unavailable.\nPlease try again later."
            
        elif text == '1':
            # Weather submenu - show farmer's farms
            try:
                # First try to get farmer's farms using session token
                session_data = get_user_session(session_id)
                session_token = session_data.get('session_token')
                print(f"Weather menu: session_token={session_token}")
                
                if session_token:
                    # Get farmer's farms from backend with session token
                    farms_response = requests.get(f"{API_BASE_URL}/api/v1/farmer/farms", 
                                                params={"session_token": session_token}, timeout=5)
                    if farms_response.status_code == 200:
                        farms_data = farms_response.json()
                        farms = farms_data.get('farms', [])
                        
                        if farms:
                            response = "CON Select your farm:\n"
                            for i, farm in enumerate(farms[:4], 1):  # Limit to 4 farms for USSD
                                response += f"{i}. {farm.get('name', 'Farm')} ({farm.get('location', 'Unknown')})\n"
                            response += f"{len(farms)+1}. Other location\n"
                            response += "0. Back"
                            
                            # Store farms in session for later use
                            update_user_session(session_id, {'state': 'weather_farm_selection', 'farms': farms})
                        else:
                            response = "CON No farms found. Select location:\n"
                            response += "1. Machakos\n"
                            response += "2. Nairobi\n"
                            response += "3. Meru\n"
                            response += "4. Nakuru\n"
                            response += "0. Back"
                            update_user_session(session_id, {'state': 'weather_location'})
                    else:
                        # Fallback to hardcoded locations
                        response = "CON Select location:\n"
                        response += "1. Machakos\n"
                        response += "2. Nairobi\n"
                        response += "3. Meru\n"
                        response += "4. Nakuru\n"
                        response += "0. Back"
                        update_user_session(session_id, {'state': 'weather_location'})
                else:
                    # No session token, use hardcoded locations
                    response = "CON Select location:\n"
                    response += "1. Machakos\n"
                    response += "2. Nairobi\n"
                    response += "3. Meru\n"
                    response += "4. Nakuru\n"
                    response += "0. Back"
                    update_user_session(session_id, {'state': 'weather_location'})
            except Exception as e:
                print(f"Error getting farms: {e}")
                # Fallback to hardcoded locations
                response = "CON Select location:\n"
                response += "1. Machakos\n"
                response += "2. Nairobi\n"
                response += "3. Meru\n"
                response += "4. Nakuru\n"
                response += "0. Back"
                update_user_session(session_id, {'state': 'weather_location'})
            
        elif text.startswith('1*') and len(text.split('*')) == 2:
            # Handle farm selection (1*1, 1*2, etc.)
            try:
                session_data = get_user_session(session_id)
                farms = session_data.get('farms', [])
                farm_index = int(text.split('*')[1]) - 1
                print(f"Farm selection: index={farm_index}, farms_count={len(farms)}")
                
                if 0 <= farm_index < len(farms):
                    # Selected a farm
                    farm = farms[farm_index]
                    location_name = farm.get('location', 'Farm')
                    coordinates = farm.get('coordinates', {})
                    latitude = coordinates.get('lat', -1.2921)
                    longitude = coordinates.get('lon', 36.8219)
                    
                    weather_data = call_backend_api('/api/v1/weather/forecast', {
                        'latitude': latitude,
                        'longitude': longitude,
                        'days': 7
                    })
                    
                    if weather_data:
                        response = f"END {format_weather_response(weather_data, location_name)}"
                        # Send SMS for farm weather (non-blocking)
                        try:
                            import threading
                            def send_sms_async():
                                send_weather_sms(phone_number, weather_data, location_name)
                            threading.Thread(target=send_sms_async, daemon=True).start()
                        except:
                            pass  # Continue even if SMS fails
                    else:
                        response = "END Weather service temporarily unavailable.\nPlease try again later."
                else:
                    # Invalid farm selection
                    response = "END Invalid selection. Please try again."
            except Exception as e:
                print(f"Farm weather error: {e}")
                response = "END Weather service temporarily unavailable.\nPlease try again later."
                
        elif text == '1*1':
            # Machakos weather (fallback for hardcoded locations)
            try:
                weather_data = call_backend_api('/api/v1/weather/forecast', {
                    'latitude': -1.2921,
                    'longitude': 36.8219,
                    'days': 7
                })
                if weather_data:
                    response = f"END {format_weather_response(weather_data, 'Machakos')}"
                    # Send SMS for Machakos (non-blocking)
                    try:
                        import threading
                        def send_sms_async():
                            send_weather_sms(phone_number, weather_data, 'Machakos')
                        threading.Thread(target=send_sms_async, daemon=True).start()
                    except:
                        pass  # Continue even if SMS fails
                else:
                    response = "END Weather service temporarily unavailable.\nPlease try again later or visit our web dashboard."
            except Exception as e:
                print(f"Weather API error: {e}")
                response = "END Weather service temporarily unavailable.\nPlease try again later or visit our web dashboard."
            
        elif text == '1*2':
            # Nairobi weather
            weather_data = call_backend_api('/api/v1/weather/forecast', {
                'latitude': -1.2921,
                'longitude': 36.8219,
                'days': 7
            })
            response = f"END {format_weather_response(weather_data, 'Nairobi')}"
            # Send SMS for Nairobi (non-blocking)
            try:
                import threading
                def send_sms_async():
                    send_weather_sms(phone_number, weather_data, 'Nairobi')
                threading.Thread(target=send_sms_async, daemon=True).start()
            except:
                pass  # Continue even if SMS fails
            
        elif text == '1*3':
            # Meru weather
            weather_data = call_backend_api('/api/v1/weather/forecast', {
                'latitude': 0.0500,
                'longitude': 37.6500,
                'days': 7
            })
            response = f"END {format_weather_response(weather_data, 'Meru')}"
            # Send SMS for Meru (non-blocking)
            try:
                import threading
                def send_sms_async():
                    send_weather_sms(phone_number, weather_data, 'Meru')
                threading.Thread(target=send_sms_async, daemon=True).start()
            except:
                pass  # Continue even if SMS fails
            
        elif text == '1*4':
            # Nakuru weather
            weather_data = call_backend_api('/api/v1/weather/forecast', {
                'latitude': -0.3000,
                'longitude': 36.0833,
                'days': 7
            })
            response = f"END {format_weather_response(weather_data, 'Nakuru')}"
            # Send SMS for Nakuru (non-blocking)
            try:
                import threading
                def send_sms_async():
                    send_weather_sms(phone_number, weather_data, 'Nakuru')
                threading.Thread(target=send_sms_async, daemon=True).start()
            except:
                pass  # Continue even if SMS fails
            
        elif text == '2':
            # Farming advice
            advisory_data = call_backend_api('/api/v1/advisory', {
                'farmer_id': f'farmer_{phone_number[-6:]}',
                'latitude': farmer['latitude'],
                'longitude': farmer['longitude'],
                'crop': farmer['crops'][0],
                'farm_size_ha': farmer['farm_size']
            })
            response = f"END {format_advisory_response(advisory_data)}\n\nDetailed advice sent via SMS!"
            
        elif text == '3':
            # Market prices submenu
            response = "CON Select crop:\n"
            response += "1. Maize\n"
            response += "2. Beans\n"
            response += "3. Tomatoes\n"
            response += "4. Coffee\n"
            response += "0. Back"
            
            update_user_session(session_id, {'state': 'market_crop'})
            
        elif text == '3*1':
            # Maize prices
            market_data = call_backend_api('/api/v1/market/prices', {'commodity': 'maize', 'location': 'Nairobi'})
            response = f"END {format_market_response(market_data, 'maize')}\n\nMore prices sent via SMS!"
            
        elif text == '3*2':
            # Beans prices
            market_data = call_backend_api('/api/v1/market/prices', {'commodity': 'beans', 'location': 'Nairobi'})
            response = f"END {format_market_response(market_data, 'beans')}\n\nMore prices sent via SMS!"
            
        elif text == '3*3':
            # Tomatoes prices
            market_data = call_backend_api('/api/v1/market/prices', {'commodity': 'tomatoes', 'location': 'Nairobi'})
            response = f"END {format_market_response(market_data, 'tomatoes')}\n\nMore prices sent via SMS!"
            
        elif text == '3*4':
            # Coffee prices
            market_data = call_backend_api('/api/v1/market/prices', {'commodity': 'coffee', 'location': 'Nairobi'})
            response = f"END {format_market_response(market_data, 'coffee')}\n\nMore prices sent via SMS!"
            
        elif text == '4':
            # My farm info
            response = f"END My Farm Info:\n"
            response += f"Name: {farmer['name']}\n"
            response += f"Location: {farmer['location']}\n"
            response += f"Farm Size: {farmer['farm_size']} ha\n"
            response += f"Crops: {', '.join(farmer['crops'])}\n\n"
            response += "For detailed analysis, visit our web dashboard!"
            
        elif text == '5':
            # Farm management
            if farmer.get('session_token'):
                # Get farms from backend
                try:
                    farms_response = requests.get(
                        f"{API_BASE_URL}/api/v1/farmer/farms",
                        params={"session_token": farmer['session_token']},
                        timeout=5
                    )
                    if farms_response.status_code == 200:
                        farms_data = farms_response.json()
                        farms = farms_data.get('farms', [])
                        
                        if farms:
                            response = "CON Your Farms:\n"
                            for i, farm in enumerate(farms[:3], 1):  # Limit to 3 farms for USSD
                                response += f"{i}. {farm['name']}\n"
                                response += f"   {farm['location']} - {farm['size_acres']} acres\n"
                                response += f"   Crop: {farm['primary_crop']}\n"
                            response += "0. Back"
                        else:
                            response = "CON No farms registered.\n\n"
                            response += "1. Add New Farm\n"
                            response += "0. Back"
                    else:
                        response = "END Unable to load farms. Try again later."
                except Exception as e:
                    print(f"Error fetching farms: {e}")
                    response = "END Service temporarily unavailable."
            else:
                response = "END Please register first. Visit our web dashboard!"
            
        elif text == '0':
            # Help
            response = "CON EO Farm Navigators Help:\n\n"
            response += "1. Weather - Get 7-day forecast\n"
            response += "2. Advice - Farming recommendations\n"
            response += "3. Prices - Market prices\n"
            response += "4. My Farm - Your farm details\n\n"
            response += "Powered by NASA satellite data\n"
            response += "Visit: eofarm.africa"
            
        else:
            # Invalid input
            response = "CON Invalid option. Please try again:\n\n"
            response += "1. Weather Forecast\n"
            response += "2. Farming Advice\n"
            response += "3. Market Prices\n"
            response += "4. My Farm Info\n"
            response += "0. Help"
            
            update_user_session(session_id, {'state': 'main_menu'})
        
        return response
        
    except Exception as e:
        print(f"USSD Error: {e}")
        return "END Sorry, service temporarily unavailable. Please try again later."

@app.route('/events', methods=['POST'])
def events_handler():
    """Handle Africa's Talking events"""
    try:
        event_data = request.get_json()
        print(f"Africa's Talking Event: {event_data}")
        
        # Log different event types
        event_type = event_data.get('eventType', 'unknown')
        
        if event_type == 'ussd_session_started':
            print(f"USSD Session Started: {event_data.get('sessionId')}")
        elif event_type == 'ussd_session_ended':
            print(f"USSD Session Ended: {event_data.get('sessionId')}")
        elif event_type == 'sms_delivery_report':
            print(f"SMS Delivery Report: {event_data.get('messageId')} - {event_data.get('status')}")
        
        return jsonify({'status': 'received'})
    except Exception as e:
        print(f"Events handler error: {e}")
        return jsonify({'status': 'error'}), 500

@app.route('/', methods=['GET', 'POST'])
def root():
    """Root endpoint - handle USSD requests"""
    try:
        # If this is a USSD request, handle it like the /ussd endpoint
        if request.method == 'POST' and request.values.get('sessionId'):
            # This is a USSD request, redirect to USSD handler
            return ussd_handler()
        else:
            # This is a health check or test request
            return jsonify({
                'message': 'MavunoAI USSD Service',
                'status': 'ready',
                'endpoint': '/ussd',
                'methods': ['GET', 'POST']
            })
    except Exception as e:
        print(f"Root handler error: {e}")
        return "END Sorry, service temporarily unavailable. Please try again later."

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'active_sessions': len(user_sessions)
    })


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
