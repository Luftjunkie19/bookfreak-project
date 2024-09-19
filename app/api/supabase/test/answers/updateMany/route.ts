import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
    const {
       data,where
        } = await request.json();
    

        const createdTest = await prisma.answer.updateMany({
            data,
            where
      })
        
        return NextResponse.json(createdTest);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}