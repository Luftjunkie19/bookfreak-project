import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const { competitionName, competitionType, endDate, startDate, id,
            chatId } = await request.json();
        
        const createdChat = await prisma.chat.create({
            data: {
                'dateOfCreation': new Date(),
                id: chatId,
            }
        });

        console.log(createdChat);

        
        
        
        const createdCompetition = await prisma.competition.create({
            data: {
                endDate,
                startDate: new Date(),
                competitionName,
                competitionType,
                id,
                chatId: createdChat.id,
            
            },
        }); 
        console.log(createdCompetition);

        return NextResponse.json(createdCompetition);
    } catch (err) {
        return NextResponse.json(err);
    }
}