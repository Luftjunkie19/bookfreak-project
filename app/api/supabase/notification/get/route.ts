import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {  id  } = await req.json();

        const fetchedItem = await prisma.notification.findUnique({
           where:{
            id,
           }
        })

        return NextResponse.json({data:fetchedItem, error:null});

  }
    
    catch (err) {
    console.log(err);
        return NextResponse.json({...err, error:'Error occured'});
}


}