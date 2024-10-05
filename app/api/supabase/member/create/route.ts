import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { data } = await req.json();
        
        const { userId, competitionId } = data;

        console.log(data);


        const fetchedItem = await prisma.member.create({
            data: {
                userId,
                competitionId
        }
        })

        return NextResponse.json({data:fetchedItem, error:null});

  }
    
    catch (err) {
    console.log(err);
        return NextResponse.json({...err, error:'Error occured'});
}


}