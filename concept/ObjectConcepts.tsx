// import { Timestamp } from "firebase/firestore";

export interface BookInRead {
id:string,
readingProgress: ReadingProgress[],
readingNotes: ReadingNote[],
startedReading: Timestamp,
goalToFinish?: Timestamp,
typeOfReadBook: 'audiobook' | 'book' | 'e-book',
hasFinished: boolean,
}


 export interface ReadingNote{
 id:string,
 content: string,
 timeOfReading:Timestamp,
 refersToProgress:string
 pageReference:string,
 pageImages:string[],
 }


export interface ReadingProgress{
startedReading: Timestamp,
finishedReading: Timestamp,
readPages: number,
id:string,
}


export interface UserShelf {
shelfId:string,
shelfName:string,
shelfDescription:string,
books: {bookId:string}[],
}


export interface UserInterface {
username:string,
email:string,
id:string,
description:string,
premiumMember:boolean,
premiumAccount?:{
threadId:string | null,
subscriptionDetails: {} | null,
id:string,
customerId:string,
validUntil:Timestamp,
},
photoURL:string,
joinedData:Timestamp,
creditsAvailable:{
fundsAccumulated:number,
currency:string,
} | null,

accountLinkObject:{
...stripeAccountData,
createdAt:number,
validUntil:number,
link:string,
},
booksInRead: BookInRead[] | [],
userShelfs:UserShelf[] | [],
}


export interface Book {
title:string,
fullTitle?:string,
author:Author,
genre: string,
description: string,
id:string,
coverImg:string,
pages:number,
lovedBy:{id:string, profileImg:string, nickname:string}[],
bookAddedAt:Timestamp,
insertedBy:{
id:string,
nickname:string,
},
languageVersion: string,
publishingHouse:{
id:string,
name:string,
}
releaseData:Timestamp,
isbn?:number,
volume?: number,
volumeNumber?:number,
accessibleTypes: 'ebook' | 'book' | 'audiobook'
bookDescription?: string,
bookCover:string,
}

export interface Author {
  id: string,
  nickname: string,
  profileImg: string,
authorDescription:string,
}


export interface Heart{
    id: string,
    userId: string,
    likedTime: Timestamp,
    userImg:string,
}




export interface UserChat{
chatUsers:[User1, User2],
chatId: string,
messages:Message[],
initiatedAt:Timestamp,
}


export interface Competition{
id: string,
competitionName:string,
competitionType: string,
competitionRules: Rule,
hasUserReceivedAward: boolean,
competitionCreatedDate:Timestamp,
competitionExpiryDate:Timestamp,
members: Member[],
chatMessages:Message[],
moneyPrizeDetails: {currency:string, amount:number, transferRef:string},
prizeDetails:{type:'book' | 'ticket' | 'voucher' | 'other', details:{description:string, voucher?:{voucherFor?:string}, book?:{title:string, author:string, bookCover?:string,  bookDescription?:string, bookId?:string}, ticket?:{ticketTo?:string, description:string}}},
renewals: Renewal[],
competitionSerieWinners: Renewal[]
isPrizeMoney:boolean,
}

 export interface Club{
id:string,
clubName:string, 
clubLogo:string,
clubDescription:string,
members:Member[]
chatMessages:Message[],
hasSpecialRequirements:boolean,
isFreeToJoin:boolean,
requirements: Requirement[]
}



 export interface Test{
id:string,
name:string,
description:string,
questions:Question[],
}

export interface Question {
questionContent:string,
answers:Answer[],
correctAnswers:string[]
}

export interface Answer {
answerId:string,
answerContent:string,
}



 export interface Quote{
quoteId:string,
bookRef?:string,
quoteContent:string,
author?:string,
comments:Comment[],
hearts: Heart[]
}



export interface Event{
startingDate:Timestamp,
ExpiryDate:Timestamp,
name:string,
description:string,
location:Location[],
isPremium?:boolean,
premiumExpiry?: {
premiumPurchasedAt:Timestamp,
premiumType:string,
},
bgImage?:string,
presentationImages:string[]
}



