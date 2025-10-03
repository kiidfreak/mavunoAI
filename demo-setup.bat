@echo off
REM EO Farm Navigators - Demo Setup Script for Windows
REM This script sets up the complete MVP for hackathon demo

echo 🌍 EO Farm Navigators - Demo Setup
echo ==================================

REM Check if required tools are installed
echo Checking prerequisites...

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
) else (
    echo ✅ Python is installed
)

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
) else (
    echo ✅ npm is installed
)

echo.
echo Setting up backend...
cd backend
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
echo ✅ Backend dependencies installed

echo.
echo Setting up frontend...
cd ..\frontend
npm install
echo ✅ Frontend dependencies installed

echo.
echo Setting up WhatsApp bot...
cd ..\whatsapp-bot
npm install
echo ✅ WhatsApp bot dependencies installed

echo.
echo Setting up USSD app...
cd ..\ussd-app
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
echo ✅ USSD app dependencies installed

REM Create environment files
echo.
echo Creating environment files...
cd ..

REM Backend .env
(
echo # Database ^(using SQLite for demo^)
echo DATABASE_URL=sqlite:///./farmnav.db
echo REDIS_URL=redis://localhost:6379
echo.
echo # APIs ^(demo keys^)
echo NASA_EARTHDATA_TOKEN=demo_token
echo KENYA_MET_API_KEY=demo_key
echo AFRICAS_TALKING_API_KEY=demo_key
echo AFRICAS_TALKING_USERNAME=sandbox
echo TWILIO_ACCOUNT_SID=demo_sid
echo TWILIO_AUTH_TOKEN=demo_token
echo.
echo # Security
echo JWT_SECRET_KEY=demo_secret_key_change_in_production
echo JWT_ALGORITHM=HS256
echo.
echo # Environment
echo ENVIRONMENT=development
echo DEBUG=True
) > backend\.env

REM WhatsApp bot .env
(
echo TWILIO_ACCOUNT_SID=demo_sid
echo TWILIO_AUTH_TOKEN=demo_token
echo API_BASE_URL=http://localhost:8000
echo PORT=3001
echo NODE_ENV=development
) > whatsapp-bot\.env

REM USSD app .env
(
echo API_BASE_URL=http://localhost:8000
echo PORT=5000
echo FLASK_ENV=development
) > ussd-app\.env

echo ✅ Environment files created

REM Create startup script
(
echo @echo off
echo echo 🌍 Starting EO Farm Navigators Demo...
echo echo =====================================
echo echo.
echo echo Starting Backend...
echo start "Backend" cmd /k "cd backend && call venv\Scripts\activate.bat && python main.py"
echo timeout /t 3 /nobreak ^>nul
echo.
echo echo Starting Frontend...
echo start "Frontend" cmd /k "cd frontend && npm run dev"
echo timeout /t 3 /nobreak ^>nul
echo.
echo echo Starting WhatsApp Bot...
echo start "WhatsApp Bot" cmd /k "cd whatsapp-bot && npm start"
echo timeout /t 3 /nobreak ^>nul
echo.
echo echo Starting USSD App...
echo start "USSD App" cmd /k "cd ussd-app && call venv\Scripts\activate.bat && python app.py"
echo timeout /t 5 /nobreak ^>nul
echo.
echo echo 🚀 All services started!
echo echo.
echo echo 📱 Access Points:
echo echo   • Web Dashboard: http://localhost:3000
echo echo   • Backend API: http://localhost:8000
echo echo   • API Docs: http://localhost:8000/docs
echo echo   • WhatsApp Bot: http://localhost:3001
echo echo   • USSD App: http://localhost:5000
echo echo.
echo echo 📋 Demo Scenarios:
echo echo   1. Web: Open http://localhost:3000
echo echo   2. WhatsApp: Send 'weather' to +254700000000
echo echo   3. USSD: Dial *123# ^(simulated^)
echo echo.
echo echo Press any key to exit...
echo pause ^>nul
) > start-demo.bat

echo.
echo 🎉 Setup complete!
echo.
echo To start the demo, run:
echo   start-demo.bat
echo.
echo Or start services individually:
echo   Backend: cd backend && venv\Scripts\activate.bat && python main.py
echo   Frontend: cd frontend && npm run dev
echo   WhatsApp: cd whatsapp-bot && npm start
echo   USSD: cd ussd-app && venv\Scripts\activate.bat && python app.py
echo.
echo Happy coding! 🚀
pause
