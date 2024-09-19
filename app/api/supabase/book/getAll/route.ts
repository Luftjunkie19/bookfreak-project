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
    
      const createdItem =  await prisma.book.findMany({
           where,
            select,
            take,
            skip,
            orderBy
      });
        
        return NextResponse.json(createdItem);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}