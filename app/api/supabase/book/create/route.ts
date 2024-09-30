import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {  data  } = await req.json();
      
      
      const fetchedItem = await prisma.book.create({
        data
        })

        return NextResponse.json({data:fetchedItem, error:null});

  }
    
    catch (err) {
         return NextResponse.json({data:null, error:err});
}


}