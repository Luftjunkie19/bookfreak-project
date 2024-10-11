import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
        const { data } = await request.json();
    
        const createdTest = await prisma.test.create({
            data
      });
        
        return NextResponse.json({data:createdTest, error:null});
        
    } catch (error) {
        return NextResponse.json({data:null, error});
    }
}