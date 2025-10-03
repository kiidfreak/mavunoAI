/**
 * EO Farm Navigators - WhatsApp Bot
 * Handles farmer interactions via WhatsApp
 */

import express from 'express';
import twilio from 'twilio';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'demo_account_sid';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'demo_auth_token';
const client = twilio(accountSid, authToken);

// Backend API URL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User sessions storage (in production, use Redis)
const userSessions = new Map();

// Demo farmer data
const demoFarmers = {
  '+254712345678': {
    name: 'John Mwangi',
    location: 'Machakos',
    latitude: -1.2921,
    longitude: 36.8219,
    crops: ['maize', 'beans'],
    farm_size: 2.0
  },
  '+254723456789': {
    name: 'Grace Njeri', 
    location: 'Kiambu',
    latitude: -1.2000,
    longitude: 36.9000,
    crops: ['tomatoes', 'coffee'],
    farm_size: 10.0
  }
};

// Helper functions
function getFarmerData(phoneNumber) {
  return demoFarmers[phoneNumber] || {
    name: 'Farmer',
    location: 'Unknown',
    latitude: -1.2921,
    longitude: 36.8219,
    crops: ['maize'],
    farm_size: 1.0
  };
}

function getUserSession(phoneNumber) {
  if (!userSessions.has(phoneNumber)) {
    userSessions.set(phoneNumber, {
      state: 'main_menu',
      data: {},
      lastActivity: new Date()
    });
  }
  return userSessions.get(phoneNumber);
}

function updateUserSession(phoneNumber, updates) {
  const session = getUserSession(phoneNumber);
  Object.assign(session, updates);
  session.lastActivity = new Date();
  userSessions.set(phoneNumber, session);
}

async function callBackendAPI(endpoint, data = null) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = data 
      ? await axios.post(url, data)
      : await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Backend API error:', error.message);
    return null;
  }
}

function formatWeatherMessage(weatherData) {
  if (!weatherData) {
    return "❌ Unable to fetch weather data. Please try again later.";
  }

  const { location, current, forecast } = weatherData;
  let message = `🌤️ *Weather for ${location.name}*\n\n`;
  
  message += `*Current:* ${current.conditions}, ${current.temperature_c}°C\n`;
  message += `Humidity: ${current.humidity_percent}%\n`;
  message += `Wind: ${current.wind_speed_kmh} km/h\n\n`;
  
  message += `*7-Day Forecast:*\n`;
  forecast.slice(0, 3).forEach(day => {
    const emoji = day.rainfall_mm > 10 ? '🌧️' : day.rainfall_mm > 0 ? '🌦️' : '☀️';
    message += `${emoji} ${day.date}: ${day.conditions}, ${day.temp_min_c}-${day.temp_max_c}°C`;
    if (day.rainfall_mm > 0) {
      message += ` (${day.rainfall_mm}mm rain)`;
    }
    message += '\n';
  });
  
  message += `\n💡 *Recommendation:* `;
  const avgRainfall = forecast.slice(0, 7).reduce((sum, day) => sum + day.rainfall_mm, 0) / 7;
  if (avgRainfall > 15) {
    message += "Good planting conditions expected!";
  } else if (avgRainfall > 5) {
    message += "Moderate rainfall - monitor soil moisture";
  } else {
    message += "Low rainfall - consider irrigation";
  }
  
  return message;
}

function formatAdvisoryMessage(advisoryData) {
  if (!advisoryData) {
    return "❌ Unable to fetch advisory data. Please try again later.";
  }

  let message = `🌾 *Farming Advisory*\n\n`;
  
  if (advisoryData.alerts && advisoryData.alerts.length > 0) {
    message += `*⚠️ Alerts:*\n`;
    advisoryData.alerts.forEach(alert => {
      const priority = alert.priority === 'HIGH' ? '🔴' : alert.priority === 'MEDIUM' ? '🟡' : '🟢';
      message += `${priority} ${alert.title}\n${alert.message}\n\n`;
    });
  }
  
  if (advisoryData.recommendations && advisoryData.recommendations.length > 0) {
    message += `*💡 Recommendations:*\n`;
    advisoryData.recommendations.forEach(rec => {
      message += `• ${rec.message}\n`;
    });
  }
  
  message += `\n*Farm Health Score:* ${advisoryData.farm_health_score}/100`;
  
  return message;
}

function formatMarketPricesMessage(marketData) {
  if (!marketData) {
    return "❌ Unable to fetch market data. Please try again later.";
  }

  let message = `💰 *Market Prices - ${marketData.commodity.toUpperCase()}*\n\n`;
  
  message += `*${marketData.location}:* ${marketData.current_price} ${marketData.currency}/${marketData.unit}\n`;
  message += `*Trend:* ${marketData.trend === 'increasing' ? '📈' : marketData.trend === 'decreasing' ? '📉' : '➡️'} ${marketData.trend}\n`;
  message += `*7-day change:* ${marketData.price_change_7d_percent}%\n\n`;
  
  if (marketData.recommendation) {
    message += `*💡 Recommendation:*\n${marketData.recommendation}`;
  }
  
  return message;
}

