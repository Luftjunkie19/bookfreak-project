import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function GET(request: NextRequest) {
    try {
    
      const foundTests =  await prisma.comment.findMany();
        
        return NextResponse.json(foundTests);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}