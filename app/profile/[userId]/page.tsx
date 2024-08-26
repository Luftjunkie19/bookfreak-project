'use client';

import { deleteUser, User } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import {
  BiSolidBook,
  BiSolidBookHeart,
  BiSolidLike,
} from 'react-icons/bi';
import {
  FaBook,
  FaBookOpen,
  FaBookReader,
  FaCommentAlt,
  FaPlusCircle,
  FaStar,
  FaTrophy,
  FaUserAltSlash,
  FaUserFriends,
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
import { IoIosChatbubbles, IoMdBookmarks, IoMdFemale } from 'react-icons/io';
import { MdPersonAdd, MdReviews, MdSpaceDashboard } from 'react-icons/md';
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
import Slide from 'components/home/swipers/base-swiper/Slide';
import Book from 'components/elements/Book';
import { SwiperSlide } from 'swiper/react';
import Button from 'components/buttons/Button';
import { TbMessageCircle2Filled } from 'react-icons/tb';
import { ButtonGroup } from '@nextui-org/react';
import Post from 'components/elements/activity/Post';

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
   {document && 
        <>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col w-full sm:gap-14 lg:gap-0">
          <div className='bg-dark-gray min-h-52 relative top-0 left-0'>
          <div className="flex gap-8 items-center absolute -bottom-12 left-4 m-2">
            <Image src={document.photoURL} alt='' width={60} height={60} className='w-48 h-48 rounded-full' />
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <p className='text-white text-3xl font-semibold'>{document.nickname}</p>
                  <p className='text-gray-400  text-sm self-end'>Joined in February 2024</p>
                </div>
              <p className='flex gap-2 items-center'>
                <FaUserFriends className='text-primary-color text-2xl' />
                <p className='text-white'>19 Friends</p>
              </p>
            </div>
            </div>
            
      </div>  
            <div className="flex items-center gap-4 p-2 self-end">
              <Button type={'blue'} additionalClasses='flex gap-2 items-center'>
                Invite Friend <MdPersonAdd />
              </Button>
              <Button type={'white-blue'} additionalClasses='flex gap-2 items-center'>
                Message <TbMessageCircle2Filled />
              </Button>
            </div>
            
       </div>

          
          <div className="flex sm:flex-col 2xl:flex-row w-full gap-6 px-2 py-4">
            <div className="flex sm:flex-col xl:flex-row 2xl:flex-col gap-4">
               <div className="flex flex-col gap-2 max-w-md rounded-lg border-2 p-2 border-primary-color bg-dark-gray w-full">
              <p className='text-xl text-white font-semibold'>Details</p>
              <div className="h-40 text-white overflow-y-auto">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem, at maxime quod rem sed ipsum iste harum natus facilis reiciendis cupiditate quasi aspernatur minima quam dolore laudantium magnam in voluptatibus consectetur, fugit tenetur similique aliquam ab? Possimus, eos laborum laudantium tempora corporis, consectetur eius reprehenderit nemo pariatur, culpa neque vel.</div>
              <div className="flex gap-2 text-white items-center">
                <IoMdFemale className='text-2xl' />
                <p>She/her</p>
              </div>
              <div className="flex gap-3 text-white items-center">
                <BiSolidBookHeart className='text-2xl' />
                <div className="flex flex-col ">
                  <p className='font-light'>Favourite Book</p>
                  <p>Book Title</p>
                </div>
              </div>
                  <div className="flex gap-3 text-white items-center">
                <FaBookOpen  className='text-2xl' />
         <div className="flex flex-col ">
                  <p className='font-light'>Currently Reading</p>
                  <p>Book Title</p>
                </div>
              </div>
              </div>
              
              <div className="flex flex-col gap-2 max-w-md rounded-lg border-2 p-2 border-primary-color bg-dark-gray w-full">
                <p className='text-xl text-white font-semibold'>Statistics</p>
                <div className="flex flex-col p-1 gap-6">
              <div className="flex gap-2 text-white items-center">
                <FaTrophy className='text-2xl text-yellow-600' />
                <p>2 Competitions won</p>
              </div>
              <div className="flex gap-3 text-white items-center">
                <FaBookReader className='text-2xl text-primary-color' />
               <p>12 Books Read this year</p>
              </div>
                  <div className="flex gap-3 text-white items-center">
                <FaBook  className='text-2xl' />

                  <p className='font-light'>50 Books read in total</p>
                  </div>
                  
                  <div className="flex gap-3 text-white items-center">
                  <MdReviews className='text-2xl text-primary-color'/>

                  <p className='font-light'>4 Reviews Shared</p>
                  </div>


                </div>
            </div>
           </div>
            
            

            <div className="flex flex-col gap-4">
                  <div className='flex gap-4 items-center'>
      <Button type={'blue'}>Posts</Button>
      <Button type={'black'}>Bookshelfs</Button>
      <Button type={'black'}>Competitions</Button>
      <Button type={'black'}>Club</Button>
      <Button type={'black'}>Books</Button>
      <Button type={'black'}>Reviews</Button>    
    </div>
               <div className=" flex  flex-col gap-4 w-full max-h-[36rem] overflow-y-auto items-center ">
                <Post type={'white'} userImg={document.photoURL} username={document.nickname} isOwner={false} timePassed={''} content={'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae pariatur aspernatur quisquam mollitia sed quia voluptatem fugiat, soluta voluptatum cum quasi doloremque saepe incidunt laborum. Inventore laborum eveniet maxime aut? Debitis nemo, soluta velit temporibus commodi illo incidunt nobis quos minima consectetur voluptatibus cum. Numquam quam, repellat voluptatem doloremque optio facere ut est reiciendis ex dolore. Sunt illo beatae, optio porro maxime consequuntur quo numquam a voluptatem, fuga neque nobis?'} images={[]} postData={{}} />
                              <Post  type={'white'} userImg={document.photoURL} username={document.nickname} isOwner={false} timePassed={''} content={'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae pariatur aspernatur quisquam mollitia sed quia voluptatem fugiat, soluta voluptatum cum quasi doloremque saepe incidunt laborum. Inventore laborum eveniet maxime aut? Debitis nemo, soluta velit temporibus commodi illo incidunt nobis quos minima consectetur voluptatibus cum. Numquam quam, repellat voluptatem doloremque optio facere ut est reiciendis ex dolore. Sunt illo beatae, optio porro maxime consequuntur quo numquam a voluptatem, fuga neque nobis?'} images={[]} postData={{}}/>
                                            <Post  type={'white'} userImg={document.photoURL} username={document.nickname} isOwner={false} timePassed={''} content={'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae pariatur aspernatur quisquam mollitia sed quia voluptatem fugiat, soluta voluptatum cum quasi doloremque saepe incidunt laborum. Inventore laborum eveniet maxime aut? Debitis nemo, soluta velit temporibus commodi illo incidunt nobis quos minima consectetur voluptatibus cum. Numquam quam, repellat voluptatem doloremque optio facere ut est reiciendis ex dolore. Sunt illo beatae, optio porro maxime consequuntur quo numquam a voluptatem, fuga neque nobis?'} images={[]} postData={{}}/>
                <Post type={'white'} userImg={document.photoURL} username={document.nickname} isOwner={false} timePassed={''} content={'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae pariatur aspernatur quisquam mollitia sed quia voluptatem fugiat, soluta voluptatum cum quasi doloremque saepe incidunt laborum. Inventore laborum eveniet maxime aut? Debitis nemo, soluta velit temporibus commodi illo incidunt nobis quos minima consectetur voluptatibus cum. Numquam quam, repellat voluptatem doloremque optio facere ut est reiciendis ex dolore. Sunt illo beatae, optio porro maxime consequuntur quo numquam a voluptatem, fuga neque nobis?'} images={[]} postData={{}} />
                


            </div>
            </div>

          </div>
         

        </div>
          
        
       
   </>
 }
      
    </div>
  );
}

export default Profile;
