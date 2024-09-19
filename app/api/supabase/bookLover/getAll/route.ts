import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function GET(request: NextRequest) {
    try {
    const {
            where,
            select,
            take,
            skip,
            orderBy
        } = await request.json();
    
      const createdTest =  await prisma.bookLover.findMany({
           where,
            select,
            take,
            skip,
            orderBy
      });
        
        return NextResponse.json(createdTest);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}