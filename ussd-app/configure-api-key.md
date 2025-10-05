# 🔑 Africa's Talking API Key Configuration

## Your Current Dashboard Info:
- **Account**: immanuel maina / imaina671@gmail.com
- **Short Code**: 29187
- **Username**: imaina671

## Step 1: Get Your API Key

1. **Login to Africa's Talking Dashboard**: https://account.africastalking.com/
2. **Go to Settings**: Click on "Settings" in the left sidebar
3. **Find API Keys**: Look for "API Keys" or "Developer" section
4. **Copy Your API Key**: It will be a long string like: `abc123def456789...`

## Step 2: Create .env File

Create a file called `.env` in the `ussd-app` directory with this content:

```bash
# Africa's Talking Configuration
AT_USERNAME=imaina671
AT_API_KEY=your_actual_api_key_here
AT_SENDER_ID=EOFarm

# Backend API Configuration  
API_BASE_URL=http://localhost:8000

# Flask Configuration
FLASK_ENV=development
PORT=5000

# Database Configuration (if needed)
DATABASE_URL=sqlite:///ussd_sessions.db
```

## Step 3: Replace the API Key

Replace `your_actual_api_key_here` with your real API key from the dashboard.

## Step 4: Test Your Configuration

Once you have your API key, run:

```bash
cd ussd-app
python test-sms.py
```

This will:
- ✅ Test your API credentials
- ✅ Send a test SMS
- ✅ Verify everything is working

## Step 5: Start Your USSD Service

```bash
cd ussd-app
python app.py
```

## Your USSD Configuration:
- **Short Code**: 29187
- **Callback URL**: http://your-ngrok-url.ngrok.io/ussd
- **Service Code**: *384*29187#

## Current Status:
✅ USSD is working perfectly
✅ Farm selection works
✅ Weather data displays correctly
❌ SMS needs API key configuration

Once you get your API key and configure the .env file, SMS will work too!
