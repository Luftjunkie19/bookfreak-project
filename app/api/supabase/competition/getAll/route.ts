import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
        const { where, take, skip, orderBy, include   } = await request.json();
    
        const receivedCompetitions = await prisma.competition.findMany({
            where,
            include: {
                members: true,
                rules:true,
            },
            take,
            skip,
            orderBy
      });
        
        return NextResponse.json({data:receivedCompetitions, error:null});
        
    } catch (error) {
        return NextResponse.json({data:null, error});
    }
}