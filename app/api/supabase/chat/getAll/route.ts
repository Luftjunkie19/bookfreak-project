import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function GET(request: NextRequest) {
    try {
    const {
            where,
include,
            take,
            skip,
            orderBy
        } = await request.json();
    
      const createdTest =  await prisma.chat.findMany({
           where:{'users':{'some':{id:where.id}}},
           include:{'users':true, 'messages':true},
            take,
            skip,
            orderBy
      });
        
        return NextResponse.json(createdTest);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}