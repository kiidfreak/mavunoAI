# SMS Configuration for USSD App

## Current Status
✅ **USSD Fixed**: Farm names now display correctly (Naivasha instead of Unknown)
✅ **Farm Selection**: Working perfectly (1*1, 1*2, etc.)
✅ **Weather Data**: Retrieved and displayed correctly
⏳ **SMS**: Ready to configure with Africa's Talking API

## Africa's Talking Configuration

### 1. Get Your API Key
From your Africa's Talking dashboard:
1. Go to **Settings** → **API Keys**
2. Copy your **API Key** (it should look like: `abc123def456...`)
3. Note your **Username** (usually your email or sandbox username)

### 2. Configure Environment Variables

Create a `.env` file in the `ussd-app` directory:

```bash
# Africa's Talking Configuration
AT_USERNAME=your_username_here
AT_API_KEY=your_api_key_here
AT_SENDER_ID=29187

# Backend API Configuration  
API_BASE_URL=http://localhost:8000

# Flask Configuration
FLASK_ENV=development
PORT=5000
```

### 3. Test SMS Functionality

Once configured, the USSD will:
- Send detailed weather SMS to users
- Show debugging output in server logs
- Handle SMS delivery reports

### 4. USSD Short Code Setup

Your USSD service should be configured with:
- **Short Code**: 29187
- **Service Code**: *384*29187#
- **Callback URL**: `http://your-server.com/ussd`

## Testing

Run the test to verify everything works:

```bash
python test-farm-selection.py
```

Expected output:
- Farm names display correctly
- Weather data retrieved
- SMS sent (if API key configured)
- Debug logs show SMS attempts

## Next Steps

1. Get your API key from Africa's Talking dashboard
2. Update the `.env` file with your credentials
3. Test the USSD flow
4. Deploy to your server with the callback URL
