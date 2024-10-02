import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function GET(request: NextRequest) {
    try {
    
      const createdItem =  await prisma.book.findMany();
        
        return NextResponse.json(createdItem);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}