import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const {  id  } = await req.json();

        const fetchedItem = await prisma.user.findUnique({
            'where': {
               id
           }
        })

        return NextResponse.json(fetchedItem);

  }
    
    catch (err) {
         return NextResponse.json({...err, error:'Error occured'});
}


}