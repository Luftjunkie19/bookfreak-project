import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
    const {
          id,
        questionId
        } = await request.json();
    

        const createdTest = await prisma.answer.delete({
            where: {
                id,
                AND: {
                  questionId
              }
            }
      })
        
        return NextResponse.json(createdTest);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}