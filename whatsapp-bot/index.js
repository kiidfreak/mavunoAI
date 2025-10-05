/**
 * MavunoAI - Enhanced WhatsApp Bot
 * Handles farmer interactions with USSD features, rewards, and multi-language support
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

// Enhanced farmer data with MavunoAI features
const demoFarmers = {
  '+254115568694': {
    name: 'Test Farmer',
    location: 'Nairobi County',
    latitude: -1.2921,
    longitude: 36.8219,
    crops: ['onions'],
    farm_size: 2.5,
    language: 'en',
    mavunoPoints: 2450,
    level: 'Sustainable Pioneer',
    sustainabilityScore: 87
  },
  '+254111548797': {
    name: 'Test2',
    location: 'Loresho KARLO',
    latitude: -1.2000,
    longitude: 36.9000,
    crops: ['honey'],
    farm_size: 5.0,
    language: 'kik',
    mavunoPoints: 1890,
    level: 'Eco Beekeeper',
    sustainabilityScore: 91
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
      lastActivity: new Date(),
      points: 0,
      rewards: [],
      language: 'en'
    });
  }
  return userSessions.get(phoneNumber);
}

// Kikuyu translations
function getKikuyuText(key) {
  const translations = {
    'welcome': 'Karibu MavunoAI',
    'main_menu': 'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ',
    'weather': 'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ',
    'soil_health': 'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ',
    'market_prices': 'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ',
    'rewards': 'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ',
    'language': 'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ',
    'mavuno_points': 'Mavuno Points',
    'sustainability_score': 'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ'
  };
  return translations[key] || key;
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

// Enhanced USSD-style menu handler
function showMainMenu(farmer, session) {
  const isKikuyu = session.language === 'kik' || farmer.language === 'kik';
  
  if (isKikuyu) {
    return `🌱 *MavunoAI - Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ*

*Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ:*
1️⃣ *Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ* - Weather forecast
2️⃣ *Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ* - Soil health check  
3️⃣ *Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ* - Market prices
4️⃣ *Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ* - Rewards & Points
5️⃣ *Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ* - Language: ${isKikuyu ? 'Kikuyu' : 'English'}

*Mavuno Points:* ${farmer.mavunoPoints}
*Level:* ${farmer.level}

*Commands:*
• Type number (1-5) to select
• Type "redeem [reward]" to redeem
• Type "points" to check balance
• Type "menu" for this menu

*MavunoAI Team* 🌱`;
  }
  
  return `🌱 *MavunoAI - Sustainable Farming Assistant*

*Main Menu:*
1️⃣ *Weather Forecast* - Get weather updates
2️⃣ *Soil Health* - Check soil conditions  
3️⃣ *Market Prices* - View crop prices
4️⃣ *Rewards & Points* - Earn and redeem rewards
5️⃣ *Language* - Switch to ${isKikuyu ? 'English' : 'Kikuyu'}

*Mavuno Points:* ${farmer.mavunoPoints}
*Level:* ${farmer.level}

*Commands:*
• Type number (1-5) to select
• Type "redeem [reward]" to redeem
• Type "points" to check balance
• Type "menu" for this menu

*MavunoAI Team* 🌱`;
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
    // Handle USSD-style menu navigation
    if (userMessage === '1' || userMessage.includes('weather') || userMessage.includes('forecast')) {
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

    } else if (userMessage === '4' || userMessage.includes('rewards') || userMessage.includes('points')) {
      const rewards = [
        { name: 'Organic Seeds', points: 500, emoji: '🌱' },
        { name: 'Weather Station', points: 1000, emoji: '📱' },
        { name: 'Farming Course', points: 750, emoji: '🎓' }
      ];
      
      const isKikuyu = session.language === 'kik' || farmer.language === 'kik';
      
      if (isKikuyu) {
        response = `🎁 *Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ*\n\n`;
        response += `*Available Rewards:*\n`;
        rewards.forEach((reward, index) => {
          response += `${index + 1}️⃣ ${reward.emoji} ${reward.name} - ${reward.points} pts\n`;
        });
        response += `\n*Your Points:* ${farmer.mavunoPoints}\n`;
        response += `*Max Points Today:* 500 (You can earn ${500 - farmer.mavunoPoints} more)\n\n`;
        response += `*Commands:*\n`;
        response += `• Type "redeem 1" for Organic Seeds\n`;
        response += `• Type "redeem 2" for Weather Station\n`;
        response += `• Type "redeem 3" for Farming Course\n\n`;
        response += `*MavunoAI Team* 🌱`;
      } else {
        response = `🎁 *Rewards & Points*\n\n`;
        response += `*Available Rewards:*\n`;
        rewards.forEach((reward, index) => {
          response += `${index + 1}️⃣ ${reward.emoji} ${reward.name} - ${reward.points} pts\n`;
        });
        response += `\n*Your Points:* ${farmer.mavunoPoints}\n`;
        response += `*Max Points Today:* 500 (You can earn ${500 - farmer.mavunoPoints} more)\n\n`;
        response += `*Commands:*\n`;
        response += `• Type "redeem 1" for Organic Seeds\n`;
        response += `• Type "redeem 2" for Weather Station\n`;
        response += `• Type "redeem 3" for Farming Course\n\n`;
        response += `*MavunoAI Team* 🌱`;
      }
      updateUserSession(phoneNumber, { state: 'main_menu' });

    } else if (userMessage === '5' || userMessage.includes('language')) {
      const isKikuyu = session.language === 'kik' || farmer.language === 'kik';
      session.language = isKikuyu ? 'en' : 'kik';
      
      response = isKikuyu ? 
        'Language switched to English. Type "menu" to see the main menu.' :
        'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ Gĩa Gũthũngũrũrũ Gĩa Gũthũngũrũrũ';
      updateUserSession(phoneNumber, { state: 'main_menu' });

    } else if (userMessage.includes('redeem')) {
      const rewardNumber = userMessage.match(/redeem (\d+)/)?.[1];
      const rewards = [
        { name: 'Organic Seeds', points: 500 },
        { name: 'Weather Station', points: 1000 },
        { name: 'Farming Course', points: 750 }
      ];
      
      if (!rewardNumber) {
        response = 'Please specify reward number (1-3)';
      } else {
        const selectedReward = rewards[parseInt(rewardNumber) - 1];
        
        if (!selectedReward) {
          response = 'Invalid reward number';
        } else if (farmer.mavunoPoints < selectedReward.points) {
          response = `Not enough points. You need ${selectedReward.points - farmer.mavunoPoints} more points.`;
        } else {
          response = `🎉 *Reward Redeemed Successfully!*\n\n`;
          response += `*Reward:* ${selectedReward.name}\n`;
          response += `*Points Used:* ${selectedReward.points}\n`;
          response += `*Remaining Points:* ${farmer.mavunoPoints - selectedReward.points}\n\n`;
          response += `*Delivery:* 3-5 business days\n`;
          response += `*Contact:* +254 700 000 000\n\n`;
          response += `*MavunoAI Team* 🌱`;
        }
      }
      updateUserSession(phoneNumber, { state: 'main_menu' });

    } else if (userMessage.includes('help') || userMessage === 'hi' || userMessage === 'hello' || userMessage === 'menu' || userMessage === '0') {
      response = showMainMenu(farmer, session);
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
      // Default response - show main menu
      response = showMainMenu(farmer, session);
      updateUserSession(phoneNumber, { state: 'main_menu' });
    }

    // Award points for interactions
    if (userMessage !== 'menu' && userMessage !== '0' && userMessage !== 'help') {
      const pointsEarned = 50; // Base points for interaction
      farmer.mavunoPoints += pointsEarned;
      console.log(`Awarded ${pointsEarned} points to ${phoneNumber}. Total: ${farmer.mavunoPoints}`);
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
    message: 'MavunoAI Enhanced WhatsApp Bot',
    status: 'running',
    version: '2.0.0',
    features: ['USSD-style menu', 'Rewards system', 'Kikuyu language support', 'Points tracking']
  });
});

// Start server
app.listen(port, () => {
  console.log(`🌱 MavunoAI Enhanced WhatsApp Bot running on port ${port}`);
  console.log(`📱 Webhook URL: http://localhost:${port}/webhook`);
  console.log(`🔗 Backend API: ${API_BASE_URL}`);
  console.log(`🎯 Features: USSD-style menu, Rewards system, Kikuyu language support`);
});

export default app;
