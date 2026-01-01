import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

interface UserInput {
  message: string;
  channel: string;
  customer_name?: string;
}

async function aiBrain(systemRole: string, userText: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemRole },
      { role: 'user', content: userText },
    ],
  });
  return response.choices[0].message.content?.trim() || '';
}

async function detectIntent(message: string): Promise<string> {
  const prompt = `
    Detect intent from message.
    Intents:
    - BUY
    - SELL
    - SUPPORT
    - PAYMENT
    - CALL
    - GENERAL

    Message: ${message}
  `;
  return await aiBrain('You are an intent classifier.', prompt);
}

async function salesAi(message: string): Promise<string> {
  return await aiBrain(
    'You are a professional AI sales closer.',
    `Close the deal professionally:\n${message}`
  );
}

async function supportAi(message: string): Promise<string> {
  return await aiBrain('You are a helpful customer support agent.', message);
}

async function gmailAi(emailText: string): Promise<string> {
  return await aiBrain(
    'You are a professional business email assistant.',
    `Reply professionally to this email:\n${emailText}`
  );
}

function paymentAi(): string {
  return `✅ Payment Ready\n\nPlease complete your payment using the secure link below.\nOnce paid, your order will be processed immediately.`;
}

function callAi(name: string): string {
  return `📞 Call Scheduled\n\nHi ${name}, our AI has scheduled a call for you.\nOur representative will contact you shortly.`;
}

export async function POST(request: NextRequest) {
  try {
    const input: UserInput = await request.json();

    if (!input.message || !input.channel) {
      return NextResponse.json(
        { error: 'Missing required fields: message and channel' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key') {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    const intent = await detectIntent(input.message);
    let reply: string;

    if (intent.includes('BUY')) {
      reply = await salesAi(input.message);
    } else if (intent.includes('SELL')) {
      reply = await salesAi('Handle seller inquiry');
    } else if (intent.includes('SUPPORT')) {
      reply = await supportAi(input.message);
    } else if (intent.includes('PAYMENT')) {
      reply = paymentAi();
    } else if (intent.includes('CALL')) {
      reply = callAi(input.customer_name || 'Customer');
    } else if (input.channel === 'email') {
      reply = await gmailAi(input.message);
    } else {
      reply = await aiBrain(
        'You are an intelligent business assistant.',
        input.message
      );
    }

    return NextResponse.json({
      intent,
      reply,
      time: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
