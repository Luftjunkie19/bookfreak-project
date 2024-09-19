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
    
      const items =  await prisma.club.findMany({
           where,
            select,
            take,
            skip,
            orderBy
      });
        
        return NextResponse.json(items);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}