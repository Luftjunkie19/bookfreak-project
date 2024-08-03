// import { Timestamp } from "firebase/firestore";

// export interface BookInRead {
// id:string,
// readingProgress: ReadingProgress[],
// readingNotes: ReadingNote[],
// startedReading: Timestamp,
// typeOfReadBook: 'audiobook' | 'book' | 'e-book',
// hasFinished: boolean,
// }


// export interface ReadingProgress{
// startedReading: Timestamp, 
// finishedReading: Timestamp,
// readPages: number,
// }


// export interface UserShelf {
// shelfId:string,
// shelfName:string,
// shelfDescription:string,
// books: {bookId:string}[],
// }


// export interface UserInterface {
// username:string,
// email:string,
// id:string,
// description:string,
// premiumMember:boolean,
// premiumAccount?:{
// threadId:string | null,
// ...subscriptionDetails,
// id:string,
// customerId:string,
// validUntil:Timestamp,
// },
// photoURL:string,
// joinedData:Timestamp,
// creditsAvailable:{
// USD?:{
// fundsAccumulated:number,
// currency:string,
// } | null,
// },
// accountLinkObject:{
// stripeAccountData,
// createdAt:number,
// validUntil:number,
// link:string,
// },
// booksInRead: BookInRead[] | [],
// userShelfs:UserShelf[] | [],
// }


// export interface Book {
// title:string,
// author:Author,
// genre: string,
// description: string,
// id:string,
// coverImg:string,
// pages:number,
// lovedBy:{id:string, profileImg:string, nickname:string}[],
// bookAddedAt:Timestamp, 
// insertedAt:{
// id:string,
// nickname:string,
// },
// releaseData:Timestamp,
// languageVersion: string,
// }


// export interface UserChat{
// chatUsers:[User1, User2],
// chatId: string,
// messages:Message[],
// initiatedAt:Timestamp,
// }


// export interface Competition{
// id: string,
// competitionName:string,
// competitionType: string,
// competitionRules: [],
// competitionCreatedDate:Timestamp,
// competitionExpiryDate:Timestamp,
// members: Member[],
// chatMessages:Message[],
// }

// export interface Club{}




// export interface Test{}


// export interface Quote{}


// export interface Event{}


