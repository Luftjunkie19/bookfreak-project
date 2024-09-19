import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {  data,where  } = await req.json();

        const fetchedItem = await prisma.book.update({
            data,
            where
        })

        return NextResponse.json(fetchedItem);

  }
    
    catch (err) {
         return NextResponse.json({...err, error:'Error occured'});
}


}