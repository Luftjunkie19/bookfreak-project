import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
        const { testArray } = await request.json();
    
      const createdTests =  await prisma.test.createMany({
            data:testArray
      });
        
        return NextResponse.json(createdTests);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}