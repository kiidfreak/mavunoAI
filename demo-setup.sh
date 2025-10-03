#!/bin/bash

# EO Farm Navigators - Demo Setup Script
# This script sets up the complete MVP for hackathon demo

echo "🌍 EO Farm Navigators - Demo Setup"
echo "=================================="

# Check if required tools are installed
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    else
        echo "✅ $1 is installed"
    fi
}

echo "Checking prerequisites..."
check_command "python3"
check_command "node"
check_command "npm"

# Create virtual environments and install dependencies
echo ""
echo "Setting up backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "✅ Backend dependencies installed"

echo ""
echo "Setting up frontend..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

echo ""
echo "Setting up WhatsApp bot..."
cd ../whatsapp-bot
npm install
echo "✅ WhatsApp bot dependencies installed"

echo ""
echo "Setting up USSD app..."
cd ../ussd-app
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "✅ USSD app dependencies installed"

# Create environment files
echo ""
echo "Creating environment files..."
cd ..

# Backend .env
cat > backend/.env << EOF
# Database (using SQLite for demo)
DATABASE_URL=sqlite:///./farmnav.db
REDIS_URL=redis://localhost:6379

# APIs (demo keys)
NASA_EARTHDATA_TOKEN=demo_token
KENYA_MET_API_KEY=demo_key
AFRICAS_TALKING_API_KEY=demo_key
AFRICAS_TALKING_USERNAME=sandbox
TWILIO_ACCOUNT_SID=demo_sid
TWILIO_AUTH_TOKEN=demo_token

# Security
JWT_SECRET_KEY=demo_secret_key_change_in_production
JWT_ALGORITHM=HS256

# Environment
ENVIRONMENT=development
DEBUG=True
EOF

# WhatsApp bot .env
cat > whatsapp-bot/.env << EOF
TWILIO_ACCOUNT_SID=demo_sid
TWILIO_AUTH_TOKEN=demo_token
API_BASE_URL=http://localhost:8000
PORT=3001
NODE_ENV=development
EOF

# USSD app .env
cat > ussd-app/.env << EOF
API_BASE_URL=http://localhost:8000
PORT=5000
FLASK_ENV=development
EOF

echo "✅ Environment files created"

# Create startup script
cat > start-demo.sh << 'EOF'
#!/bin/bash

echo "🌍 Starting EO Farm Navigators Demo..."
echo "====================================="

# Function to start service in background
start_service() {
    echo "Starting $1..."
    $2 &
    echo "✅ $1 started (PID: $!)"
}

# Start all services
cd backend && source venv/bin/activate && python main.py &
BACKEND_PID=$!

cd ../frontend && npm run dev &
FRONTEND_PID=$!

cd ../whatsapp-bot && npm start &
WHATSAPP_PID=$!

cd ../ussd-app && source venv/bin/activate && python app.py &
USSD_PID=$!

echo ""
echo "🚀 All services started!"
echo ""
echo "📱 Access Points:"
echo "  • Web Dashboard: http://localhost:3000"
echo "  • Backend API: http://localhost:8000"
echo "  • API Docs: http://localhost:8000/docs"
echo "  • WhatsApp Bot: http://localhost:3001"
echo "  • USSD App: http://localhost:5000"
echo ""
echo "📋 Demo Scenarios:"
echo "  1. Web: Open http://localhost:3000"
echo "  2. WhatsApp: Send 'weather' to +254700000000"
echo "  3. USSD: Dial *123# (simulated)"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap 'echo ""; echo "🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID $WHATSAPP_PID $USSD_PID; exit' INT
wait
EOF

chmod +x start-demo.sh

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the demo, run:"
echo "  ./start-demo.sh"
echo ""
echo "Or start services individually:"
echo "  Backend: cd backend && source venv/bin/activate && python main.py"
echo "  Frontend: cd frontend && npm run dev"
echo "  WhatsApp: cd whatsapp-bot && npm start"
echo "  USSD: cd ussd-app && source venv/bin/activate && python app.py"
echo ""
echo "Happy coding! 🚀"
