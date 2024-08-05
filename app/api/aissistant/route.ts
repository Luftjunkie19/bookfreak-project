import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API,
}) 

export async function POST(req: NextRequest) {




  return NextResponse.json({ message: 'hello' });
}