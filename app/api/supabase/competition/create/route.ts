import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const { competitionName, competitionType, endDate, startDate, id,  chat,
            chatId} = await request.json();
        const createdCompetition = await prisma.competition.create({
            data: {
                endDate,
                startDate,
                competitionName,
                competitionType,
                id,
                chat,
            chatId,
            },
        });

        return NextResponse.json(createdCompetition);
    } catch (err) {
        return NextResponse.json(err);
    }
}