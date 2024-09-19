import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function GET(request: NextRequest) {
    try {
    const {
           id
        } = await request.json();
    
      const createdTest =  await prisma.club.findUnique({
          where: {
            id
        }
      });
        
        return NextResponse.json(createdTest);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}