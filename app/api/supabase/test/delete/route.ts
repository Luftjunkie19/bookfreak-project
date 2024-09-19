import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
        const { id } = await request.json();
    
      const deletedTest =  await prisma.test.delete({
          where: {
                creatorId:id,
            },
            
      });
        
        return NextResponse.json(deletedTest);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}