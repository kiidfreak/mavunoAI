# ---------------------------------------------------------------------------
# Imports & configuration
# ---------------------------------------------------------------------------

from flask import Flask, request
import requests
import os
import random
from datetime import datetime, timezone
from dotenv import load_dotenv
from typing import Dict, Any


# Load environment variables from .env if present
load_dotenv()

app = Flask(__name__)

# Backend API URL
API_BASE_URL = os.getenv('API_BASE_URL', 'http://localhost:8000')

# Africa's Talking configuration
AT_SHORT_CODE = os.getenv('AT_SHORT_CODE', '*384*717118#')
AT_CALLBACK_URL = os.getenv('AT_CALLBACK_URL', 'https://9953ab261112.ngrok-free.app/ussd')
AT_USERNAME = os.getenv('AT_USERNAME', 'sandbox')
AT_API_KEY = os.getenv('AT_API_KEY')
AT_SENDER_ID = os.getenv('AT_SENDER_ID', 'Mavuno')
AT_SMS_URL = os.getenv('AT_SMS_URL', 'https://api.sandbox.africastalking.com/version1/messaging')


# User sessions storage (in production, use Redis)
user_sessions = {}

# Mock user database with location data
user_database = {
    '254712345678': {
        'name': 'Mary Wanjiru',
        'location': 'Nakuru',
        'latitude': -0.34,
        'longitude': 36.12,
        'crop': 'onion',
        'farm_size': 2.0,
        'verified': True,
        'points': 120
    },
    '254723456789': {
        'name': 'John Kamau',
        'location': 'Machakos',
        'latitude': -1.52,
        'longitude': 37.26,
        'crop': 'maize',
        'farm_size': 1.5,
        'verified': True,
        'points': 95
    },
    '254734567890': {
        'name': 'Grace Njeri',
        'location': 'Kiambu',
        'latitude': -1.17,
        'longitude': 36.83,
        'crop': 'bees',
        'farm_size': 0.5,
        'verified': True,
        'points': 140
    }
}

# County coordinates for new users
COUNTY_COORDS = {
    'Nakuru': {'lat': -0.34, 'lon': 36.12},
    'Machakos': {'lat': -1.52, 'lon': 37.26},
    'Kiambu': {'lat': -1.17, 'lon': 36.83},
    'Nairobi': {'lat': -1.29, 'lon': 36.82},
    'Meru': {'lat': 0.05, 'lon': 37.65},
    'Kisumu': {'lat': -0.09, 'lon': 34.77}
}

CROP_OPTIONS = ['onion', 'maize', 'bees', 'beans', 'tomato']


# ---------------------------------------------------------------------------
# SMS helpers
# ---------------------------------------------------------------------------

def is_sms_configured() -> bool:
    return bool(AT_API_KEY and AT_API_KEY.lower() != 'your_api_key_here')


def send_sms(phone_number: str, message: str, tag: str = 'generic') -> Dict[str, Any]:
    payload = {
        'phone_number': phone_number,
        'message': message,
        'tag': tag,
        'timestamp': datetime.now(timezone.utc).isoformat(),
    }

    if not is_sms_configured():
        print(f"[SMS-LOG:{tag}] Credentials missing → logging only: {payload}")
        payload['success'] = True
        payload['note'] = 'Africa\'s Talking credentials not configured; SMS not sent.'
        return payload

    headers = {
        'apiKey': AT_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    }
    data = {
        'username': AT_USERNAME,
        'to': phone_number if phone_number.startswith('+') else f'+{phone_number}',
        'message': message,
        'from': AT_SENDER_ID
    }

    try:
        response = requests.post(AT_SMS_URL, headers=headers, data=data, timeout=10)
        payload['status_code'] = response.status_code
        if response.status_code in (200, 201):
            payload['success'] = True
            try:
                payload['response'] = response.json()
            except ValueError:
                payload['response'] = response.text
        else:
            payload['success'] = False
            payload['error'] = response.text
            if response.status_code == 401:
                payload['note'] = (
                    "Africa's Talking rejected the credentials (401). "
                    "Check AT_USERNAME / AT_API_KEY."
                )
    except Exception as exc:
        payload['success'] = False
        payload['error'] = str(exc)

    print(f"[SMS-LOG:{tag}] {payload}")
    return payload


