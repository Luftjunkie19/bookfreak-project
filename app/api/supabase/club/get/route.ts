import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function GET(request: NextRequest) {
    try {
    const {
           id, include
        } = await request.json();
    
      const foundTest =  await prisma.club.findUnique({
          where: {
            id
        },include: include || undefined
      });
        
        return NextResponse.json({data:foundTest, error:null});
        
    } catch (error) {
        return NextResponse.json({data:null, error});
    }
}