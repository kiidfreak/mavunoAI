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

def get_farmer_data(phone_number):
    """Get farmer data by phone number"""
    return demo_farmers.get(phone_number, {
        'name': 'Farmer',
        'location': 'Unknown',
        'latitude': -1.2921,
        'longitude': 36.8219,
        'crops': ['maize'],
        'farm_size': 1.0
    })

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
    """Call backend API"""
    try:
        url = f"{API_BASE_URL}{endpoint}"
        if data:
            response = requests.post(url, json=data, timeout=10)
        else:
            response = requests.get(url, timeout=10)
        return response.json() if response.status_code == 200 else None
    except Exception as e:
        print(f"Backend API error: {e}")
        return None

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

@app.route('/ussd', methods=['POST'])
def ussd_handler():
    """Main USSD handler"""
    try:
        session_id = request.values.get('sessionId')
        phone_number = request.values.get('phoneNumber', '').replace('+', '')
        text = request.values.get('text', '').strip()
        
        print(f"USSD Request - Session: {session_id}, Phone: {phone_number}, Text: '{text}'")
        
        # Get farmer data
        farmer = get_farmer_data(phone_number)
        session = get_user_session(session_id)
        
        # Handle different states
        if text == '':
            # Initial menu
            response = "CON Welcome to EO Farm Navigators!\n"
            response += "Powered by NASA satellite data\n\n"
            response += "1. Weather Forecast\n"
            response += "2. Farming Advice\n"
            response += "3. Market Prices\n"
            response += "4. My Farm Info\n"
            response += "0. Help"
            
            update_user_session(session_id, {'state': 'main_menu'})
            
        elif text == '1':
            # Weather submenu
            response = "CON Select location:\n"
            response += "1. Machakos\n"
            response += "2. Nairobi\n"
            response += "3. Meru\n"
            response += "4. Nakuru\n"
            response += "0. Back"
            
            update_user_session(session_id, {'state': 'weather_location'})
            
        elif text == '1*1':
            # Machakos weather
            weather_data = call_backend_api('/api/v1/weather/forecast', {
                'latitude': -1.2921,
                'longitude': 36.8219,
                'days': 7
            })
            response = f"END {format_weather_response(weather_data, 'Machakos')}\n\nMore details sent via SMS!"
            
            # Send detailed SMS (mock)
            print(f"SMS sent to {phone_number}: Detailed weather forecast")
            
        elif text == '1*2':
            # Nairobi weather
            weather_data = call_backend_api('/api/v1/weather/forecast', {
                'latitude': -1.2921,
                'longitude': 36.8219,
                'days': 7
            })
            response = f"END {format_weather_response(weather_data, 'Nairobi')}\n\nMore details sent via SMS!"
            
        elif text == '1*3':
            # Meru weather
            weather_data = call_backend_api('/api/v1/weather/forecast', {
                'latitude': 0.0500,
                'longitude': 37.6500,
                'days': 7
            })
            response = f"END {format_weather_response(weather_data, 'Meru')}\n\nMore details sent via SMS!"
            
        elif text == '1*4':
            # Nakuru weather
            weather_data = call_backend_api('/api/v1/weather/forecast', {
                'latitude': -0.3000,
                'longitude': 36.0833,
                'days': 7
            })
            response = f"END {format_weather_response(weather_data, 'Nakuru')}\n\nMore details sent via SMS!"
            
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
            market_data = call_backend_api('/api/v1/market/prices?commodity=maize&location=Nairobi')
            response = f"END {format_market_response(market_data, 'maize')}\n\nMore prices sent via SMS!"
            
        elif text == '3*2':
            # Beans prices
            market_data = call_backend_api('/api/v1/market/prices?commodity=beans&location=Nairobi')
            response = f"END {format_market_response(market_data, 'beans')}\n\nMore prices sent via SMS!"
            
        elif text == '3*3':
            # Tomatoes prices
            market_data = call_backend_api('/api/v1/market/prices?commodity=tomatoes&location=Nairobi')
            response = f"END {format_market_response(market_data, 'tomatoes')}\n\nMore prices sent via SMS!"
            
        elif text == '3*4':
            # Coffee prices
            market_data = call_backend_api('/api/v1/market/prices?commodity=coffee&location=Nairobi')
            response = f"END {format_market_response(market_data, 'coffee')}\n\nMore prices sent via SMS!"
            
        elif text == '4':
            # My farm info
            response = f"END My Farm Info:\n"
            response += f"Name: {farmer['name']}\n"
            response += f"Location: {farmer['location']}\n"
            response += f"Farm Size: {farmer['farm_size']} ha\n"
            response += f"Crops: {', '.join(farmer['crops'])}\n\n"
            response += "For detailed analysis, visit our web dashboard!"
            
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

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'active_sessions': len(user_sessions)
    })

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        'message': 'EO Farm Navigators USSD Service',
        'status': 'running',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