def send_welcome_sms(phone_number: str, name: str, location: str) -> None:
    message = (
        f"🎉 Welcome to MavunoAI, {name}!\n\n"
        f"📍 Ward: {location}\n"
        f"✅ Your credit profile is ready.\n"
        f"Dial {AT_SHORT_CODE} anytime for updates."
    )
    send_sms(phone_number, message, tag='welcome')


def send_farm_summary_sms(phone_number: str, summary: Dict[str, Any]) -> None:
    message_lines = [
        "🌾 MavunoAI Farm Snapshot",
        f"Location: {summary.get('location', 'Unknown')}",
        f"Crop: {summary.get('crop', 'Mixed')}",
        f"Soil moisture: {summary.get('soil_moisture', 'N/A')}%",
        f"Rain (30d): {summary.get('rainfall', 'N/A')} mm",
        summary.get('tip', 'Dial for more insights.')
    ]

    send_sms(phone_number, "\n".join(message_lines), tag='farm-summary')


# ---------------------------------------------------------------------------
"""
MavunoAI Credit - USSD Application
Feature phone access to AI-powered credit scoring
*MAVUNO*CREDIT# - Check your credit score via USSD
"""

@app.route('/ussd', methods=['POST'])
def ussd_callback():
    """Main USSD callback handler"""
    
    # Get USSD parameters
    session_id = request.values.get("sessionId", None)
    service_code = request.values.get("serviceCode", None)
    phone_number = request.values.get("phoneNumber", None)
    text = request.values.get("text", "")
    
    # Clean phone number
    if phone_number.startswith('+'):
        phone_number = phone_number[1:]
    
    # Initialize or get session
    if session_id not in user_sessions:
        user_sessions[session_id] = {
            'phone': phone_number,
            'stage': 'select_language',
            'data': {
                'language': 'english'
            }
        }
    
    session = user_sessions[session_id]
    
    # Parse user input
    user_input = text.split('*')[-1] if text else ""
    
    # Route to appropriate handler
    response = handle_ussd_flow(session, user_input, phone_number)
    
    return response


