# 🌍 MavunoAI - Modular Farm Intelligence Platform
## NASA Space Apps Challenge 2025

## Quick Start (5 minutes to demo)

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker (optional)

### 1. Backend Setup (You)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup (mavunoAI Next.js)
```bash
cd frontend
npm install
npm run dev
```

### 3. WhatsApp Bot Setup (Roy)
```bash
cd whatsapp-bot
npm install
npm start
```

### 4. USSD Setup (Roy)
```bash
cd ussd-app
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Running Services
1. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
2. **Start the backend:**
   ```bash
   cd backend
   python main.py
   ```
3. **Start the USSD simulator:**
   ```bash
   cd ussd-app
   python credit_ussd.py
   ```
4. **Expose the USSD service via Ngrok:**
   ```bash
   ngrok http 5000
   ```

## Demo Scenarios

### Scenario 1: Farmer John (Feature Phone)
1. Dial `*123#` → Weather → Machakos
2. Get: "Today: Sunny 26°C, Tomorrow: Rain 22°C"
3. SMS follow-up with 7-day forecast

### Scenario 2: Progressive Farmer Grace (WhatsApp)
1. Send "weather" to +254700000000
2. Get interactive weather card
3. Send "advice maize" → get planting recommendations

### Scenario 3: Carbon Corp Manager (Web)
1. Open http://localhost:3000/dashboard
2. View entity sustainability metrics
3. See satellite imagery overlays

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Dashboard │    │  WhatsApp Bot   │    │   USSD App      │
│   (React)       │    │  (Twilio)       │    │  (Africa's      │
│                 │    │                 │    │   Talking)      │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    FastAPI Backend      │
                    │  - Weather API          │
                    │  - Simulation API       │
                    │  - Advisory Engine      │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    Data Sources         │
                    │  - NASA CHIRPS          │
                    │  - Kenya Met            │
                    │  - Digital Earth Africa │
                    └─────────────────────────┘
```

## Team Division

### You (Data + Backend + Web)
- ✅ FastAPI backend with data ingestion
- ✅ NASA/DE Africa API integration
- ✅ React web dashboard with maps
- ✅ Carbon Corp demo dashboard
- ✅ Yield prediction algorithms

### Roy (Chatbot & Access Layer)
- ✅ WhatsApp bot with Twilio
- ✅ USSD app with Africa's Talking
- ✅ Message templates and flows
- ✅ User interaction handling

## Demo Timeline (30 minutes)

1. **Setup** (5 min): Start all services
2. **USSD Demo** (5 min): Show feature phone access
3. **WhatsApp Demo** (5 min): Show smartphone interaction
4. **Web Demo** (10 min): Show full dashboard capabilities
5. **Q&A** (5 min): Technical questions

## Success Metrics
- [ ] All 3 channels working live
- [ ] Real data from NASA/DE Africa
- [ ] 2+ demo scenarios smooth
- [ ] Judges impressed! 🏆
