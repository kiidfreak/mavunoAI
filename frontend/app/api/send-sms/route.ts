import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, message } = await request.json();
    
    // Africa's Talking SMS API
    const apiKey = 'atsk_66edaebd775b571170ca20c0f621acf544cac8d7d8c5d14158ee26a9490cd45d857952f2';
    const username = 'sandbox';
    
    const data = JSON.stringify({
      username: username,
      to: phoneNumber,
      message: message
    });

    const response = await fetch('https://api.sandbox.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': apiKey
      },
      body: data
    });

    const result = await response.json();
    
    if (result.SMSMessageData) {
      return NextResponse.json({ 
        success: true, 
        message: 'SMS sent successfully',
        data: result.SMSMessageData 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to send SMS',
        data: result 
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error('SMS API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
