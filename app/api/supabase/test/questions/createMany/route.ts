import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
        const { data } = await request.json();
    
      const createdQuestions =  await prisma.question.createMany({
            data
      });
        
        return NextResponse.json({data:createdQuestions, error:null});
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({data:null, error});
    }
}