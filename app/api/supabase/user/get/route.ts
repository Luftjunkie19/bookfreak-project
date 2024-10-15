import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {  id, include  } = await req.json();

        const fetchedItem = await prisma.user.findUnique({
            'where': {
                id
            },
            include: include || undefined,
        })

        return NextResponse.json({ data: fetchedItem, error:null});

  }
    
    catch (error) {
         return NextResponse.json({data:null, error});
}


}