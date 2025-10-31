# 🌟 MavunoAI Credit - AI-Driven Credit Scoring for Inclusive Agri-Finance

## 🎯 Hackathon Challenge Solution

**Challenge**: Build an AI model that scores smallholder farmers' creditworthiness using non-traditional data.

**Our Innovation**: Use NASA satellite data + phone behavior to score farmers **without IoT sensors or extensive paperwork**.

---

## 🚀 The Big Idea

### "Satellites Are Your IoT Network"

Instead of expensive ground sensors, we use:
- 🛰️ **NASA SMAP** - Real-time soil moisture (updated every 2-3 hours)
- 🌧️ **NASA POWER** - Rainfall, evapotranspiration, temperature
- 🌿 **NDVI** - Vegetation health from Sentinel/MODIS satellites
- 💳 **M-Pesa behavior** - Transaction patterns (with consent)
- 📱 **USSD engagement** - Advisory usage frequency

### Inputs (Minimal Friction)
1. Phone number (MSISDN)
2. Farm location (lat/lon)
3. Crop type (menu selection)

### Outputs
- **Credit Score** (0-1 probability of repayment)
- **Loan Recommendation** (amount, interest, term)
- **Yield Estimate** (tonnes expected)
- **AI Explanations** (top 3 factors via SHAP-like logic)
- **Fraud Detection** (location verification)

---

## 🧠 How It Works

### 1. Data Collection (No Farmer Burden)
```
Farmer dials *MAVUNO#*
├─ Phone number captured automatically
├─ Selects crop: Onion / Maize / Bees
└─ Shares location (GPS or sub-county menu)
```

### 2. NASA Satellite Features (Real-Time)
```python
# From farmer's lat/lon, we fetch:
- soil_moisture (SMAP): 0.28 m³/m³
- rainfall_30d: 145 mm
- ndvi_mean_90d: 0.62 (healthy vegetation)
- ndvi_trend: +0.02 (improving)
- drought_flag: 0 (no drought)
```

### 3. Behavioral Features (Digital Finance)
```python
# From phone number (with consent):
- mpesa_txn_count_90d: 35 transactions
- ussd_engagement: 12 advisory checks
- cooperative_member: Yes
- account_age_days: 180
```

### 4. AI Credit Model
```python
# LightGBM model combines:
score = f(
    satellite_signals,  # 40% weight
    behavior_signals,   # 40% weight
    yield_potential,    # 10% weight
    fraud_check         # 10% penalty
)
```

### 5. Loan Decision Engine
```python
if score >= 0.80:
    → 50,000 KSh @ 8% for 6 months
elif score >= 0.60:
    → 30,000 KSh @ 10% for 4 months
elif score >= 0.40:
    → 10,000 KSh microloan (requires M-Pesa deposit)
else:
    → Training + savings plan
```

---

## 🛡️ Fraud Prevention (Location Verification)

### The Problem
USSD users could fake their location to get loans.

### Our Solution (Multi-Layer)
1. **NDVI Sanity Check** - Is the location actually farmland?
2. **Crop-Climate Match** - Does onion farming make sense with 30mm rainfall?
3. **Cell Tower Verification** - MNO partnership for coarse location (optional)
4. **M-Pesa Cross-Check** - Small deposit links identity
5. **Progressive Lending** - Start small, scale up after repayment
6. **Cooperative Guarantee** - SMS verification from coop rep

**Result**: Fraud score 0-1 → high scores get microloans only

---

## 📊 Dashboard (3-Panel Minimalist Design)

### Left Panel: Farm Data + AI Recommendations
```
🌱 Your Field Snapshot
━━━━━━━━━━━━━━━━━━━━
🌧️ Rainfall (30d): 212 mm
💧 Soil Moisture: 0.29 m³/m³
🌿 NDVI Trend: ↑ Healthy

🤖 Smart Tips from Nuru AI
━━━━━━━━━━━━━━━━━━━━
• Soil moisture low — irrigate in 3 days
• Apply nitrogen after next rain
• Predicted yield: 1.8 tonnes/acre
```

### Center Panel: Credit Score + Loan Offers
```
💳 Credit Score: 0.82 🟢 Low Risk
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Top Factors:
• NDVI Trend (+0.12)
• M-Pesa Activity (+0.08)
• Soil Moisture (+0.06)

📋 Loan Offers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌱 Farm Input Loan
   50,000 KSh @ 8% for 6 months
   [Apply Now]
```

### Right Panel: Rewards System
```
🎖️ Farmer Level: Silver ⭐
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Progress to Gold:
• Repay 2 loans on time → -1% interest

Activity Points: 85/100
✅ Repayment completed +50 pts
🌧️ Rain risk detected +10 pts
```

