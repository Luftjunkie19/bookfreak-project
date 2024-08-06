import OpenAI from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export async function POST(req: NextRequest, ) {
    try {
        const { prompt } = await req.json();
    
        const response = await openai.images.generate({
      model: "dall-e-3",
            prompt,
      n:1,
      size: "1024x1024",
    });
    
        return Response.json({images:response.data});
        
    } catch (error) {
        return Response.json(error);
    }

}