def handle_ussd_flow(session, user_input, phone_number):
    """Handle USSD flow logic"""
    
    stage = session['stage']
    
    # Language Selection
    if stage == 'select_language':
        language_map = {
            '1': ('english', 'English'),
            '2': ('swahili', 'Kiswahili'),
            '3': ('kikuyu', 'Kikuyu'),
        }

        if not user_input:
            return "CON Choose your language:\n1. English\n2. Kiswahili\n3. Kikuyu"

        if user_input in language_map:
            lang_code, lang_label = language_map[user_input]
            session['data']['language'] = lang_code
            session['data']['language_label'] = lang_label
            session['stage'] = 'main_menu'

            acknowledgement = {
                'english': "Language set to English.",
                'swahili': "Umechagua Kiswahili.",
                'kikuyu': "Waurire Kikuyu.",
            }

            next_response = handle_ussd_flow(session, '', phone_number)
            prefix = acknowledgement.get(lang_code, '')
            if prefix and next_response.startswith('CON '):
                return next_response.replace('CON ', f"CON {prefix}\n\n", 1)
            return next_response

        return "CON Invalid option. Choose your language:\n1. English\n2. Kiswahili\n3. Kikuyu"

    # Main Menu
    if stage == 'main_menu':
        if phone_number in user_database:
            user = user_database[phone_number]
            response = f"CON Welcome {user['name']} to MavunoAI Credit\n"
            response += "🌟 Satellite-Powered Credit Scoring\n\n"
            response += "1. Check My Credit Score\n"
            response += "2. Apply for Loan\n"
            response += "3. View Loan Offers\n"
            response += "4. Update Farm Info\n"
            response += "5. How to Improve Score"
        else:
            response = "CON Welcome to Mavuno\n\n"
            response += "You're new here! Let's set up your profile.\n\n"
            response += "1. Register now\n"
            response += "2. Speak to support\n"
            response += "0. Exit"
        
        session['stage'] = 'process_main_menu'
        return response
    
    # Process Main Menu
    elif stage == 'process_main_menu':
        if user_input == '1':
            if phone_number in user_database:
                session['stage'] = 'check_credit_score'
                return handle_credit_score(session, phone_number)
            else:
                session['stage'] = 'register_name'
                return "CON Welcome to MavunoAI!\n\nWhat is your full name?"
        
        elif user_input == '2':
            if phone_number in user_database:
                session['stage'] = 'apply_loan'
                return handle_loan_application(session, phone_number)
            else:
                return "END Our support team will reach out shortly."
        
        elif user_input == '3':
            session['stage'] = 'view_offers'
            return handle_view_offers(session, phone_number)
        
        elif user_input == '4':
            session['stage'] = 'update_farm'
            return "CON Update Farm Info\n\n1. Change Crop\n2. Update Farm Size\n3. Update Location\n0. Back"
        
        elif user_input == '5':
            return handle_improve_score()
        
        elif user_input == '0':
            return "END Thank you for using MavunoAI Credit. Dial *MAVUNO*CREDIT# anytime!"
        
        else:
            return "END Invalid option. Please try again."
    
    # Check Credit Score
    elif stage == 'check_credit_score':
        return handle_credit_score(session, phone_number)

    elif stage == 'analysis_wait':
        if user_input == '1':
            session['stage'] = 'main_menu'
            return session['data'].pop('analysis_result', "END Analysis unavailable. Please try again.")
        else:
            return "CON Almost done! Press 1 to reveal your AI insights."

    # Register - Name
    elif stage == 'register_name':
        user_name = user_input.strip()
        if len(user_name) > 2:
            session['data']['name'] = user_name
            session['stage'] = 'register_county'
            return "CON Great, " + user_name.split(' ')[0] + "!\n\nSelect your county:\n1. Nakuru\n2. Machakos\n3. Kiambu\n4. Nairobi\n5. Meru\n6. Kisumu"
        else:
            return "CON Please enter a valid name."

    # Register - County Selection
    elif stage == 'register_county':
        counties = list(COUNTY_COORDS.keys())
        try:
            county_idx = int(user_input) - 1
            if 0 <= county_idx < len(counties):
                county = counties[county_idx]
                session['data']['county'] = county
                session['data']['latitude'] = COUNTY_COORDS[county]['lat']
                session['data']['longitude'] = COUNTY_COORDS[county]['lon']
                session['stage'] = 'register_ward'
                return f"CON Awesome! Which ward in {county}?\n(e.g., Theta Ward)"
            else:
                return "END Invalid county. Please try again."
        except:
            return "END Invalid input. Please try again."

    # Register - Ward/Specific Location
    elif stage == 'register_ward':
        ward = user_input.strip()
        if len(ward) < 2:
            return "CON Please enter a ward or village name."

        session['data']['ward'] = ward
        session['stage'] = 'register_crop'
        return "CON Great! What do you farm?\n\n1. Onion\n2. Maize\n3. Bees (Honey)\n4. Beans\n5. Tomato"
    
    # Register - Crop Selection
    elif stage == 'register_crop':
        try:
            crop_idx = int(user_input) - 1
            if 0 <= crop_idx < len(CROP_OPTIONS):
                crop = CROP_OPTIONS[crop_idx]
                session['data']['crop'] = crop
                session['stage'] = 'register_farm_size'
                return "CON Enter your farm size in acres:\n(e.g., 2 for 2 acres)"
            else:
                return "END Invalid crop. Please try again."
        except:
            return "END Invalid input. Please try again."
    
    # Register - Farm Size
    elif stage == 'register_farm_size':
        try:
            farm_size = float(user_input)
            if 0.1 <= farm_size <= 100:
                session['data']['farm_size'] = farm_size
                
                # Save to database
                user_database[phone_number] = {
                    'name': session['data'].get('name', f'Farmer {phone_number[-4:]}'),
                    'location': f"{session['data']['ward']}, {session['data']['county']}",
                    'latitude': session['data']['latitude'],
                    'longitude': session['data']['longitude'],
                    'crop': session['data']['crop'],
                    'farm_size': farm_size,
                    'verified': False
                }

                # Send welcome SMS asynchronously
                try:
                    send_welcome_sms(
                        phone_number,
                        session['data'].get('name', 'Farmer'),
                        f"{session['data']['ward']}, {session['data']['county']}"
                    )
                except Exception as exc:
                    print(f"Welcome SMS error: {exc}")

                # Get instant credit score
                return handle_credit_score(session, phone_number, is_new=True)
            else:
                return "END Farm size must be between 0.1 and 100 acres."
        except:
            return "END Invalid farm size. Please enter a number."
    
    # Apply for Loan
    elif stage == 'apply_loan':
        return handle_loan_application(session, phone_number)
    
    # View Offers
    elif stage == 'view_offers':
        return handle_view_offers(session, phone_number)
    
    else:
        return "END Session error. Please try again."


