import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {  where  } = await req.json();

        const fetchedItem = await prisma.hashtag.findUnique({
           where
        })

        return NextResponse.json(fetchedItem);

  }
    
    catch (err) {
         return NextResponse.json({...err, error:'Error occured'});
}


}