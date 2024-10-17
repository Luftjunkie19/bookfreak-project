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
    
      const recensions =  await prisma.recension.findMany({
           where: where || undefined,
            select: select || undefined,
            take: take || undefined,
            skip: skip || undefined,
            orderBy: orderBy ||undefined,
      });
        
        return NextResponse.json({ data: recensions, error:null});
        
    } catch (error) {
        return NextResponse.json({data:null, error});
    }
}