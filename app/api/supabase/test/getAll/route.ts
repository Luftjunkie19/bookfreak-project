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


      const tests =  await prisma.test.findMany({
          where,
            include,
            take,
            skip,
            orderBy
      });
        
        return NextResponse.json({data:tests, error:null});
        
    } catch (error) {
        return NextResponse.json({data: null, error});
    }
}