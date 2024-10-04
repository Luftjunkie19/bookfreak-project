import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {

        const { select, skip, take, where, } = await request.json();
        


    
        const foundItems = await prisma.book.findMany({
            select,
            skip,
            take,
            where,
      });
        
        return NextResponse.json({data:foundItems, error:null});
        
    } catch (error) {
        return NextResponse.json({ data:null, error});
    }
}