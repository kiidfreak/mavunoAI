# 🌍 EO FARM NAVIGATORS — Complete System Documentation

## Executive Summary

**EO Farm Navigators** is a multi-channel agricultural intelligence platform that democratizes access to NASA and Digital Earth Africa satellite data for African farmers. The system bridges the digital divide by delivering climate-smart farming insights through web dashboards, WhatsApp bots, and USSD (feature phone) interfaces, while creating sustainable revenue through Carbon Corp entity partnerships.

---

## Table of Contents

1. [Vision & Mission](#1-vision--mission)
2. [System Architecture](#2-system-architecture)
3. [Technical Components](#3-technical-components)
4. [Data Sources & Integration](#4-data-sources--integration)
5. [Core Services](#5-core-services)
6. [Access Channels](#6-access-channels)
7. [User Journeys](#7-user-journeys)
8. [Business Model](#8-business-model)
9. [Implementation Roadmap](#9-implementation-roadmap)
10. [Tech Stack](#10-tech-stack)
11. [API Specifications](#11-api-specifications)
12. [Deployment Strategy](#12-deployment-strategy)

---

## 1. Vision & Mission

### Vision
Create a **multi-channel platform** where farmers can simulate decisions (web) and receive real-time actionable insights (USSD/WhatsApp) powered by NASA + Digital Earth Africa datasets.

### Mission
- **Democratize Earth Observation data** for smallholder farmers across Africa
- **Bridge the digital divide** through USSD/SMS for feature phone users
- **Enable climate-smart agriculture** with real-time satellite intelligence
- **Create sustainable impact** through carbon finance and entity partnerships

### Core Principles
1. **Accessibility First**: Works on ANY phone (smartphone or feature phone)
2. **Data-Driven Decisions**: NASA/EO data translated to actionable insights
3. **Multi-Stakeholder Value**: Farmers, entities, governments all benefit
4. **Offline-Capable**: USSD works without internet connectivity

---

## 2. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA SOURCES LAYER                       │
│  • NASA EarthData (CHIRPS, SMAP)                           │
│  • Digital Earth Africa (NDVI, Land Cover)                 │
│  • Local Weather APIs (Kenya Met, Regional)                │
│  • Agricultural Datasets (FAO, KALRO, AfSIS)               │
│  • Market Data (RBA, World Bank)                           │
│  • Carbon Corp Financial/ESG Reports (60 entities)         │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              PROCESSING & INTELLIGENCE LAYER                │
│  • ETL Pipeline (Python, Apache Airflow)                   │
│  • PostgreSQL + PostGIS (Geospatial Queries)               │
│  • Redis Cache (Hot Data)                                  │
│  • ML Models (Yield Prediction, Risk Analysis)             │
│  • Carbon Analytics Engine                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   CORE SERVICES LAYER                       │
│  • Simulation API (FastAPI - Crop Decision Modeling)       │
│  • Advisory Engine (Rules-based Alerts)                    │
│  • Forecasting Service (Climate & Yield Predictions)       │
│  • Carbon Dashboard API (Sustainability Metrics)           │
│  • Market Intelligence Service                             │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
┌────────▼─────┐ ┌──▼────────┐ ┌▼──────────┐
│ Web Platform │ │ WhatsApp  │ │ USSD App  │
│ (React+D3.js)│ │ Bot       │ │ (Africa's │
│              │ │ (Twilio)  │ │ Talking)  │
└──────────────┘ └───────────┘ └───────────┘
         │           │           │
         └───────────┼───────────┘
                     │
         ┌───────────▼───────────┐
         │   END USERS           │
         │ • Farmers             │
         │ • Carbon Corp Entities│
         │ • NGOs/Governments    │
         └───────────────────────┘
```

### Architecture Layers

#### Layer 1: Data Sources
- **Satellite Data**: NASA CHIRPS (rainfall), SMAP (soil moisture), Landsat/Sentinel NDVI
- **Local Datasets**: Weather stations, soil maps, crop calendars
- **Financial Data**: Carbon Corp ESG reports, agricultural financing data
- **Market Data**: Commodity prices, supply chain information

#### Layer 2: Processing & Intelligence
- **Data Ingestion**: Scheduled ETL jobs pulling from APIs
- **Storage**: PostgreSQL for structured data, PostGIS for spatial queries
- **Caching**: Redis for frequently accessed data (weather forecasts, alerts)
- **AI/ML**: Predictive models for yield, climate risk, carbon impact

#### Layer 3: Core Services
- **Simulation Engine**: Models crop outcomes based on farmer decisions
- **Advisory System**: Generates contextual recommendations
- **Forecasting**: Predicts yields, rainfall patterns, market prices
- **Analytics**: Carbon footprint calculation, sustainability metrics

#### Layer 4: Access Channels
- **Web**: Full-featured dashboard for data-intensive users
- **WhatsApp**: Conversational interface for smartphone users
- **USSD**: Text-based menu system for feature phones (offline-first)
- **SMS**: Alert delivery for critical notifications

#### Layer 5: Value Creation
- **Education**: Interactive farming simulators
- **Financial Services**: Carbon credit facilitation, agri-financing
- **Policy Support**: Data dashboards for government/NGO decision-making

---

## 3. Technical Components

### A. Data Pipeline

**ETL Architecture:**
```python
# Pseudocode for data ingestion
class DataPipeline:
    def fetch_nasa_data(location, date_range):
        # Pull CHIRPS rainfall data
        rainfall = NASA_API.get_chirps(location, date_range)
        
        # Pull SMAP soil moisture
        soil_moisture = NASA_API.get_smap(location, date_range)
        
        return process_and_store(rainfall, soil_moisture)
    
    def fetch_local_weather(location):
        # Kenya Met Department API
        weather = KMD_API.get_forecast(location)
        return weather
    
    def aggregate_and_cache():
        # Store in Redis for fast access
        redis.setex(f"weather:{location}", 3600, data)
```

**Data Flow:**
1. Scheduled jobs (cron/Airflow) trigger data fetches every 6-24 hours
2. Raw data stored in PostgreSQL with PostGIS extensions
3. Processed insights cached in Redis
4. ML models retrained weekly with new data

### B. Geospatial Processing

**PostGIS Queries:**
```sql
-- Find farms within drought-risk zones
SELECT 
    f.farm_id, 
    f.farmer_name, 
    ST_Distance(f.location, d.drought_zone) as distance_km,
    d.severity
FROM farms f
JOIN drought_zones d 
    ON ST_DWithin(f.location, d.drought_zone, 50000) -- 50km radius
WHERE d.severity > 0.7
ORDER BY distance_km;
```

### C. Machine Learning Models

**Yield Prediction Model:**
```python
import numpy as np
from sklearn.ensemble import RandomForestRegressor

class YieldPredictor:
    def __init__(self):
        self.model = RandomForestRegressor()
        
    def train(self, historical_data):
        # Features: rainfall, NDVI, soil moisture, temp, farmer actions
        X = historical_data[['rainfall', 'ndvi', 'soil_moisture', 
                            'temperature', 'fertilizer_used', 'irrigation']]
        y = historical_data['yield']
        
        self.model.fit(X, y)
    
    def predict(self, current_conditions, farmer_action):
        features = np.array([
            current_conditions['rainfall'],
            current_conditions['ndvi'],
            current_conditions['soil_moisture'],
            current_conditions['temperature'],
            farmer_action['fertilizer'],
            farmer_action['irrigation']
        ]).reshape(1, -1)
        
        return self.model.predict(features)[0]
```

**Risk Analysis Model:**
- Drought probability using rainfall patterns + NDVI trends
- Pest risk based on temperature + humidity + historical outbreaks
- Market volatility prediction from price time series

---

## 4. Data Sources & Integration

### NASA EarthData

**CHIRPS (Climate Hazards Group InfraRed Precipitation with Station data)**
- **Source**: https://data.chc.ucsb.edu/products/CHIRPS-2.0/
- **Resolution**: 0.05° (~5.5km)
- **Frequency**: Daily, Pentadal, Monthly
- **Usage**: Rainfall deficit detection, drought monitoring

**SMAP (Soil Moisture Active Passive)**
- **Source**: https://smap.jpl.nasa.gov/data/
- **Resolution**: 9km, 36km
- **Frequency**: 2-3 days
- **Usage**: Irrigation scheduling, drought early warning

**Landsat/Sentinel NDVI**
- **Source**: USGS Earth Explorer, Copernicus Open Access Hub
- **Resolution**: 10-30m
- **Frequency**: 5-16 days
- **Usage**: Vegetation health monitoring, crop growth tracking

### Digital Earth Africa

**API Endpoints:**
- **Sandbox**: https://sandbox.digitalearth.africa/
- **Datasets**: Water Observations, Fractional Cover, Geomedian
- **Integration**: Python API (odc-stac, xarray)

**Example Code:**
```python
import datacube

dc = datacube.Datacube(app='farm_navigator')

# Load NDVI for a farm location
data = dc.load(
    product='s2_l2a',
    x=(36.8, 36.9),  # Longitude
    y=(-1.3, -1.2),  # Latitude
    time=('2024-01', '2024-12'),
    measurements=['nir', 'red']
)

# Calculate NDVI
ndvi = (data.nir - data.red) / (data.nir + data.red)
```

### Local Datasets

**Kenya Meteorological Department**
- **API**: http://api.kmd.go.ke/
- **Data**: Real-time weather, 7-day forecasts
- **Authentication**: API key required

**KALRO (Kenya Agricultural Research Organization)**
- **Data**: Crop calendars, pest alerts, soil maps
- **Format**: CSV, GeoJSON
- **Update Frequency**: Seasonal

**Market Prices**
- **RBA (Regional Bulk Traders Association)**
- **World Bank Commodity Prices**
- **Local market surveys**

### Carbon Corp Data (60 Entities)

**Data Types:**
- Financial reports (annual/quarterly)
- ESG sustainability metrics
- Agricultural investment portfolios
- Carbon credit transactions

**Integration:**
- Manual upload via admin dashboard
- OCR processing for scanned documents
- Structured data extraction using NLP

---

## 5. Core Services

### A. Simulation API

**Purpose:** Allow farmers to model "what-if" scenarios before making decisions.

**Endpoint:** `POST /api/v1/simulate`

**Request:**
```json
{
  "location": {
    "latitude": -1.2921,
    "longitude": 36.8219
  },
  "crop": "maize",
  "actions": {
    "planting_date": "2024-03-15",
    "fertilizer_kg_per_ha": 50,
    "irrigation_mm_per_week": 25
  },
  "scenario_duration_days": 120
}
```

**Response:**
```json
{
  "simulation_id": "sim_abc123",
  "predicted_yield_kg_per_ha": 3200,
  "confidence_interval": [2800, 3600],
  "water_usage_m3": 450,
  "cost_estimate_usd": 180,
  "recommendations": [
    "Increase irrigation during week 8-10 (flowering stage)",
    "Soil moisture adequate - reduce fertilizer by 10%"
  ],
  "climate_data_used": {
    "avg_rainfall_mm": 120,
    "avg_temp_c": 24,
    "ndvi_trend": "increasing"
  }
}
```

**Algorithm:**
1. Fetch historical climate data for location
2. Load crop growth model (DSSAT-like simplified)
3. Run simulation with farmer's inputs
4. Compare against optimal conditions
5. Generate recommendations

### B. Advisory Engine

**Purpose:** Generate contextual, timely recommendations based on real-time data.

**Rule Examples:**
```python
class AdvisoryRules:
    @rule
    def low_rainfall_alert(farm):
        if farm.rainfall_last_30_days < farm.crop.water_requirement * 0.7:
            return Alert(
                priority="HIGH",
                message="Rainfall 30% below normal. Irrigation recommended.",
                action="Consider supplemental irrigation 20-30mm this week"
            )
    
    @rule
    def optimal_planting_window(farm):
        if farm.location.is_long_rains_season() and \
           farm.soil_moisture > 0.6:
            return Alert(
                priority="MEDIUM",
                message="Optimal planting window opening",
                action="Plant maize within next 7-10 days"
            )
    
    @rule
    def pest_risk_alert(farm):
        if farm.temp > 25 and farm.humidity > 70 and \
           farm.crop == "tomato":
            return Alert(
                priority="HIGH",
                message="High risk of late blight disease",
                action="Apply fungicide preventatively"
            )
```

**Delivery Channels:**
- **WhatsApp**: Rich cards with images/charts
- **SMS**: Plain text for critical alerts
- **USSD**: Retrieved on-demand by farmer

### C. Forecasting Service

**Weather Forecasting:**
- 7-day: Kenya Met Department data
- 30-day: Ensemble models (GFS, ECMWF)
- Seasonal: NASA GEOS-5 climate predictions

**Yield Forecasting:**
```python
def forecast_yield(farm_id, current_date):
    farm = get_farm(farm_id)
    
    # Historical yield data
    hist_yields = get_historical_yields(farm_id)
    
    # Current season data
    current_ndvi = get_ndvi_time_series(farm.location, current_date)
    rainfall = get_rainfall(farm.location, current_date)
    
    # ML model prediction
    features = engineer_features(hist_yields, current_ndvi, rainfall)
    predicted_yield = ml_model.predict(features)
    
    return {
        'predicted_yield': predicted_yield,
        'harvest_date_estimate': calculate_harvest_date(farm.crop),
        'confidence': calculate_confidence(features)
    }
```

**Market Price Forecasting:**
- Time series analysis (ARIMA, Prophet)
- Supply/demand modeling
- Regional price correlation

### D. Carbon Dashboard API

**Purpose:** Provide Carbon Corp entities with sustainability metrics derived from EO data.

**Endpoint:** `GET /api/v1/carbon/entity/{entity_id}/dashboard`

**Response:**
```json
{
  "entity_name": "ABC Agri Finance Ltd",
  "reporting_period": "2024-Q3",
  "metrics": {
    "total_farms_financed": 1250,
    "total_hectares_monitored": 3400,
    "carbon_sequestration_tonnes_co2": 4200,
    "water_saved_m3": 125000,
    "sustainable_practice_adoption_rate": 0.68
  },
  "land_cover_change": {
    "forest_restored_ha": 45,
    "degraded_land_rehabilitated_ha": 120
  },
  "farmer_impact": {
    "avg_yield_increase_percent": 18,
    "farmers_above_poverty_line": 890
  },
  "verification": {
    "satellite_imagery_sources": ["Landsat-8", "Sentinel-2"],
    "ground_truth_samples": 85,
    "confidence_score": 0.92
  }
}
```

---

## 6. Access Channels

### A. Web Platform

**Technology:** React, D3.js, TailwindCSS

**Key Features:**
1. **Interactive Farm Simulator**
   - Drag-and-drop crop planting
   - Real-time yield calculation
   - Climate scenario modeling
   
2. **Geospatial Dashboard**
   - Leaflet/Mapbox maps
   - NDVI overlay visualization
   - Rainfall heatmaps
   
3. **Decision Support Tools**
   - Crop calendar recommendations
   - Market price tracker
   - Input cost calculator

**Target Users:**
- Agricultural extension officers
- NGO field workers
- Carbon Corp entity managers
- Tech-savvy farmers with smartphones

**Sample Component:**
```jsx
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

function YieldSimulator() {
  const [fertilizer, setFertilizer] = useState(50);
  const [irrigation, setIrrigation] = useState(25);
  
  const simulateYield = async () => {
    const response = await fetch('/api/v1/simulate', {
      method: 'POST',
      body: JSON.stringify({ fertilizer, irrigation })
    });
    return response.json();
  };
  
  return (
    <div>
      <h2>Maize Yield Simulator</h2>
      <input type="range" value={fertilizer} 
             onChange={e => setFertilizer(e.target.value)} />
      <LineChart data={yieldData}>
        <Line dataKey="yield" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}
```

### B. WhatsApp Bot

**Technology:** Twilio WhatsApp Business API, Node.js

**Conversation Flow:**
```
Farmer: "advice"
Bot: "Hi! I'm FarmNav 🌾 What would you like help with?
     1️⃣ Weather forecast
     2️⃣ Planting advice
     3️⃣ Pest alerts
     Reply with a number."

Farmer: "1"
Bot: "📍 Machakos - Next 7 days:
     🌧️ Tue-Thu: Light rain (15mm)
     ☀️ Fri-Mon: Sunny, hot (28°C)
     
     💡 Recommendation: Good time to plant maize!
     Soil moisture is optimal."

Farmer: "When should I fertilize?"
Bot: "Based on your location and maize crop:
     📅 First application: Now (4 weeks after planting)
     📅 Second application: In 3 weeks (flowering)
     
     Amount: 50kg/ha DAP now, 25kg/ha Urea later
     
     🛰️ Data shows your soil nitrogen is medium.
     Would you like a custom fertilizer plan? (yes/no)"
```

**Implementation:**
```javascript
const twilio = require('twilio');

app.post('/whatsapp/webhook', async (req, res) => {
  const userMessage = req.body.Body.toLowerCase();
  const userPhone = req.body.From;
  
  let response;
  
  if (userMessage.includes('weather')) {
    const location = await getUserLocation(userPhone);
    const weather = await getWeatherForecast(location);
    response = formatWeatherMessage(weather);
  } else if (userMessage.includes('advice')) {
    response = getMainMenu();
  }
  
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(response);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});
```

**Advanced Features:**
- Image recognition for crop disease diagnosis
- Voice note support for low-literacy farmers
- Multilingual support (Swahili, Kikuyu, Luo)

### C. USSD Application

**Technology:** Africa's Talking USSD API, Python Flask

**Why USSD?**
- Works on ANY phone (smartphone or feature phone)
- No internet connection required
- SMS-based fallback for complex responses
- 99% mobile phone penetration in Kenya

**Menu Structure:**
```
*123# (Dial code)
↓
1. Weather
2. Crop Advice
3. Market Prices
4. My Farm
0. Help

[User selects 1]
↓
Select your location:
1. Machakos
2. Nairobi
3. Meru
4. Enter manually

[User selects 1]
↓
📍 Machakos Weather:
Today: Sunny, 26°C
Tomorrow: Rain, 22°C
This week: 25mm rain expected

More info sent via SMS!
```

**Implementation:**
```python
from flask import Flask, request

app = Flask(__name__)

@app.route('/ussd', methods=['POST'])
def ussd():
    session_id = request.values.get("sessionId", None)
    phone_number = request.values.get("phoneNumber", None)
    text = request.values.get("text", "default")
    
    response = ""
    
    if text == '':
        # Main menu
        response = "CON Welcome to FarmNav\n"
        response += "1. Weather Forecast\n"
        response += "2. Crop Advice\n"
        response += "3. Market Prices\n"
        response += "4. My Farm Info"
    
    elif text == '1':
        # Weather submenu
        response = "CON Select location:\n"
        response += "1. Machakos\n"
        response += "2. Nairobi\n"
        response += "3. Meru"
    
    elif text == '1*1':
        # Machakos weather
        weather = get_weather('machakos')
        response = f"END Weather for Machakos:\n"
        response += f"Today: {weather['today']}\n"
        response += f"Tomorrow: {weather['tomorrow']}\n"
        response += "Details sent via SMS!"
        
        # Send detailed SMS
        send_sms(phone_number, get_detailed_weather('machakos'))
    
    return response
```

**SMS Fallback:**
When USSD response is too long, system sends SMS:
```
FarmNav Weather Alert
Machakos - 7 Day Forecast

Mon 15th: Sunny, 26°C, 0mm
Tue 16th: Cloudy, 24°C, 5mm
Wed 17th: Rain, 22°C, 18mm
Thu 18th: Rain, 21°C, 12mm
Fri 19th: Partly cloudy, 25°C, 2mm

💡 Good planting window Wed-Fri!
Soil moisture will be optimal.

Reply HELP for more info
```

---

## 7. User Journeys

### Journey 1: Smallholder Farmer (Feature Phone)

**Profile:**
- **Name:** John Mwangi
- **Location:** Machakos County
- **Farm Size:** 2 acres
- **Crop:** Maize
- **Phone:** Nokia 105 (feature phone, no internet)

**Journey:**
1. **Morning (6 AM):**
   - Receives SMS: "☀️ Good morning! Weather today: Sunny 26°C. No rain expected. Check soil moisture before irrigating."

2. **Mid-Morning (10 AM):**
   - Dials `*123#` (USSD code)
   - Navigates: 1. Weather → 1. Machakos
   - Reads: "This week: 25mm rain Wed-Fri. Good planting window!"
   - Receives follow-up SMS with 7-day detailed forecast

3. **Afternoon (2 PM):**
   - Dials `*123#` again
   - Navigates: 2. Crop Advice → 1. Maize → 3. Fertilizer
   - Reads: "Apply 50kg DAP now (4 weeks after planting). Cost ~4,500 KES"
   - Receives SMS with nearby agro-dealer locations

4. **Evening (6 PM):**
   - Receives SMS alert: "🌧️ Heavy rain alert: 35mm expected tomorrow. Delay fertilizer application by 2 days."

**Outcome:**
- Made informed decision to wait for rain before fertilizing
- Saved money (didn't waste fertilizer that would wash away)
- Learned optimal timing through repeated use

### Journey 2: Progressive Farmer (Smartphone)

**Profile:**
- **Name:** Grace Njeri
- **Location:** Kiambu County
- **Farm Size:** 10 acres
- **Crops:** Mixed (vegetables, coffee)
- **Phone:** Samsung Galaxy A12

**Journey:**
1. **Morning:**
   - Opens WhatsApp, sends "advice" to FarmNav bot
   - Receives interactive card with 3 options
   - Selects "Vegetable garden" → gets tomato disease risk alert

2. **Planning:**
   - Logs into web platform on laptop
   - Uses yield simulator: "What if I increase irrigation by 20%?"
   - Sees prediction: +15% yield but +30% water cost
   - Decides current irrigation is optimal

3. **Market Research:**
   - WhatsApp bot: "market prices tomatoes"
   - Receives: "Nairobi: 45 KES/kg, Mombasa: 38 KES/kg, Trend: ↗️ +12% this week"
   - Plans to harvest next week when prices peak

4. **Ongoing:**
   - Receives WhatsApp messages twice per week with:
     - Weather updates
     - Pest/disease alerts
     - Market opportunities
   - Uses web dashboard monthly to track farm performance

**Outcome:**
- Increased vegetable yields by 22% in one season
- Reduced crop losses from pests (early detection)
- Maximized market prices through timing

### Journey 3: Carbon Corp Entity Manager

**Profile:**
- **Name:** David Omondi
- **Organization:** GreenFinance Kenya Ltd
- **Role:** Sustainability Manager
- **Purpose:** Track impact of agri-finance portfolio

**Journey:**
1. **Quarterly Reporting:**
   - Logs into web dashboard
   - Views "Carbon Impact Dashboard" showing:
     - 1,250 farms financed
     - 4,200 tonnes CO₂ sequestered
     - 18% average yield increase for farmers

2. **Due Diligence:**
   - Zooms into map view
   - Clicks on specific farm in Embu
   - Sees NDVI time series: vegetation health improving
   - Downloads satellite images for investor report

3. **Strategic Planning:**
   - Runs scenario analysis: "What if we finance 500 more farms?"
   - System projects: "+1,680 tonnes CO₂, +850 hectares under sustainable practice"
   - Uses data to justify expansion to board

4. **Verification:**
   - ESG auditor requests proof of impact
   - Exports report with:
     - Satellite imagery timestamped and geocoded
     - Ground-truth validation from 85 sample farms
     - Third-party data sources cited

**Outcome:**
- Secured $2M additional impact investment
- Met ESG reporting requirements with confidence
- Identified high-performing regions for expansion

### Journey 4: Agricultural Extension Officer

**Profile:**
- **Name:** Peter Kimani
- **Organization:** Kenya Ministry of Agriculture
- **Role:** County Extension Officer (Meru)
- **Responsibility:** 500 farmers across 12 villages

**Journey:**
1. **Weekly Planning:**
   - Opens web dashboard
   - Views "Drought Risk Map" for Meru County
   - Identifies 3 villages in high-risk zone (NDVI declining + low rainfall)

2. **Field Visit:**
   - Uses mobile web app on tablet
   - Shows farmers satellite images of their fields
   - Demonstrates: "See how your neighbor's farm is greener? They irrigated early."

3. **Training:**
   - Conducts group training using web simulator
   - Farmers play "Farm Game": make decisions, see outcomes
   - Competitive element: "Who can achieve highest yield?"

4. **Follow-Up:**
   - Receives weekly SMS reports: "85 farmers in your zone checked weather via USSD this week"
   - Identifies engaged farmers for advanced training
   - Shares success stories with county government

**Outcome:**
- Improved farmer engagement (USSD usage up 40%)
- Data-driven decisions for where to focus extension services
- Demonstrated impact to justify budget allocation

---

## 8. Business Model

### Revenue Streams

#### 1. Freemium for Farmers
- **Free Tier:**
  - USSD weather forecasts (3 times/week)
  - SMS alerts for critical events
  - Basic WhatsApp advice (10 questions/month)
  
- **Premium Tier (200 KES/month ~ $1.50):**
  - Unlimited USSD access
  - Unlimited WhatsApp bot interactions
  - Web access to yield simulator
  - Custom planting calendar
  - Market price alerts

#### 2. Carbon Corp Entity Subscriptions
- **Tier 1 (5,000 USD/year):**
  - Dashboard for up to 500 farms
  - Quarterly ESG reports
  - Email support
  
- **Tier 2 (15,000 USD/year):**
  - Dashboard for up to 2,000 farms
  - Monthly reports + custom analytics
  - API access for integration
  - Dedicated account manager
  
- **Tier 3 (50,000 USD/year):**
  - Unlimited farms
  - White-label solution
  - Real-time API
  - Custom ML model training

#### 3. Government/NGO Contracts
- **County Government Package (10,000 USD/year):**
  - Extension officer web access
  - County-level policy dashboard
  - Training for 50 officers
  
- **NGO Partnership (5,000-20,000 USD/project):**
  - Custom deployment for beneficiaries
  - Impact monitoring & evaluation
  - Data export for reporting

#### 4. Data Services (Future)
- Aggregated, anonymized farm data for research institutions
- Market intelligence reports for input suppliers
- Climate risk assessments for insurance companies

### Target Market Size

**Kenya (Year 1 Focus):**
- Smallholder farmers: 5M+ (Target: 10,000 in Year 1)
- Carbon Corp entities: 60 identified (Target: 15 in Year 1)
- County governments: 47 (Target: 3 pilot counties)

**East Africa (Year 2-3 Expansion):**
- Total smallholder farmers: 40M+
- Target: 100,000 farmers by Year 3

### Pricing Rationale

**Farmers:**
- 200 KES/month = cost of 2 SMS bundles
- Affordable for smallholders (avg. income 50,000 KES/year)
- Freemium captures non-paying users for impact metrics

**Entities:**
- Cost per farm: $10-25/year
- Comparable to manual impact monitoring ($50-100/farm)
- ROI from carbon credit verification and ESG compliance

### Unit Economics (Year 1 Projections)

**Farmer Premium Subscribers:**
- Revenue: 10,000 farmers × 200 KES/mo × 12 = 24M KES (~$180,000)
- USSD cost: 2 KES/session × 4 sessions/mo = 8 KES/farmer/mo
- SMS cost: 1 KES/message × 8 messages/mo = 8 KES/farmer/mo
- WhatsApp: Negligible (Twilio free tier + 0.005 USD/message)
- Gross margin per farmer: ~90%

**Carbon Corp Subscriptions:**
- Revenue: 15 entities × avg $20,000/year = $300,000
- Cost to serve: API calls, storage, support = ~$3,000/entity/year
- Gross margin: ~85%

**Total Year 1 Revenue:** ~$480,000
**Operating Costs:** ~$200,000 (team, infrastructure, marketing)
**Net Margin:** ~58%

---

## 9. Implementation Roadmap

### Phase 1: MVP (Months 1-3) - Hackathon Foundation

**Core Features:**
- ✅ Data pipeline for NASA CHIRPS + Kenya Met weather
- ✅ Basic simulation API (maize yield model)
- ✅ USSD app with weather + basic advice
- ✅ Simple web dashboard for demo
- ✅ WhatsApp bot prototype (weather queries)

**Deliverables:**
- Working demo across all 3 channels
- 10 pilot farmers in Machakos
- 1 Carbon Corp entity partner (for validation)

**Success Metrics:**
- USSD sessions: 100+ in first month
- Farmer satisfaction: 8/10 survey score
- Judges impressed at hackathon 🏆

### Phase 2: Beta Launch (Months 4-6)

**Enhancements:**
- ✅ Add NDVI data integration (Digital Earth Africa)
- ✅ Expand crop models (add beans, tomatoes, kale)
- ✅ WhatsApp rich media (charts, images)
- ✅ Web yield simulator with D3.js visualizations
- ✅ Carbon Corp dashboard v1.0

**Partnerships:**
- Onboard 5 Carbon Corp entities
- Partner with 2 county governments for extension officer access
- Collaborate with 1 NGO for farmer training

**Target Users:**
- 500 active farmers
- 3 paying entity customers
- 20 extension officers

### Phase 3: Full Launch (Months 7-12)

**Product Maturity:**
- ✅ ML models for yield prediction (Random Forest → LSTM)
- ✅ Market price forecasting
- ✅ Pest/disease alert system
- ✅ Multilingual support (English, Swahili, Kikuyu)
- ✅ Mobile money integration for premium payments (M-Pesa)

**Scale:**
- 10,000 farmers across 5 counties
- 15 Carbon Corp entity customers
- 10 NGO partnerships

**Monetization:**
- Launch premium tier for farmers
- Tier 2/3 packages for large entities
- First government contract signed

### Phase 4: Regional Expansion (Year 2)

**Geographic:**
- Expand to Uganda, Tanzania, Rwanda
- Localize data sources (met departments, soil maps)
- Adapt USSD codes for each country

**Product:**
- Carbon credit marketplace integration
- Crop insurance risk assessment API
- Community features (farmer forums, leaderboards)

**Target:**
- 50,000 farmers
- 50 entity customers
- $2M ARR

---

## 10. Tech Stack

### Backend

**Core Framework:**
- **FastAPI** (Python 3.10+)
  - Async request handling
  - Auto-generated API docs (OpenAPI)
  - Type hints for reliability

**Databases:**
- **PostgreSQL 14** with PostGIS extension
  - Geospatial queries (ST_Distance, ST_Within)
  - Robust ACID compliance
  - JSON support for flexible schemas
  
- **Redis 7**
  - Cache layer for weather/prices
  - Session management for USSD
  - Rate limiting

**Task Queue:**
- **Celery** with Redis broker
  - Scheduled data fetches (every 6 hours)
  - Async SMS/WhatsApp sending
  - ML model retraining jobs

**Data Processing:**
- **Pandas** - tabular data manipulation
- **GeoPandas** - geospatial data processing
- **Xarray** - multidimensional arrays (satellite data)
- **Rasterio** - raster data I/O

**Machine Learning:**
- **Scikit-learn** - traditional ML (Random Forest, SVM)
- **TensorFlow/Keras** - deep learning (LSTM for time series)
- **Prophet** - time series forecasting (Facebook's library)

**APIs & Integration:**
- **Requests** - HTTP client
- **HTTPX** - async HTTP client
- **Pydantic** - data validation

### Frontend

**Web Application:**
- **React 18** with hooks
- **TypeScript** - type safety
- **Vite** - fast build tool
- **TailwindCSS** - utility-first styling

**Data Visualization:**
- **D3.js** - custom charts
- **Recharts** - React charting library
- **Leaflet** - interactive maps
- **Mapbox GL JS** - satellite imagery overlay

**State Management:**
- **React Context** - global state
- **TanStack Query** - server state caching

**UI Components:**
- **Headless UI** - accessible components
- **Heroicons** - icon library

### Messaging Channels

**USSD:**
- **Africa's Talking API**
  - Sandbox: https://simulator.africastalking.com
  - Production: Premium short codes
  - Pricing: ~0.5 KES per session

**WhatsApp:**
- **Twilio WhatsApp Business API**
  - Webhook-based architecture
  - Rich media support (images, PDFs)
  - Template messages for notifications

**SMS:**
- **Africa's Talking SMS API**
  - Bulk SMS for alerts
  - Delivery reports
  - Pricing: ~0.8 KES per SMS

### Infrastructure

**Hosting:**
- **Railway** (hackathon/MVP)
  - Easy deployment from GitHub
  - Free tier: 500 hours/month
  - Auto-scaling

- **AWS** (production)
  - EC2 for compute
  - RDS for PostgreSQL
  - S3 for satellite imagery storage
  - CloudFront CDN

**Containerization:**
- **Docker** - application containers
- **Docker Compose** - local development
- **Docker Hub** - image registry

**CI/CD:**
- **GitHub Actions**
  - Automated testing
  - Deployment pipelines
  - Code quality checks (black, pylint, mypy)

**Monitoring:**
- **Sentry** - error tracking
- **Prometheus** - metrics collection
- **Grafana** - dashboards
- **LogTail** - log aggregation

### Development Tools

**Version Control:**
- **Git** + **GitHub**
- **Conventional Commits** standard
- **Semantic versioning**

**API Documentation:**
- **Swagger UI** (auto-generated from FastAPI)
- **Postman** - API testing collections

**Testing:**
- **Pytest** - Python testing
- **Jest** - JavaScript testing
- **Playwright** - E2E testing

---

## 11. API Specifications

### Authentication

**Endpoint:** `POST /api/v1/auth/login`

**Request:**
```json
{
  "phone_number": "+254712345678",
  "otp": "123456"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "usr_abc123",
    "phone_number": "+254712345678",
    "name": "John Mwangi",
    "role": "farmer"
  }
}
```

### Weather API

**Endpoint:** `GET /api/v1/weather/forecast`

**Query Parameters:**
- `latitude` (required): -1.2921
- `longitude` (required): 36.8219
- `days` (optional, default 7): 1-14

**Response:**
```json
{
  "location": {
    "latitude": -1.2921,
    "longitude": 36.8219,
    "name": "Machakos",
    "county": "Machakos",
    "country": "Kenya"
  },
  "current": {
    "temperature_c": 26,
    "humidity_percent": 65,
    "wind_speed_kmh": 12,
    "conditions": "Partly Cloudy",
    "updated_at": "2024-10-03T14:00:00Z"
  },
  "forecast": [
    {
      "date": "2024-10-03",
      "temp_min_c": 18,
      "temp_max_c": 28,
      "rainfall_mm": 0,
      "conditions": "Sunny",
      "humidity_avg": 60
    },
    {
      "date": "2024-10-04",
      "temp_min_c": 19,
      "temp_max_c": 26,
      "rainfall_mm": 15,
      "conditions": "Rain",
      "humidity_avg": 75
    }
  ],
  "data_sources": [
    "Kenya Meteorological Department",
    "NASA CHIRPS"
  ]
}
```

### Simulation API

**Endpoint:** `POST /api/v1/simulate`

**Request:**
```json
{
  "location": {
    "latitude": -1.2921,
    "longitude": 36.8219
  },
  "crop": "maize",
  "variety": "hybrid_614",
  "planting_date": "2024-03-15",
  "farm_size_ha": 2,
  "inputs": {
    "fertilizer_dap_kg_ha": 50,
    "fertilizer_urea_kg_ha": 25,
    "irrigation_mm_week": 20,
    "pesticide_applications": 2
  },
  "scenarios": ["current", "optimal", "budget"]
}
```

**Response:**
```json
{
  "simulation_id": "sim_xyz789",
  "created_at": "2024-10-03T14:30:00Z",
  "results": {
    "current": {
      "predicted_yield_kg_ha": 3200,
      "confidence_interval_lower": 2800,
      "confidence_interval_upper": 3600,
      "total_yield_kg": 6400,
      "harvest_date_estimate": "2024-07-10",
      "costs": {
        "fertilizer_usd": 180,
        "irrigation_usd": 120,
        "pesticide_usd": 40,
        "total_usd": 340
      },
      "revenue_estimate_usd": 960,
      "net_profit_usd": 620,
      "roi_percent": 182
    },
    "optimal": {
      "predicted_yield_kg_ha": 4100,
      "adjustments": [
        "Increase DAP to 60kg/ha",
        "Add irrigation during week 8-10",
        "Early pest control (week 3)"
      ],
      "additional_cost_usd": 80,
      "additional_revenue_usd": 360,
      "net_improvement_usd": 280
    },
    "budget": {
      "predicted_yield_kg_ha": 2600,
      "adjustments": [
        "Reduce fertilizer to 40kg/ha DAP only",
        "Rain-fed (no irrigation)",
        "Organic pest control"
      ],
      "cost_savings_usd": 180,
      "revenue_reduction_usd": 240,
      "net_impact_usd": -60
    }
  },
  "recommendations": [
    {
      "priority": "HIGH",
      "action": "Plant between Mar 10-20 for optimal rainfall window",
      "impact": "15-20% yield increase"
    },
    {
      "priority": "MEDIUM",
      "action": "Split fertilizer application (50% at planting, 50% week 4)",
      "impact": "Better nutrient uptake, 8% yield increase"
    }
  ],
  "climate_data": {
    "rainfall_historical_avg_mm": 650,
    "rainfall_forecast_mm": 680,
    "temperature_avg_c": 24,
    "ndvi_current": 0.42,
    "soil_moisture_percent": 68
  }
}
```

### Advisory API

**Endpoint:** `GET /api/v1/advisory/farmer/{farmer_id}`

**Response:**
```json
{
  "farmer_id": "fmr_abc123",
  "generated_at": "2024-10-03T14:00:00Z",
  "alerts": [
    {
      "id": "alert_001",
      "priority": "HIGH",
      "type": "weather",
      "title": "Heavy Rain Warning",
      "message": "35mm rainfall expected tomorrow. Delay fertilizer application by 2-3 days to avoid nutrient leaching.",
      "action_required": true,
      "expires_at": "2024-10-05T00:00:00Z"
    },
    {
      "id": "alert_002",
      "priority": "MEDIUM",
      "type": "pest",
      "title": "Fall Armyworm Risk",
      "message": "Conditions favorable for fall armyworm. Inspect maize plants daily for egg masses on leaves.",
      "action_required": false,
      "expires_at": "2024-10-10T00:00:00Z"
    }
  ],
  "recommendations": [
    {
      "category": "irrigation",
      "message": "Soil moisture adequate. No irrigation needed this week.",
      "confidence": 0.92
    },
    {
      "category": "market",
      "message": "Maize prices trending up 8% this week. Good time to sell if storage is limited.",
      "confidence": 0.78
    }
  ],
  "farm_health_score": 82,
  "next_check_in": "2024-10-06T14:00:00Z"
}
```

### Carbon Dashboard API

**Endpoint:** `GET /api/v1/carbon/entity/{entity_id}/metrics`

**Query Parameters:**
- `start_date`: 2024-01-01
- `end_date`: 2024-12-31
- `granularity`: monthly/quarterly/yearly

**Response:**
```json
{
  "entity_id": "ent_xyz789",
  "entity_name": "GreenFinance Kenya Ltd",
  "reporting_period": {
    "start": "2024-01-01",
    "end": "2024-09-30"
  },
  "overview": {
    "total_farms": 1250,
    "total_hectares": 3400,
    "farmers_active_last_30_days": 890,
    "avg_farm_size_ha": 2.72
  },
  "carbon_metrics": {
    "total_co2_sequestered_tonnes": 4200,
    "co2_per_hectare_tonnes": 1.24,
    "methodology": "IPCC Tier 1 + satellite verification",
    "verification_status": "certified",
    "credit_value_estimate_usd": 84000
  },
  "environmental_impact": {
    "water_saved_m3": 125000,
    "soil_health_improvement_percent": 18,
    "forest_area_restored_ha": 45,
    "biodiversity_index": 0.72
  },
  "social_impact": {
    "farmers_above_poverty_line": 890,
    "avg_income_increase_percent": 22,
    "women_farmers_percent": 42,
    "youth_farmers_percent": 28
  },
  "agricultural_outcomes": {
    "avg_yield_increase_percent": 18,
    "crop_diversity_index": 2.4,
    "sustainable_practices_adoption_rate": 0.68,
    "input_efficiency_improvement_percent": 15
  },
  "spatial_data": {
    "ndvi_time_series": [
      {"date": "2024-01", "avg_ndvi": 0.35},
      {"date": "2024-02", "avg_ndvi": 0.42},
      {"date": "2024-03", "avg_ndvi": 0.58}
    ],
    "land_cover_change": {
      "cropland_increase_ha": 120,
      "degraded_land_rehabilitated_ha": 85
    }
  },
  "data_quality": {
    "satellite_imagery_coverage_percent": 95,
    "ground_truth_samples": 85,
    "confidence_score": 0.92,
    "last_updated": "2024-10-01T00:00:00Z"
  }
}
```

### Market Prices API

**Endpoint:** `GET /api/v1/market/prices`

**Query Parameters:**
- `commodity`: maize/beans/tomatoes/etc
- `location`: Nairobi/Mombasa/Kisumu/etc
- `days`: 7 (historical data)

**Response:**
```json
{
  "commodity": "maize",
  "unit": "kg",
  "currency": "KES",
  "locations": [
    {
      "name": "Nairobi",
      "current_price": 45,
      "price_change_7d_percent": 8,
      "price_change_30d_percent": 12,
      "trend": "increasing",
      "historical_data": [
        {"date": "2024-09-27", "price": 42},
        {"date": "2024-09-28", "price": 43},
        {"date": "2024-10-03", "price": 45}
      ]
    },
    {
      "name": "Mombasa",
      "current_price": 38,
      "price_change_7d_percent": 5,
      "trend": "stable"
    }
  ],
  "forecast_7d": [
    {"date": "2024-10-04", "price_estimate": 46, "confidence": 0.78},
    {"date": "2024-10-05", "price_estimate": 47, "confidence": 0.72}
  ],
  "recommendation": "Prices trending upward. Consider selling within next 7-10 days."
}
```

---

## 12. Deployment Strategy

### Development Environment

**Local Setup:**
```bash
# Clone repository
git clone https://github.com/evolvelabs/eo-farm-navigators.git
cd eo-farm-navigators

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Database setup
docker-compose up -d postgres redis
alembic upgrade head

# Run backend
uvicorn main:app --reload

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

**Environment Variables (.env):**
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/farmnav
REDIS_URL=redis://localhost:6379

# APIs
NASA_EARTHDATA_TOKEN=your_token_here
KENYA_MET_API_KEY=your_key_here
AFRICAS_TALKING_API_KEY=your_key_here
AFRICAS_TALKING_USERNAME=sandbox
TWILIO_ACCOUNT_SID=your_sid_here
TWILIO_AUTH_TOKEN=your_token_here

# Security
JWT_SECRET_KEY=your_secret_key_here
JWT_ALGORITHM=HS256
```

### Staging Environment (Railway)

**Setup:**
1. Connect GitHub repository to Railway
2. Configure environment variables in Railway dashboard
3. Deploy from `staging` branch
4. Automatic deployments on push

**Configuration:**
```yaml
# railway.toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### Production Environment (AWS)

**Architecture:**
```
┌─────────────────────────────────────────────┐
│         CloudFront CDN                      │
│         (Static Assets)                     │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Application Load Balancer           │
└──────┬──────────────────────┬───────────────┘
       │                      │
┌──────▼──────┐      ┌────────▼────────┐
│   EC2       │      │   EC2           │
│   Instance  │      │   Instance      │
│   (API)     │      │   (API)         │
└──────┬──────┘      └────────┬────────┘
       │                      │
       └──────────┬───────────┘
                  │
      ┌───────────▼───────────┐
      │   RDS PostgreSQL      │
      │   (Multi-AZ)          │
      └───────────────────────┘
```

**Infrastructure as Code (Terraform):**
```hcl
# main.tf
resource "aws_instance" "api_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"
  
  tags = {
    Name = "FarmNav-API"
    Environment = "production"
  }
}

resource "aws_db_instance" "postgres" {
  identifier        = "farmnav-db"
  engine            = "postgres"
  engine_version    = "14.7"
  instance_class    = "db.t3.medium"
  allocated_storage = 100
  
  multi_az               = true
  backup_retention_period = 7
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "farmnav-cache"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
}
```

**Deployment Pipeline (GitHub Actions):**
```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          pip install -r requirements-dev.txt
          pytest tests/
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t farmnav-api:${{ github.sha }} .
      
      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URL
          docker push farmnav-api:${{ github.sha }}
      
      - name: Deploy to EC2
        run: |
          aws ecs update-service \
            --cluster farmnav-cluster \
            --service farmnav-api \
            --force-new-deployment
```

### Database Migrations

**Alembic Migration Script:**
```python
# alembic/versions/001_initial_schema.py
from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geometry

def upgrade():
    op.create_table(
        'farmers',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('phone_number', sa.String(), unique=True, nullable=False),
        sa.Column('name', sa.String()),
        sa.Column('location', Geometry('POINT', srid=4326)),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), onupdate=sa.text('now()'))
    )
    
    op.create_table(
        'farms',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('farmer_id', sa.String(), sa.ForeignKey('farmers.id')),
        sa.Column('size_ha', sa.Float()),
        sa.Column('geometry', Geometry('POLYGON', srid=4326)),
        sa.Column('crops', sa.JSON()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'))
    )
    
    # Create spatial index
    op.execute(
        "CREATE INDEX idx_farms_geometry ON farms USING GIST (geometry)"
    )

def downgrade():
    op.drop_table('farms')
    op.drop_table('farmers')
```

### Monitoring & Alerts

**Prometheus Metrics:**
```python
from prometheus_client import Counter, Histogram, Gauge

# Define metrics
api_requests_total = Counter(
    'api_requests_total', 
    'Total API requests', 
    ['method', 'endpoint', 'status']
)

api_request_duration = Histogram(
    'api_request_duration_seconds',
    'API request duration',
    ['endpoint']
)

active_farmers = Gauge(
    'active_farmers_total',
    'Number of active farmers in last 24h'
)

# Instrument code
@app.get("/api/v1/weather/forecast")
async def get_weather_forecast():
    with api_request_duration.labels('/api/v1/weather/forecast').time():
        # ... logic ...
        api_requests_total.labels('GET', '/weather/forecast', 200).inc()
        return response
```

**Grafana Dashboard Queries:**
```promql
# API Request Rate
rate(api_requests_total[5m])

# 95th Percentile Response Time
histogram_quantile(0.95, api_request_duration_seconds_bucket)

# Error Rate
rate(api_requests_total{status=~"5.."}[5m]) / rate(api_requests_total[5m])

# Active Users (Last 24h)
active_farmers_total
```

**Alert Rules (Prometheus):**
```yaml
groups:
  - name: farmnav_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(api_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High API error rate detected"
          description: "Error rate is {{ $value }} req/s"
      
      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, api_request_duration_seconds_bucket) > 2
        for: 10m
        annotations:
          summary: "API response time degraded"
          description: "95th percentile latency is {{ $value }}s"
      
      - alert: DatabaseConnectionPoolExhausted
        expr: pg_stat_database_numbackends / pg_settings_max_connections > 0.8
        for: 5m
        annotations:
          summary: "Database connection pool nearly exhausted"
```

### Backup & Disaster Recovery

**Automated Backups:**
```bash
# Daily PostgreSQL backup (cron job)
#!/bin/bash
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)

pg_dump farmnav_production | gzip > $BACKUP_DIR/farmnav_$DATE.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/farmnav_$DATE.sql.gz s3://farmnav-backups/

# Retain last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

**Disaster Recovery Plan:**
1. **RTO (Recovery Time Objective):** 2 hours
2. **RPO (Recovery Point Objective):** 24 hours
3. **Backup Strategy:**
   - Continuous replication to standby RDS instance
   - Daily full backups to S3
   - Transaction logs backed up every 5 minutes
4. **Recovery Procedure:**
   - Promote standby RDS to primary
   - Update DNS records
   - Restore latest backup if needed
   - Verify data integrity
   - Resume operations

---

## Appendix A: Sample Database Schema

```sql
-- Farmers table
CREATE TABLE farmers (
    id VARCHAR(50) PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100),
    location GEOMETRY(Point, 4326),
    county VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    subscription_tier VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Farms table
CREATE TABLE farms (
    id VARCHAR(50) PRIMARY KEY,
    farmer_id VARCHAR(50) REFERENCES farmers(id),
    name VARCHAR(100),
    size_ha FLOAT,
    geometry GEOMETRY(Polygon, 4326),
    soil_type VARCHAR(50),
    irrigation_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Crops table
CREATE TABLE crops (
    id VARCHAR(50) PRIMARY KEY,
    farm_id VARCHAR(50) REFERENCES farms(id),
    crop_type VARCHAR(50),
    variety VARCHAR(100),
    planting_date DATE,
    expected_harvest_date DATE,
    actual_harvest_date DATE,
    area_ha FLOAT,
    status VARCHAR(20), -- planted, growing, harvested
    created_at TIMESTAMP DEFAULT NOW()
);

-- Weather data cache
CREATE TABLE weather_cache (
    location_id VARCHAR(100) PRIMARY KEY,
    latitude FLOAT,
    longitude FLOAT,
    forecast_data JSONB,
    fetched_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

-- Satellite data
CREATE TABLE satellite_data (
    id VARCHAR(50) PRIMARY KEY,
    farm_id VARCHAR(50) REFERENCES farms(id),
    data_type VARCHAR(50), -- ndvi, rainfall, soil_moisture
    date DATE,
    value FLOAT,
    source VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Simulations
CREATE TABLE simulations (
    id VARCHAR(50) PRIMARY KEY,
    farmer_id VARCHAR(50) REFERENCES farmers(id),
    input_parameters JSONB,
    results JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Alerts and advisories
CREATE TABLE advisories (
    id VARCHAR(50) PRIMARY KEY,
    farmer_id VARCHAR(50) REFERENCES farmers(id),
    type VARCHAR(50), -- weather, pest, market, irrigation
    priority VARCHAR(20), -- high, medium, low
    title VARCHAR(200),
    message TEXT,
    action_required BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

--