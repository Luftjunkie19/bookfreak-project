import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
    const {
         data
        } = await request.json();
    
      const createdPost =  await prisma.post.create({
        data
      });
        
        return NextResponse.json(createdPost);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}