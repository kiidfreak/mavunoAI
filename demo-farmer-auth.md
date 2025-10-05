# 🌾 MavunoAI Farmer Authentication System Demo

## 🎯 **System Overview**

The MavunoAI platform now includes a comprehensive farmer authentication system with:

- **SQLite Database** with farmer and farm management
- **Session-based Authentication** for USSD, WhatsApp, and Web
- **Farm Management** with location-based services
- **Multi-channel Access** (USSD, WhatsApp, Web Dashboard)

## 📊 **Database Schema**

### Farmers Table
- `id` - Primary key
- `phone_number` - Unique identifier (+254712345678)
- `name` - Farmer's full name
- `email` - Optional email
- `location` - County/District
- `language` - en/sw for localization
- `is_active` - Account status

### Farms Table
- `id` - Primary key
- `farmer_id` - Foreign key to farmers
- `name` - Farm name
- `latitude/longitude` - GPS coordinates
- `size_acres` - Farm size
- `primary_crop` - Main crop (onions, beekeeping, etc.)
- `soil_type` - Soil classification
- `irrigation_type` - Water management

### Sessions Table
- `session_token` - Secure session identifier
- `device_type` - ussd/whatsapp/web
- `expires_at` - Session expiration
- `is_active` - Session status

## 🚀 **API Endpoints**

### Authentication
```bash
# Farmer Login
POST /api/v1/farmer/login?phone_number=+254712345678
Response: {
  "success": true,
  "farmer": {
    "id": 1,
    "name": "John Mwangi",
    "phone": "+254712345678",
    "location": "Nakuru County",
    "language": "en"
  },
  "session_token": "M9uOWy4QGr_0Vo7cBhVdWlCr58eK1LY4ZhOeTyhhoEw"
}

# Get Farmer Profile
GET /api/v1/farmer/profile?session_token=TOKEN
Response: {
  "farmer": {...},
  "farms": [...],
  "total_farms": 2,
  "total_acres": 7.0
}

# Get Farmer Farms
GET /api/v1/farmer/farms?session_token=TOKEN
Response: {
  "farms": [
    {
      "id": 1,
      "name": "Mwangi Onion Farm",
      "location": "Naivasha",
      "coordinates": {"lat": -0.7172, "lon": 36.4306},
      "size_acres": 5.0,
      "primary_crop": "onions",
      "soil_type": "volcanic",
      "irrigation_type": "drip"
    }
  ]
}

# Create New Farm
POST /api/v1/farmer/farms
Body: {
  "session_token": "TOKEN",
  "name": "New Farm",
  "latitude": -1.2921,
  "longitude": 36.8219,
  "location_name": "Machakos",
  "size_acres": 3.0,
  "primary_crop": "maize",
  "soil_type": "red soil",
  "irrigation_type": "rain-fed"
}

# Logout
POST /api/v1/farmer/logout?session_token=TOKEN
```

## 📱 **USSD Integration**

### USSD Menu Flow
```
*384*12345# → Welcome to EO Farm Navigators!
Hello John Mwangi!
Powered by NASA satellite data

1. Weather Forecast
2. Farming Advice  
3. Market Prices
4. My Farm Info
5. Manage Farms ← NEW!
0. Help
```

### Farm Management via USSD
```
5 → Your Farms:
1. Mwangi Onion Farm
   Naivasha - 5.0 acres
   Crop: onions
2. Mwangi Apiary Site  
   Naivasha - 2.0 acres
   Crop: beekeeping
0. Back
```

## 🌱 **Sample Data Created**

### Farmers (5 total)
1. **John Mwangi** (+254712345678) - Nakuru County
   - Mwangi Onion Farm (5 acres, onions)
   - Mwangi Apiary Site (2 acres, beekeeping)

2. **Mary Wanjiku** (+254723456789) - Kiambu County  
   - Wanjiku Mixed Farm (8 acres, maize)

3. **Peter Kiprop** (+254734567890) - Uasin Gishu County
   - Kiprop Wheat Farm (15 acres, wheat)
   - Kiprop Apiary (3 acres, beekeeping)

4. **Grace Akinyi** (+254745678901) - Kisumu County
   - Akinyi Rice Farm (12 acres, rice)

5. **David Kimani** (+254756789012) - Machakos County
   - Kimani Horticulture (4 acres, tomatoes)

## 🔧 **Testing the System**

### 1. Test Backend API
```bash
# Test farmer login
curl -X POST "http://localhost:8000/api/v1/farmer/login?phone_number=%2B254712345678"

# Test farmer profile
curl "http://localhost:8000/api/v1/farmer/profile?session_token=YOUR_TOKEN"

# Test farm listing
curl "http://localhost:8000/api/v1/farmer/farms?session_token=YOUR_TOKEN"
```

### 2. Test USSD Service
```bash
# Health check
curl http://localhost:5000/health

# USSD simulation (via Africa's Talking)
# Phone: +254712345678
# USSD Code: *384*12345#
```

### 3. Test Web Dashboard
- Visit: http://localhost:3000/dashboard
- Login with phone: +254712345678
- View farm data and analytics

## 🎮 **Demo Scenarios**

### Scenario 1: New Farmer Registration
1. Farmer calls USSD: *384*12345#
2. System authenticates via phone number
3. If new farmer, shows registration prompt
4. Creates account and session
5. Redirects to main menu

### Scenario 2: Existing Farmer Login
1. Farmer calls USSD: *384*12345#
2. System recognizes phone number
3. Creates session automatically
4. Shows personalized menu: "Hello John Mwangi!"
5. Access to farm management

### Scenario 3: Farm Management
1. Select "5. Manage Farms"
2. View existing farms with details
3. Add new farm via USSD (limited)
4. Full farm management via web dashboard

## 🔐 **Security Features**

- **Session Tokens**: Secure 32-character tokens
- **Session Expiration**: 24-hour timeout
- **Device Tracking**: ussd/whatsapp/web sessions
- **Phone Validation**: Kenyan phone number format
- **Data Isolation**: Farmers only see their own data

## 📈 **Integration Points**

### With Existing Services
- **Weather Service**: Location-based weather for farms
- **Advisory Service**: Crop-specific advice per farm
- **Carbon Service**: Farm-level carbon tracking
- **Apiary Service**: Beekeeping-specific features

### Multi-Channel Access
- **USSD**: Basic farm info and management
- **WhatsApp**: Rich media and detailed reports  
- **Web Dashboard**: Full analytics and planning
- **API**: Third-party integrations

## 🚀 **Next Steps**

1. **WhatsApp Integration**: Add farmer authentication to WhatsApp bot
2. **SMS Notifications**: Send alerts to farmers
3. **Payment Integration**: M-Pesa for premium features
4. **Multi-language**: Swahili support for USSD
5. **Offline Mode**: Cache data for poor connectivity

---

## 🎯 **Ready for Hackathon Demo!**

The farmer authentication system is now fully functional with:
- ✅ Database with sample data
- ✅ API endpoints working
- ✅ USSD integration
- ✅ Session management
- ✅ Farm management
- ✅ Multi-channel support

**Test it now**: Call *384*12345# with any of the sample phone numbers!
