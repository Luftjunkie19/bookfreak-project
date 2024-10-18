import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {  where, include } = await req.json();

        const fetchedItem = await prisma.prize.findUnique({
          where,
          include
        })

        return NextResponse.json({data:fetchedItem, error:null});

  }
    
    catch (err) {
         return NextResponse.json({data:null, error:err});
}


}