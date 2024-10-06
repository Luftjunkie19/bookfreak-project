import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
        const { data } = await request.json();
    
      const createdChat =  await prisma.chat.create({
            data,
      });
        
        return NextResponse.json({data:createdChat, error:null});
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({data:null, error});
    }
}