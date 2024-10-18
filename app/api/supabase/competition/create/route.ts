import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const { competitionName, competitionType,chargeId, endDate, startDate,rules, prizeId, id,competitionLogo,prizeHandedIn,description, prize,chatId,
             } = await request.json();
        
        const createdChat = await prisma.chat.create({
            data: {
                'dateOfCreation': new Date(),
                id: chatId,
            }
        });

        console.log(createdChat, 'created chat !');

        
        const createdCompetition = await prisma.competition.create({
            data: {
                id,
                competitionName,
                endDate,
                rules,
                startDate: new Date(),
                competitionType,
                chatId: createdChat.id,
                competitionLogo,
                prize,
                prizeId,
                description,
                prizeHandedIn,
                chargeId,
                
            },
        }); 
        console.log(createdCompetition);

        return NextResponse.json({data:createdCompetition, error:null});
    } catch (err) {
        console.error(err);
        return NextResponse.json({data:null, error:err});
    }
}