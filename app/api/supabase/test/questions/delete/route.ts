import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
        const { id } = await request.json();
    
      const deletedQuestion =  await prisma.question.delete({
          where: {
                id
            }
      });
        
        return NextResponse.json(deletedQuestion);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}