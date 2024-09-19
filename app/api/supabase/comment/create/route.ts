import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
        const { data } = await request.json();
    
      const createdComment =  await prisma.comment.create({
            data,
      });
        
        return NextResponse.json(createdComment);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}