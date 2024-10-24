import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
    const {
      id,
        } = await request.json();
    
      const createdTest =  await prisma.post.findUnique({
          where: {
               id
        },
        include: {
          'owner': true,
          'hashtags':true,
          'lovers': {
            'include': {
              'user':true,
            },
          },
          'comments': {
            include: {
              'owner': true,
              'hashtags':true,
            }
          }
        }
      });
        
        return NextResponse.json(createdTest);
        
    } catch (error) {
      console.error(error);
        return NextResponse.json(error);
    }
}