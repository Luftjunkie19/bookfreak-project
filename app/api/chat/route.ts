import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI as createGroq } from '@ai-sdk/openai';

import { convertToCoreMessages, generateText, streamText, tool } from 'ai';
import { z } from 'zod';

export const runtime = 'edge';


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
        weather: tool({
          description: 'Get the weather in a location',
          parameters: z.object({
            location: z.string().describe('The location to get the weather for'),
          }),
          execute: async ({ location }) => {
            return `In ${location} it is sunny !`
          }
        }),
       
        time: tool({
          description: 'Tells the time now',
          parameters: z.object({
            timezone: z.string().describe('Any word from sentence'),
          }),
          execute: async ({timezone}) => {
             return new Date().toLocaleTimeString();
          }
        })
      },
      system: 'You are an helper for book related things.',
      experimental_toolCallStreaming: true,
    toolChoice:'auto',
    messages
  });
    



  return result.toAIStreamResponse();
    

  } catch (err) {
    console.log(err);
    return err;
}


}