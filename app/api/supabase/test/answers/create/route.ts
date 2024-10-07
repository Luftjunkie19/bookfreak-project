import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
    const {
        answerContent,
        isCorrect,
        id,
        questionId
        } = await request.json();
    

    
        const createdAnswer = await prisma.answer.create({
            data: {
                answerContent,
                id,
                isCorrect,
                questionId
            }
            
      })
        
        return NextResponse.json({ data: createdAnswer, error:null});
        
    } catch (error) {
        return NextResponse.json(error);
    }
}