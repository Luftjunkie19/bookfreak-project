import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
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
        
        return NextResponse.json({data:items, error:null});
        
    } catch (error) {
        return NextResponse.json({data:null, error});
    }
}