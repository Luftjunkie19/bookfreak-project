import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { nickname, id, email, photoURL } = await req.json();

        const fetchedItem = await prisma.user.create({
            data: {
                nickname,
                id,
                email,
                dateOfJoin: new Date(),
                photoURL
            }
        })

        return NextResponse.json(fetchedItem);

  }
    
    catch (err) {
         return NextResponse.json({...err, error:'Error occured'});
}


}