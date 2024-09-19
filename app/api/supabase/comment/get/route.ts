import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
        const { id } = await request.json();
    
      const foundComment =  await prisma.comment.findUnique({
            where:{id},
      });
        
        return NextResponse.json(foundComment);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}