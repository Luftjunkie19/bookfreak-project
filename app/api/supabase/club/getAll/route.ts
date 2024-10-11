import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
    const {
            where,
            select,
            take,
            skip,
        orderBy,
            include
        } = await request.json();
    
      const clubsArray =  await prisma.club.findMany({
           where,
          include,
            take,
            skip,
            orderBy
      });
        
        return NextResponse.json({data:clubsArray,error:null });
        
    } catch (error) {
        return NextResponse.json({data:null,error });
    }
}