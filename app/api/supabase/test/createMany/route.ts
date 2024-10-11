import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
        const { testArray } = await request.json();
    
      const createdAnswers =  await prisma.test.createMany({
            data:testArray
      });
        
        return NextResponse.json({data:createdAnswers, error:null});
        
    } catch (error) {
        return NextResponse.json(error);
    }
}