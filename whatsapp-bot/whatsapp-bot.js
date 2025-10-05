/**
 * MavunoAI WhatsApp Bot
 * Direct WhatsApp connection using whatsapp-web.js
 */

import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import axios from 'axios';

// Backend API URL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth()
});

// User sessions storage
const userSessions = new Map();

// Demo farmer data
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
        level: 'Sustainable Pioneer'
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
        level: 'Eco Beekeeper'
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
        farm_size: 1.0,
        language: 'en',
        mavunoPoints: 0,
        level: 'New Farmer'
    };
}

function getUserSession(phoneNumber) {
    if (!userSessions.has(phoneNumber)) {
        userSessions.set(phoneNumber, {
            state: 'main_menu',
            language: 'en',
            points: 0,
            lastActivity: new Date()
        });
    }
    return userSessions.get(phoneNumber);
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

function formatWeatherMessage(weatherData, location) {
    if (!weatherData) {
        return "❌ Unable to fetch weather data. Please try again later.";
    }

    const { current, forecast } = weatherData;
    let message = `🌤️ *Weather for ${location}*\n\n`;
    
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
    
    const totalRainfall = forecast.slice(0, 7).reduce((sum, day) => sum + day.rainfall_mm, 0);
    message += `\n*Weekly Rainfall:* ${totalRainfall.toFixed(0)}mm\n`;
    
    if (totalRainfall > 20) {
        message += "💡 *Good planting conditions!*";
    } else if (totalRainfall > 10) {
        message += "💡 *Moderate rainfall expected*";
    } else {
        message += "💡 *Low rainfall - consider irrigation*";
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
• Type "menu" for this menu

*MavunoAI Team* 🌱`;
}

// Event handlers
client.on('qr', (qr) => {
    console.log('\n🔗 WhatsApp QR Code:');
    console.log('📱 Scan this QR code with your WhatsApp mobile app:');
    qrcode.generate(qr, { small: true });
    console.log('\n⏳ Waiting for WhatsApp connection...');
});

client.on('ready', () => {
    console.log('✅ WhatsApp client is ready!');
    console.log('🌱 MavunoAI WhatsApp Bot is now active');
    console.log('📱 Send any message to start using the bot');
});

client.on('message', async (message) => {
    const chat = await message.getChat();
    const contact = await message.getContact();
    const body = message.body.toLowerCase().trim();
    const phoneNumber = contact.number;

    console.log(`📨 Received from ${phoneNumber}: ${body}`);

    const session = getUserSession(phoneNumber);
    const farmer = getFarmerData(phoneNumber);

    let response = '';

    try {
        // Handle different message types
        if (body === '1' || body.includes('weather') || body.includes('forecast')) {
            const weatherData = await callBackendAPI('/api/v1/weather/forecast', {
                latitude: farmer.latitude,
                longitude: farmer.longitude,
                days: 7
            });
            response = formatWeatherMessage(weatherData, farmer.location);
            session.points += 50;

        } else if (body === '2' || body.includes('advice') || body.includes('advisory')) {
            const advisoryData = await callBackendAPI('/api/v1/advisory', {
                farmer_id: `farmer_${phoneNumber.slice(-6)}`,
                latitude: farmer.latitude,
                longitude: farmer.longitude,
                crop: farmer.crops[0],
                farm_size_ha: farmer.farm_size
            });
            response = formatAdvisoryMessage(advisoryData);
            session.points += 50;

        } else if (body === '3' || body.includes('price') || body.includes('market')) {
            const commodity = farmer.crops[0] || 'maize';
            const marketData = await callBackendAPI(`/api/v1/market/prices?commodity=${commodity}&location=${farmer.location}`);
            
            if (marketData) {
                response = `💰 *Market Prices - ${commodity.toUpperCase()}*\n\n`;
                response += `*${marketData.location}:* ${marketData.current_price} KES/kg\n`;
                response += `*Trend:* ${marketData.trend === 'increasing' ? '📈' : marketData.trend === 'decreasing' ? '📉' : '➡️'} ${marketData.trend}\n`;
                response += `*7-day change:* ${marketData.price_change_7d_percent}%\n\n`;
                if (marketData.recommendation) {
                    response += `*💡 Recommendation:*\n${marketData.recommendation}`;
                }
            } else {
                response = "❌ Unable to fetch market data. Please try again later.";
            }
            session.points += 50;

        } else if (body === '4' || body.includes('rewards') || body.includes('points')) {
            const rewards = [
                { name: 'Organic Seeds', points: 500, emoji: '🌱' },
                { name: 'Weather Station', points: 1000, emoji: '📱' },
                { name: 'Farming Course', points: 750, emoji: '🎓' }
            ];
            
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

        } else if (body === '5' || body.includes('language')) {
            const isKikuyu = session.language === 'kik' || farmer.language === 'kik';
            session.language = isKikuyu ? 'en' : 'kik';
            
            response = isKikuyu ? 
                'Language switched to English. Type "menu" to see the main menu.' :
                'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ Gĩa Gũthũngũrũrũ Gĩa Gũthũngũrũrũ';

        } else if (body.includes('redeem')) {
            const rewardNumber = body.match(/redeem (\d+)/)?.[1];
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

        } else if (body.includes('help') || body === 'hi' || body === 'hello' || body === 'menu' || body === '0') {
            response = showMainMenu(farmer, session);

        } else {
            // Default response - show main menu
            response = showMainMenu(farmer, session);
        }

        // Award points for interactions
        if (body !== 'menu' && body !== '0' && body !== 'help') {
            session.points += 10; // Base points for interaction
            console.log(`🎯 Awarded 10 points to ${phoneNumber}. Total: ${session.points}`);
        }

    } catch (error) {
        console.error('Error handling message:', error);
        response = `❌ Sorry, I encountered an error. Please try again later.`;
    }

    // Send response
    await chat.sendMessage(response);
    console.log(`📤 Sent response to ${phoneNumber}`);
});

// Start the WhatsApp client
console.log('🌱 Starting MavunoAI WhatsApp Bot...');
console.log('📱 Backend API:', API_BASE_URL);
console.log('⏳ Initializing WhatsApp connection...');

client.initialize();
