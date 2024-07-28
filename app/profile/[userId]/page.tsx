'use client';

import { deleteUser, User } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import {
  BiSolidBook,
  BiSolidLike,
} from 'react-icons/bi';
import {
  FaBook,
  FaCommentAlt,
  FaPlusCircle,
  FaStar,
  FaUserAltSlash,
} from 'react-icons/fa';
import {
  FaBookBookmark,
  FaGear,
  FaGears,
  FaHeart,
  FaUserGear,
} from 'react-icons/fa6';
import {
  IoPieChartSharp,
  IoShareSocialSharp,
} from 'react-icons/io5';
import { useSelector } from 'react-redux';

import Link from 'next/link';

import { functions } from '../../firebase';
import translations from '../../../assets/translations/ProfileTranslations.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocument from '../../../hooks/useGetDocument';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useLogout } from '../../../hooks/useLogout';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import useRealtimeDocument from '../../../hooks/useRealtimeDocument';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BsFillPersonPlusFill } from 'react-icons/bs';
import { IoIosChatbubbles, IoMdBookmarks } from 'react-icons/io';
import { MdSpaceDashboard } from 'react-icons/md';
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
import Slide from 'components/home/swipers/base-swiper/Slide';
import Book from 'components/elements/Book';
import { SwiperSlide } from 'swiper/react';

function Profile({params}:{params:{userId:string}}) {
  const { userId:id } = params;
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const removeAccount=httpsCallable(functions, 'removeAccount');
  const { logout } = useLogout();
  const { getDocument } = useRealtimeDocument();
  const { removeFromDataBase } = useRealDatabase();
  const {document}=useGetDocument('users', id);


const {documents:books}=useGetDocuments('books');
  const {documents: links}= useGetDocuments("links");
  const { documents: favBooks } = useGetDocuments("lovedBooks");
const {documents: readers}=useGetDocuments("bookReaders");

const readerObjects=readers.map((bookReader) => {
  return bookReader.readers;
}).map((obj) => {
  const nestedObject = Object.values(obj);
  return nestedObject;
}).flat();

  const navigate = useRouter();

  const { user } = useAuthContext();

  const booksFilter = books.map((book) => {
    return { bookId: book.id, pagesNumber: book.pagesNumber };
  });


  
  const readersFiltered = readerObjects.filter((reader:any) => reader.id === id);

  const lovedBooks=books.map((book,i)=>{
    return books.filter((bookItem)=>bookItem.id === favBooks.filter((fav)=>fav.lovedBy===(user as User).uid)[i]?.lovedBookId);
  }).flat();

  const yourFinishedBooks=readersFiltered.map((reader:any)=>{
    return books.filter((bookItem:any)=>bookItem.id === reader?.bookReadingId && reader.pagesRead === bookItem?.pagesNumber);
}).flat();

  const redirectToExistedChat = async (providedId) => {
const providedIdPartOne=providedId.split("-")[0];
const providedIdPartTwo=providedId.split("-")[1];

    const optionOne = await getDocument("usersChats",providedId);
    const secondOption= await getDocument("usersChats", `${providedIdPartTwo}-${providedIdPartOne}`);

    if(optionOne){
      navigate.push(`/message-to/${providedId}`);
    }
    if(secondOption){
      navigate.push(`/message-to/${providedIdPartTwo}-${providedIdPartOne}`);
    }else{
      navigate.push(`/message-to/${providedId}`);
    }


  };

  const removeFiancialAccount = async () => {
    await removeAccount( { accountId: document.stripeAccountData.id });
    removeFromDataBase("users", (user as User).uid);
    await logout();
    await deleteUser(user as User);
  };



  return (
    <div className={`min-h-screen w-full h-full`}>
   
    </div>
  );
}

export default Profile;
