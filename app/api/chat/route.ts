import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI as createGroq } from '@ai-sdk/openai';

import { convertToCoreMessages, generateText, streamText } from 'ai';


export async function POST(req: NextRequest) {
  try {
  const { messages } = await req.json();
const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});


  const result = await streamText({
    model: groq('llama-3.1-70b-versatile'),
    system: 'You are a helpful assistant.',
    messages: convertToCoreMessages(messages),
  });



  return result.toAIStreamResponse();
    

  } catch (err) {
    return err;
}


}