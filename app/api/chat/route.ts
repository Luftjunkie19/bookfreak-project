import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI as createGroq } from '@ai-sdk/openai';

import { convertToCoreMessages, generateText, streamText, tool } from 'ai';
import { z } from 'zod';


export async function POST(req: NextRequest) {
  try {
  const { messages } = await req.json();
const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});


  const result = await streamText({
    model: groq('llama-3.1-70b-versatile'),
    tools: {
        getCurrentTime: tool({
      description: 'gets current time',
      parameters: z.object({
        param1: z.string().describe('A word time')
      }),
    execute: async ({ param1 }) => {
        return new Date().toISOString();
    },  
  })
    },
     toolChoice: 'auto',
    system: 'You are a helpful assistant.',
    messages: convertToCoreMessages(messages),
  });
    



  return result.toAIStreamResponse();
    

  } catch (err) {
    return err;
}


}