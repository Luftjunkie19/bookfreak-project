import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'



export async function POST(request: NextRequest) {
    try {
        const { id } = await request.json();
    
      const foundTest =  await prisma.test.findUnique({
          where: {
                id
            },
            include:{
                questions:{
                    include:{
                        answers:{'include':{
                            'Question':true
                }
            }}
        },
        results:{
            'include':{
                'user':true,
            },
        },
            }
      });
        
        return NextResponse.json(foundTest);
        
    } catch (error) {
        return NextResponse.json(error);
    }
}
