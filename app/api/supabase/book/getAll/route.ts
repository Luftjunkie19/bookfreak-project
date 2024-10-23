import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {

        const { select, orderBy, skip, take, where,include } = await request.json();
        


    
        const foundItems = await prisma.book.findMany({
            include,
            skip,
            take,
            where,
            orderBy,
      });
        
        return NextResponse.json({data:foundItems, error:null});
        
    } catch (error) {
        return NextResponse.json({ data:null, error});
    }
}