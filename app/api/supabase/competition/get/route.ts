import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
        const { id, include } = await request.json();
    
        const fetchedTest = await prisma.competition.findUnique({
            where: {
                id,
            },
            include: {
                members: {
                    'include': {
                        user:true
                    }
                },
                rules:true
            },
      });
        
        return NextResponse.json({data:fetchedTest, error:null});
        
    } catch (error) {
        return NextResponse.json({data:null, error});
    }
}