// Enhanced WhatsApp Service with USSD Features and Rewards
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

class EnhancedWhatsAppService {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth()
    });
    this.isReady = false;
    this.farmerSessions = new Map();
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.client.on('qr', (qr) => {
      console.log('QR Code received, scan with WhatsApp:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('WhatsApp client is ready!');
      this.isReady = true;
    });

    this.client.on('message', async (message) => {
      await this.handleIncomingMessage(message);
    });
  }

  async start() {
    try {
      await this.client.initialize();
      console.log('Enhanced WhatsApp service initialized');
    } catch (error) {
      console.error('Failed to initialize WhatsApp:', error);
    }
  }

  async handleIncomingMessage(message) {
    const chat = await message.getChat();
    const contact = await message.getContact();
    const body = message.body.toLowerCase();
    const phoneNumber = contact.number;

    // Initialize farmer session if not exists
    if (!this.farmerSessions.has(phoneNumber)) {
      this.farmerSessions.set(phoneNumber, {
        step: 'main_menu',
        language: 'en',
        points: 0,
        rewards: []
      });
    }

    const session = this.farmerSessions.get(phoneNumber);

    // Handle different message types
    if (body.includes('menu') || body.includes('help') || body === '0') {
      await this.showMainMenu(chat, session);
    } else if (body === '1') {
      await this.handleWeatherRequest(chat, session);
    } else if (body === '2') {
      await this.handleSoilHealthRequest(chat, session);
    } else if (body === '3') {
      await this.handleMarketPricesRequest(chat, session);
    } else if (body === '4') {
      await this.handleRewardsRequest(chat, session);
    } else if (body === '5') {
      await this.handleLanguageToggle(chat, session);
    } else if (body.includes('redeem')) {
      await this.handleRewardRedemption(chat, session, body);
    } else if (body.includes('points')) {
      await this.showPointsStatus(chat, session);
    } else {
      await this.showMainMenu(chat, session);
    }
  }

  async showMainMenu(chat, session) {
    const isKikuyu = session.language === 'kik';
    
    const menu = isKikuyu ? `
🌱 *MavunoAI - Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ*

*Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ:*
1️⃣ *Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ* - Weather forecast
2️⃣ *Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ* - Soil health check
3️⃣ *Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ* - Market prices
4️⃣ *Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ* - Rewards & Points
5️⃣ *Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ* - Language: ${isKikuyu ? 'Kikuyu' : 'English'}

*Mavuno Points:* ${session.points}
*Level:* ${this.getFarmerLevel(session.points)}

*Commands:*
• Type number (1-5) to select
• Type "redeem [reward]" to redeem
• Type "points" to check balance
• Type "menu" for this menu

*MavunoAI Team* 🌱
    ` : `
🌱 *MavunoAI - Sustainable Farming Assistant*

*Main Menu:*
1️⃣ *Weather Forecast* - Get weather updates
2️⃣ *Soil Health* - Check soil conditions
3️⃣ *Market Prices* - View crop prices
4️⃣ *Rewards & Points* - Earn and redeem rewards
5️⃣ *Language* - Switch to ${isKikuyu ? 'English' : 'Kikuyu'}

*Mavuno Points:* ${session.points}
*Level:* ${this.getFarmerLevel(session.points)}

*Commands:*
• Type number (1-5) to select
• Type "redeem [reward]" to redeem
• Type "points" to check balance
• Type "menu" for this menu

*MavunoAI Team* 🌱
    `;

    await chat.sendMessage(menu);
  }

  async handleWeatherRequest(chat, session) {
    const isKikuyu = session.language === 'kik';
    
    // Simulate weather data
    const weatherData = {
      temperature: '25°C',
      rainfall: '15mm expected',
      humidity: '65%',
      forecast: 'Good for farming'
    };

    const message = isKikuyu ? `
🌤️ *Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ*

*Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ:*
• Temperature: ${weatherData.temperature}
• Rainfall: ${weatherData.rainfall}
• Humidity: ${weatherData.humidity}
• Forecast: ${weatherData.forecast}

*Points Earned:* +50 Mavuno Points
*Total Points:* ${session.points + 50}

*MavunoAI Team* 🌱
    ` : `
🌤️ *Weather Forecast*

*Current Conditions:*
• Temperature: ${weatherData.temperature}
• Rainfall: ${weatherData.rainfall}
• Humidity: ${weatherData.humidity}
• Forecast: ${weatherData.forecast}

*Points Earned:* +50 Mavuno Points
*Total Points:* ${session.points + 50}

*MavunoAI Team* 🌱
    `;

    session.points += 50;
    await chat.sendMessage(message);
  }

  async handleRewardsRequest(chat, session) {
    const isKikuyu = session.language === 'kik';
    
    const rewards = [
      { name: 'Organic Seeds', points: 500, emoji: '🌱' },
      { name: 'Weather Station', points: 1000, emoji: '📱' },
      { name: 'Farming Course', points: 750, emoji: '🎓' }
    ];

    const message = isKikuyu ? `
🎁 *Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ*

*Available Rewards:*
${rewards.map((reward, index) => 
  `${index + 1}️⃣ ${reward.emoji} ${reward.name} - ${reward.points} pts`
).join('\n')}

*Your Points:* ${session.points}
*Max Points Today:* 500 (You can earn ${500 - session.points} more)

*Commands:*
• Type "redeem 1" for Organic Seeds
• Type "redeem 2" for Weather Station
• Type "redeem 3" for Farming Course

*MavunoAI Team* 🌱
    ` : `
🎁 *Rewards & Points*

*Available Rewards:*
${rewards.map((reward, index) => 
  `${index + 1}️⃣ ${reward.emoji} ${reward.name} - ${reward.points} pts`
).join('\n')}

*Your Points:* ${session.points}
*Max Points Today:* 500 (You can earn ${500 - session.points} more)

*Commands:*
• Type "redeem 1" for Organic Seeds
• Type "redeem 2" for Weather Station
• Type "redeem 3" for Farming Course

*MavunoAI Team* 🌱
    `;

    await chat.sendMessage(message);
  }

  async handleRewardRedemption(chat, session, message) {
    const isKikuyu = session.language === 'kik';
    const rewardNumber = message.match(/redeem (\d+)/)?.[1];
    
    if (!rewardNumber) {
      await chat.sendMessage(isKikuyu ? 
        'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ' : 
        'Please specify reward number (1-3)'
      );
      return;
    }

    const rewards = [
      { name: 'Organic Seeds', points: 500 },
      { name: 'Weather Station', points: 1000 },
      { name: 'Farming Course', points: 750 }
    ];

    const selectedReward = rewards[parseInt(rewardNumber) - 1];
    
    if (!selectedReward) {
      await chat.sendMessage(isKikuyu ? 
        'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ' : 
        'Invalid reward number'
      );
      return;
    }

    if (session.points < selectedReward.points) {
      await chat.sendMessage(isKikuyu ? 
        `Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ. Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ ${selectedReward.points - session.points} more points.` :
        `Not enough points. You need ${selectedReward.points - session.points} more points.`
      );
      return;
    }

    session.points -= selectedReward.points;
    session.rewards.push(selectedReward);

    const confirmationMessage = isKikuyu ? `
🎉 *Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ!*

*Reward:* ${selectedReward.name}
*Points Used:* ${selectedReward.points}
*Remaining Points:* ${session.points}

*Delivery:* 3-5 business days
*Contact:* +254 700 000 000

*MavunoAI Team* 🌱
    ` : `
🎉 *Reward Redeemed Successfully!*

*Reward:* ${selectedReward.name}
*Points Used:* ${selectedReward.points}
*Remaining Points:* ${session.points}

*Delivery:* 3-5 business days
*Contact:* +254 700 000 000

*MavunoAI Team* 🌱
    `;

    await chat.sendMessage(confirmationMessage);
  }

  async handleLanguageToggle(chat, session) {
    session.language = session.language === 'en' ? 'kik' : 'en';
    
    const message = session.language === 'kik' ? 
      'Gĩthũngũrũrũ Gĩa Gũthũngũrũrũ Gĩa Gũthũngũrũrũ Gĩa Gũthũngũrũrũ' :
      'Language switched to English. Type "menu" to see the main menu.';
    
    await chat.sendMessage(message);
  }

  getFarmerLevel(points) {
    if (points >= 3000) return 'Sustainable Master';
    if (points >= 1500) return 'Eco Champion';
    if (points >= 500) return 'Green Pioneer';
    return 'New Farmer';
  }

  async sendPointsAlert(phoneNumber, maxPoints, currentPoints) {
    if (!this.isReady) return;

    const remainingPoints = maxPoints - currentPoints;
    const message = `
📊 *Points Alert*

*Current Points:* ${currentPoints}
*Max Points Today:* ${maxPoints}
*Remaining:* ${remainingPoints} points

*Keep earning by:*
• Using NASA satellite data
• Implementing sustainable practices
• Achieving water efficiency targets
• Maintaining soil health
• Sharing knowledge with community

*MavunoAI Team* 🌱
    `;

    try {
      await this.client.sendMessage(`${phoneNumber}@c.us`, message);
    } catch (error) {
      console.error('Failed to send points alert:', error);
    }
  }
}

export default EnhancedWhatsAppService;