---

## 🌍 Why This Wins

### 1. **No IoT Needed**
- NASA satellites = continent-wide sensor network
- Zero hardware cost
- Instant scalability

### 2. **Inclusive & Accessible**
- Works via USSD (feature phones)
- Minimal data required from farmer
- Reaches offline/remote farmers

### 3. **Explainable AI**
- SHAP-like explanations show why score was given
- Transparent & fair
- Builds trust

### 4. **Climate-Smart**
- Real-time weather adaptation
- Simulates "what-if" scenarios
- Weather-indexed insurance recommendations

### 5. **Proven Tech Stack**
- NASA POWER API (free, public)
- FastAPI backend (production-ready)
- LightGBM (industry standard)
- USSD integration (Africa's Talking)

---

## 🚀 Quick Start

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements-simple.txt
uvicorn main:app --reload
```

### Test Credit Scoring API
```bash
curl "http://localhost:8000/api/v1/credit/score" \
  -X POST \
  -d "phone_number=+254712345678" \
  -d "latitude=-0.34" \
  -d "longitude=36.12" \
  -d "crop_type=onion" \
  -d "farm_size_acres=2.0"
```

### Response
```json
{
  "credit_score": 0.82,
  "risk_level": "Low Risk",
  "loan_recommendation": {
    "approved": true,
    "amount_ksh": 50000,
    "interest_rate": 8.0,
    "term_months": 6
  },
  "top_factors": [
    {"name": "NDVI Trend", "impact": 0.12},
    {"name": "M-Pesa Activity", "impact": 0.08}
  ],
  "yield_estimate_tonnes": 1.8
}
```

---

## 📈 Demo Scenarios

### Scenario 1: Mary (Onion Farmer, Nakuru)
- **Phone**: +254712345678
- **Location**: Nakuru (-0.34, 36.12)
- **Crop**: Onions
- **Result**: Score 0.82 → 50,000 KSh loan approved

### Scenario 2: John (Maize Farmer, Drought Zone)
- **Phone**: +254723456789
- **Location**: Machakos (-1.52, 37.26)
- **Crop**: Maize
- **Rainfall**: 45mm (drought)
- **Result**: Score 0.48 → 10,000 KSh microloan + insurance

### Scenario 3: Grace (Beekeeper, High Engagement)
- **Phone**: +254734567890
- **Location**: Kiambu (-1.17, 36.83)
- **Crop**: Bees
- **USSD engagement**: 25 sessions
- **Result**: Score 0.91 → 50,000 KSh @ 7% (loyalty discount)

---

## 🎯 Judging Criteria Alignment

| Criterion | Our Solution |
|-----------|-------------|
| **AI Model Quality** | LightGBM with SHAP explanations, ROC-AUC metrics |
| **Simulation Engine** | Weather scenario testing ("what if rainfall ↓20%?") |
| **Fairness & Inclusion** | USSD access, bias checks, progressive lending |
| **Explainability** | Top 3 factors shown, transparent scoring |
| **Scalability** | API-ready, no hardware, NASA data is free |
| **Innovation** | "Satellites as IoT" - unique approach |

---

## 🌟 Elevator Pitch

> **"MavunoAI Credit uses NASA satellites as a continent-wide IoT network to score smallholder farmers' creditworthiness. We combine real-time soil moisture, rainfall, and vegetation data with phone behavior to predict repayment probability — all without sensors or paperwork. Farmers dial a USSD code, share their location, and get instant loan decisions. It's climate-smart, explainable, and scales to millions."**

---

## 📚 Tech Stack

- **Backend**: FastAPI (Python)
- **AI/ML**: LightGBM, NumPy, scikit-learn
- **NASA APIs**: POWER, SMAP (via Earthdata)
- **Database**: SQLite (dev), PostgreSQL (prod)
- **USSD**: Africa's Talking integration
- **Frontend**: Next.js + Tailwind (dashboard)

---

## 🔮 Next Steps (Post-Hackathon)

1. **Train on Real Data** - Partner with credit bureau + MNO
2. **SMAP Integration** - Direct NASA Earthdata API
3. **Mobile App** - Complement USSD with smartphone app
4. **Insurance Integration** - Weather-indexed micro-insurance
5. **Pilot Program** - 1,000 farmers in Nakuru/Kiambu

---

## 🏆 Team

- **You**: Backend + Data + AI Model
- **Roy**: USSD + WhatsApp Bot + Integration

---

## 📞 Contact

**MavunoAI Credit** - Farming Meets the Future 🌾🛰️

*Built for NASA Space Apps Challenge 2025*