// Main message handler
async function handleIncomingMessage(req, res) {
  const { Body, From, To } = req.body;
  const userMessage = Body?.toLowerCase().trim() || '';
  const phoneNumber = From;

  console.log(`Received from ${phoneNumber}: ${userMessage}`);

  const session = getUserSession(phoneNumber);
  const farmer = getFarmerData(phoneNumber);

  let response = '';

  try {
    // Handle different message types
    if (userMessage.includes('weather') || userMessage.includes('forecast')) {
      const weatherData = await callBackendAPI('/api/v1/weather/forecast', {
        latitude: farmer.latitude,
        longitude: farmer.longitude,
        days: 7
      });
      response = formatWeatherMessage(weatherData);
      updateUserSession(phoneNumber, { state: 'main_menu' });

    } else if (userMessage.includes('advice') || userMessage.includes('advisory')) {
      const advisoryData = await callBackendAPI('/api/v1/advisory', {
        farmer_id: `farmer_${phoneNumber.slice(-6)}`,
        latitude: farmer.latitude,
        longitude: farmer.longitude,
        crop: farmer.crops[0],
        farm_size_ha: farmer.farm_size
      });
      response = formatAdvisoryMessage(advisoryData);
      updateUserSession(phoneNumber, { state: 'main_menu' });

    } else if (userMessage.includes('price') || userMessage.includes('market')) {
      const commodity = farmer.crops[0] || 'maize';
      const marketData = await callBackendAPI(`/api/v1/market/prices?commodity=${commodity}&location=${farmer.location}`);
      response = formatMarketPricesMessage(marketData);
      updateUserSession(phoneNumber, { state: 'main_menu' });

    } else if (userMessage.includes('simulate') || userMessage.includes('yield')) {
      response = `🌾 *Yield Simulation*\n\n`;
      response += `To simulate crop yield, I need some information:\n\n`;
      response += `1️⃣ What crop? (maize, beans, tomatoes, coffee)\n`;
      response += `2️⃣ Planting date?\n`;
      response += `3️⃣ Farm size in hectares?\n\n`;
      response += `Reply with: "simulate maize 2024-03-15 2.0"`;
      updateUserSession(phoneNumber, { state: 'simulation_input' });

    } else if (userMessage.includes('help') || userMessage === 'hi' || userMessage === 'hello') {
      response = `🌍 *Welcome to EO Farm Navigators!*\n\n`;
      response += `I'm your agricultural assistant powered by NASA satellite data.\n\n`;
      response += `*Available commands:*\n`;
      response += `🌤️ "weather" - Get weather forecast\n`;
      response += `🌾 "advice" - Get farming recommendations\n`;
      response += `💰 "prices" - Check market prices\n`;
      response += `📊 "simulate" - Run yield simulation\n`;
      response += `❓ "help" - Show this menu\n\n`;
      response += `Just type any command to get started!`;
      updateUserSession(phoneNumber, { state: 'main_menu' });

    } else if (session.state === 'simulation_input') {
      // Handle simulation input
      const parts = userMessage.split(' ');
      if (parts.length >= 4) {
        const crop = parts[1];
        const plantingDate = parts[2];
        const farmSize = parseFloat(parts[3]);
        
        const simulationData = await callBackendAPI('/api/v1/simulate', {
          latitude: farmer.latitude,
          longitude: farmer.longitude,
          crop: crop,
          planting_date: plantingDate,
          farm_size_ha: farmSize,
          inputs: {
            fertilizer_dap_kg_ha: 50,
            fertilizer_urea_kg_ha: 25,
            irrigation_mm_week: 20,
            pesticide_applications: 2
          },
          scenarios: ['current', 'optimal']
        });
        
        if (simulationData) {
          const current = simulationData.results.current;
          response = `📊 *Yield Simulation Results*\n\n`;
          response += `*Crop:* ${crop.toUpperCase()}\n`;
          response += `*Predicted Yield:* ${current.predicted_yield_kg_ha} kg/ha\n`;
          response += `*Total Yield:* ${current.total_yield_kg} kg\n`;
          response += `*Harvest Date:* ${current.harvest_date_estimate}\n`;
          response += `*Estimated Revenue:* $${current.revenue_estimate_usd}\n`;
          response += `*Net Profit:* $${current.net_profit_usd}\n`;
          response += `*ROI:* ${current.roi_percent}%\n\n`;
          response += `*Recommendations:*\n`;
          simulationData.recommendations.forEach(rec => {
            response += `• ${rec.action}\n`;
          });
        } else {
          response = `❌ Simulation failed. Please check your inputs and try again.`;
        }
      } else {
        response = `❌ Invalid simulation format. Please use: "simulate crop date size"\nExample: "simulate maize 2024-03-15 2.0"`;
      }
      updateUserSession(phoneNumber, { state: 'main_menu' });

    } else {
      // Default response
      response = `🤔 I didn't understand that. Try one of these commands:\n\n`;
      response += `🌤️ "weather" - Weather forecast\n`;
      response += `🌾 "advice" - Farming advice\n`;
      response += `💰 "prices" - Market prices\n`;
      response += `📊 "simulate" - Yield simulation\n`;
      response += `❓ "help" - Show all commands`;
      updateUserSession(phoneNumber, { state: 'main_menu' });
    }

  } catch (error) {
    console.error('Error handling message:', error);
    response = `❌ Sorry, I encountered an error. Please try again later.`;
  }

  // Send response via Twilio
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(response);
  
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
}

// Routes
app.post('/webhook', handleIncomingMessage);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    activeSessions: userSessions.size
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'EO Farm Navigators WhatsApp Bot',
    status: 'running',
    version: '1.0.0'
  });
});

// Start server
app.listen(port, () => {
  console.log(`🌍 EO Farm Navigators WhatsApp Bot running on port ${port}`);
  console.log(`📱 Webhook URL: http://localhost:${port}/webhook`);
  console.log(`🔗 Backend API: ${API_BASE_URL}`);
});

export default app;
