import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {  where, include } = await req.json();

        const fetchedItem = await prisma.book.findUnique({
          where,
          include: {
            'lovedBy': true,
            'recensions': true,
            'publishingHouse': true,
            'addedBy':true,
          }
        })

        return NextResponse.json({ data:fetchedItem, error:null});

  }
    
    catch (error) {
         return NextResponse.json({data:null, error});
}


}