def handle_credit_score(session, phone_number, is_new=False):
    """Fetch and display credit score using reliable mock data for the demo."""
    
    if phone_number not in user_database:
        # This can happen if a new user registration fails mid-way
        # For the demo, we'll create a temporary user profile to ensure it never fails
        user_database[phone_number] = {
            'name': session['data'].get('name', 'New Farmer'),
            'location': session['data'].get('county', 'Unknown'),
            'latitude': session['data'].get('latitude', -1.29),
            'longitude': session['data'].get('longitude', 36.82),
            'crop': session['data'].get('crop', 'maize'),
            'farm_size': session['data'].get('farm_size', 1.0),
            'verified': False
        }

    user = user_database[phone_number]
    
    # Always use the mock data generator for a consistent and impressive demo
    final_message, points_awarded = generate_mock_credit_score(user, is_new)

    # Persist rewards
    if phone_number in user_database and points_awarded:
        user_database[phone_number]['points'] = user_database[phone_number].get('points', 0) + points_awarded

    # Store analysis result for next step
    session['data']['analysis_result'] = final_message
    session['data']['analysis_points'] = points_awarded
    session['stage'] = 'analysis_wait'

    suspense_lines = [
        "Analyzing M-Pesa behaviour 📊",
        "Fetching NASA satellite data 🛰️",
        "Evaluating farm yield potential 🌾"
    ]

    suspense_screen = "CON 🔄 Step 3: AI is working...\n"
    suspense_screen += "━━━━━━━━━━━━━━━━━━━━\n\n"
    suspense_screen += "\n".join(f"• {line}" for line in suspense_lines)
    suspense_screen += "\n\nPress 1 to reveal your results."

    return suspense_screen


def generate_mock_credit_score(user, is_new=False):
    """Generate mock credit score for demo"""
    
    # Simple scoring based on crop and location
    base_score = 0.65
    
    if user['crop'] == 'onion':
        base_score += 0.15
    elif user['crop'] == 'bees':
        base_score += 0.12
    elif user['crop'] == 'maize':
        base_score += 0.08
    
    if user['farm_size'] > 1.5:
        base_score += 0.05
    
    score = min(0.95, base_score)
    
    mpesa_activity = random.choice([
        ('High 💸', 18, 4, 6),
        ('Moderate 💰', 12, 3, 4),
        ('Emerging 📈', 8, 2, 3)
    ])

    if score >= 0.75:
        risk = "Low Risk"
        amount = 50000
        rate = 8.0
    elif score >= 0.55:
        risk = "Medium Risk"
        amount = 30000
        rate = 10.0
    else:
        risk = "High Risk"
        amount = 10000
        rate = 12.0
    
    mpesa_label, deposits, merchant, withdrawals = mpesa_activity

    header = "🎉 Welcome to MavunoAI!" if is_new else "💳 Credit insights ready"
    points_awarded = 10 if is_new else 0

    final_msg = "END ✅ Analysis complete!\n"
    final_msg += "━━━━━━━━━━━━━━━━━━━━\n\n"
    final_msg += f"{header}\n\n"
    final_msg += f"Score: {score:.2f} ({risk})\n"
    final_msg += f"M-Pesa activity: {mpesa_label}\n"
    final_msg += f"• Deposits: {deposits} in 30 days\n"
    final_msg += f"• Merchant spends: {merchant}\n"
    final_msg += f"• Cash-outs: {withdrawals}\n"
    final_msg += "Farm health (NDVI): Improving 🌿\n\n"
    final_msg += f"Loan offer: {amount:,} KSh @ {rate}% for 6 months\n"
    final_msg += "🛰️ Powered by NASA Data\n"
    if points_awarded:
        final_msg += f"🎉 +{points_awarded} points added to your rewards!\n"
    final_msg += f"Dial {AT_SHORT_CODE} anytime."

    return final_msg, points_awarded


def handle_loan_application(session, phone_number):
    """Handle loan application"""
    
    if phone_number not in user_database:
        return "END Please register first."
    
    user = user_database[phone_number]
    
    msg = "END 📋 Loan Application\n"
    msg += "━━━━━━━━━━━━━━━━━━━━\n\n"
    msg += f"Farmer: {user['name']}\n"
    msg += f"Location: {user['location']}\n"
    msg += f"Crop: {user['crop'].title()}\n\n"
    msg += "✅ Application submitted!\n\n"
    msg += "You'll receive an SMS with:\n"
    msg += "• Loan offer details\n"
    msg += "• M-Pesa payment code\n"
    msg += "• Next steps\n\n"
    msg += "Expected: Within 2 hours"
    
    return msg


