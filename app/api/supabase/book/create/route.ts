import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { id, publishingHouseId,publishingCycle, authorId,language,serie, releaseDate, bookPublishingHouse, bookDescription, isbn, bookAuthor, genre, volumeNumber, accessibleTypes, volume,pages,fullTitle,bookAddedAt,title, bookCover, userId    } = await req.json();
      
      
      const fetchedItem = await prisma.book.create({
        data: {
          id,
          language,
          serie,
          releaseDate,
          bookPublishingHouse,
          bookDescription,
          bookAuthor,
          isbn,
          genre,
          volumeNumber,
          accessibleTypes,
          volume,
          pages,
          fullTitle,
          bookAddedAt,
          title,
          bookCover,
          userId,
          publishingCycle
        }
        })

        return NextResponse.json({data:fetchedItem, error:null});

  }
    
    catch (err) {
         return NextResponse.json({data:null, error:err});
}


}