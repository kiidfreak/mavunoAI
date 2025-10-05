# 📱 Africa's Talking USSD Integration Guide

## 🎯 **Overview**

This guide shows how to integrate MavunoAI with Africa's Talking USSD and SMS services for farmer communication.

## 🔧 **Setup Steps**

### 1. Africa's Talking Account Setup

1. **Create Account**: Visit [Africa's Talking](https://africastalking.com)
2. **Get API Credentials**:
   - Username: `sandbox` (for testing) or your production username
   - API Key: Get from your dashboard
   - Sender ID: `EOFarm` (for SMS)

### 2. USSD Service Configuration

#### Create USSD Application
```bash
# In Africa's Talking Dashboard:
Service Code: *384*12345#
Callback URL: https://your-domain.com/ussd
```

#### Environment Variables
```bash
# Create ussd-app/.env file
AT_USERNAME=sandbox
AT_API_KEY=your_api_key_here
AT_SENDER_ID=EOFarm
API_BASE_URL=http://localhost:8000
```

### 3. Webhook Configuration

#### Local Testing (ngrok)
```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 5000

# Use the HTTPS URL as callback:
# https://abc123.ngrok.io/ussd
```

#### Production Deployment
```bash
# Deploy to Railway/Heroku/AWS
# Set callback URL to: https://your-app.railway.app/ussd
```

## 📱 **USSD Flow Testing**

### Test with Africa's Talking Simulator

1. **Dial**: `*384*12345#`
2. **Expected Flow**:
   ```
   Welcome to EO Farm Navigators!
   Hello John Mwangi!
   Powered by NASA satellite data
   
   1. Weather Forecast
   2. Farming Advice
   3. Market Prices
   4. My Farm Info
   5. Manage Farms
   0. Help
   ```

### Sample Phone Numbers for Testing
- `+254712345678` - John Mwangi (Nakuru)
- `+254723456789` - Mary Wanjiku (Kiambu)
- `+254734567890` - Peter Kiprop (Uasin Gishu)
- `+254745678901` - Grace Akinyi (Kisumu)
- `+254756789012` - David Kimani (Machakos)

## 🔄 **USSD Webhook Format**

### Request Format (from Africa's Talking)
```json
{
  "sessionId": "ATUid_1234567890",
  "phoneNumber": "+254712345678",
  "text": "1*1",
  "serviceCode": "*384*12345#"
}
```

### Response Format (to Africa's Talking)
```
CON Welcome to EO Farm Navigators!
Hello John Mwangi!
Powered by NASA satellite data

1. Weather Forecast
2. Farming Advice
3. Market Prices
4. My Farm Info
5. Manage Farms
0. Help
```

## 📧 **SMS Integration**

### SMS Features
- **Weather Details**: Detailed 7-day forecast via SMS
- **Farm Alerts**: Irrigation, planting, harvesting reminders
- **Market Updates**: Price alerts and trends
- **Advisory Reports**: Detailed farming recommendations

### SMS API Usage
```python
def send_sms(phone_number, message):
    url = "https://api.africastalking.com/version1/messaging"
    headers = {
        "apiKey": AT_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "username": AT_USERNAME,
        "to": phone_number,
        "message": message,
        "from": AT_SENDER_ID
    }
    response = requests.post(url, headers=headers, data=data)
```

## 🧪 **Testing Scenarios**

### Scenario 1: Weather Request
1. Dial `*384*12345#`
2. Select `1` (Weather Forecast)
3. Select `1` (Machakos)
4. Receive USSD response + SMS with details

### Scenario 2: Farm Management
1. Dial `*384*12345#`
2. Select `5` (Manage Farms)
3. View farm list
4. Get SMS with farm details

### Scenario 3: New Farmer
1. Dial `*384*12345#` with new phone number
2. System creates new farmer account
3. Redirects to registration flow

## 🚀 **Production Deployment**

### Railway Deployment
```bash
# 1. Connect GitHub repository
# 2. Set environment variables:
AT_USERNAME=your_production_username
AT_API_KEY=your_production_api_key
AT_SENDER_ID=EOFarm
API_BASE_URL=https://your-backend.railway.app

# 3. Deploy
# 4. Update Africa's Talking callback URL
```

### Environment Variables
```bash
# Production Environment
AT_USERNAME=your_username
AT_API_KEY=your_production_api_key
AT_SENDER_ID=EOFarm
API_BASE_URL=https://mavunoai-backend.railway.app
FLASK_ENV=production
```

## 📊 **Monitoring & Analytics**

### USSD Analytics
- Session count and duration
- Menu navigation patterns
- Error rates and timeouts
- Geographic distribution

### SMS Analytics
- Delivery rates
- Response rates
- Cost tracking
- Message performance

## 🔐 **Security Considerations**

### Webhook Security
```python
# Verify webhook authenticity
def verify_webhook(request):
    # Add signature verification
    # Rate limiting
    # IP whitelisting
    pass
```

### Data Protection
- Encrypt sensitive farmer data
- Secure session management
- GDPR compliance for EU farmers
- Data retention policies

## 🎯 **Demo Script**

### For Hackathon Presentation

1. **Setup**: Show Africa's Talking dashboard
2. **Test USSD**: Dial `*384*12345#` live
3. **Show SMS**: Demonstrate SMS notifications
4. **Backend Integration**: Show API calls in logs
5. **Farmer Data**: Display personalized responses

### Key Talking Points
- **Rural Access**: USSD works on any phone
- **No Internet Required**: Works without data
- **Multi-language**: English/Swahili support
- **Cost Effective**: Low-cost communication
- **Scalable**: Handles thousands of farmers

## 📈 **Scaling Considerations**

### Performance
- Redis for session storage
- Database connection pooling
- Caching for frequent requests
- Load balancing for high traffic

### Cost Optimization
- SMS bundling for bulk messages
- USSD session optimization
- Smart caching to reduce API calls
- Offline mode for poor connectivity

---

## 🎉 **Ready for Production!**

Your MavunoAI USSD service is now integrated with Africa's Talking:

- ✅ USSD webhook configured
- ✅ SMS notifications working
- ✅ Farmer authentication integrated
- ✅ Multi-channel communication ready
- ✅ Production deployment ready

**Next**: Deploy to production and start serving farmers! 🌾📱
