import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
    const {
       id,questionId,data
        } = await request.json();
    

        const createdTest = await prisma.answer.update({
            where: {
                id, AND: {
                questionId
            }},
            data
      })
        
        return NextResponse.json(createdTest);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}