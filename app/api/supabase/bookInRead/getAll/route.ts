import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
    const {
            where,
            include,
            take,
            skip,
            orderBy
        } = await request.json();
    
      const bookProgress =  await prisma.bookInRead.findMany({
           where:where || undefined,
           include: include || undefined,
            take: take || undefined,
            skip: skip || undefined,
            orderBy: orderBy || undefined,
      });
        
        return NextResponse.json({data:bookProgress, error:null});
        
    } catch (error) {
        return NextResponse.json({data:null, error});
    }
}