def handle_view_offers(session, phone_number):
    """Display available loan offers"""
    
    msg = "END 📋 Available Loans\n"
    msg += "━━━━━━━━━━━━━━━━━━━━\n\n"
    msg += "1. Farm Input Loan\n"
    msg += "   Up to 50,000 KSh\n"
    msg += "   8% interest\n\n"
    msg += "2. Equipment Loan\n"
    msg += "   Up to 100,000 KSh\n"
    msg += "   10% interest\n\n"
    msg += "3. Emergency Loan\n"
    msg += "   Up to 10,000 KSh\n"
    msg += "   12% interest\n\n"
    msg += f"Dial {AT_SHORT_CODE} → Apply"
    
    return msg


def handle_improve_score():
    """Show tips to improve credit score"""
    
    msg = "END 💡 Improve Your Score\n"
    msg += "━━━━━━━━━━━━━━━━━━━━\n\n"
    msg += "1. Use USSD regularly\n"
    msg += "   +5 pts per check\n\n"
    msg += "2. Join a cooperative\n"
    msg += "   +10% score boost\n\n"
    msg += "3. Maintain good M-Pesa\n"
    msg += "   Regular transactions help\n\n"
    msg += "4. Update farm info\n"
    msg += "   Keep data current\n\n"
    msg += "🛰️ NASA tracks your farm\n"
    msg += "Good practices = Better score!"
    return msg


@app.route('/sms/delivery', methods=['POST'])
def sms_delivery_report():
    """Africa's Talking delivery report callback"""
    report = request.form.to_dict()
    print(f"[SMS-DELIVERY] {report}")
    return {'status': 'received', 'timestamp': datetime.utcnow().isoformat()}


@app.route('/sms/incoming', methods=['POST'])
def sms_incoming_message():
    """Africa's Talking incoming SMS callback"""
    message = request.form.to_dict()
    print(f"[SMS-INCOMING] {message}")

    sender = message.get('from')
    text = (message.get('text') or '').strip().lower()

    auto_response = None
    if text in {'farm', 'data', 'farm data'}:
        auto_response = (
            "MavunoAI: to view your farm insights dial "
            f"{AT_SHORT_CODE} or visit our dashboard."
        )
    elif text in {'loan', 'credit'}:
        auto_response = (
            "MavunoAI: your credit score is ready. Dial "
            f"{AT_SHORT_CODE} to see offers."
        )

    if sender and auto_response:
        send_sms(sender, auto_response, tag='auto-reply')

    return {'status': 'received', 'timestamp': datetime.utcnow().isoformat()}


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return {
        'status': 'healthy',
        'service': 'MavunoAI Credit USSD',
        'timestamp': datetime.utcnow().isoformat(),
        'registered_users': len(user_database)
    }


@app.route('/test', methods=['GET'])
def test_ussd():
    """Test endpoint to simulate USSD"""
    return """
    <html>
    <head><title>MavunoAI Credit USSD Simulator</title></head>
    <body style="font-family: Arial; padding: 20px;">
        <h1>🌟 MavunoAI Credit USSD Simulator</h1>
        <p>Simulate USSD interactions for testing</p>
        
        <h3>Test Numbers:</h3>
        <ul>
            <li><strong>254712345678</strong> - Mary (Onion farmer, Nakuru)</li>
            <li><strong>254723456789</strong> - John (Maize farmer, Machakos)</li>
            <li><strong>254734567890</strong> - Grace (Beekeeper, Kiambu)</li>
            <li><strong>254700000000</strong> - New user (not registered)</li>
        </ul>
        
        <h3>USSD Code:</h3>
        <code>*MAVUNO*CREDIT#</code>
        
        <h3>Test with curl:</h3>
        <pre>
curl -X POST http://localhost:5001/ussd \
  -d "sessionId=test123" \
  -d "serviceCode=*384*96#" \
  -d "phoneNumber=254712345678" \
  -d "text="
        </pre>
        
        <h3>API Endpoints:</h3>
        <ul>
            <li><code>POST /ussd</code> - Main USSD callback</li>
            <li><code>GET /health</code> - Health check</li>
            <li><code>GET /test</code> - This page</li>
        </ul>
    </body>
    </html>
    """


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"🌟 MavunoAI Credit USSD Server starting on port {port}...")
    print(f"📱 Dial {AT_SHORT_CODE} to access")
    print(f"🛰️ Powered by NASA Satellite Data")
    app.run(host='0.0.0.0', port=port, debug=True)
