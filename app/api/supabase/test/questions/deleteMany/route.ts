import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
        const { data } = await request.json();
    
      const createdTest =  await prisma.question.deleteMany({
          where: {
                id: data.id,
            }
      });
        
        return NextResponse.json(createdTest);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}