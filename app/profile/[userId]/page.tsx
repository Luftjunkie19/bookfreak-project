'use client';

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


import translations from '../../../assets/translations/ProfileTranslations.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useLogout } from '../../../hooks/useLogout';
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
import { ButtonGroup } from '@nextui-org/react';
import Post from 'components/elements/activity/Post';
import { useQuery } from '@tanstack/react-query';
import { LucideMessageCircle } from 'lucide-react';
import { useState } from 'react';

function Profile({params}:{params:{userId:string}}) {
  const { userId } = params;
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

    const navigate = useRouter();
  const [activeBtn, setActiveBtn] = useState<string>();
  const { user } = useAuthContext();

  const { data:document } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id:userId, include:{
                recensions: true,
                notifications: true,
                'BookLover': true,
                'Comment': true,
                'Result': true,
                'addedBooks': true,
                'bookShelfs': true,
                'booksInRead': true,
                'Club': true,
                'Post': true,
            },}),
    }).then((res)=>res.json())
  })
  // const removeAccount=httpsCallable(functions, 'removeAccount');
  const { logout } = useLogout();
  // const { getDocument } = useRealtimeDocument();
  // const { removeFromDataBase } = useRealDatabase();
  // const {document}=useGetDocument('users', id);


// const {documents:books}=useGetDocuments('books');
//   const {documents: links}= useGetDocuments("links");
//   const { documents: favBooks } = useGetDocuments("lovedBooks");
// const {documents: readers}=useGetDocuments("bookReaders");






//   const redirectToExistedChat = async (providedId) => {
// const providedIdPartOne=providedId.split("-")[0];
// const providedIdPartTwo=providedId.split("-")[1];

//     // const optionOne = await getDocument("usersChats",providedId);
//     // const secondOption= await getDocument("usersChats", `${providedIdPartTwo}-${providedIdPartOne}`);

//     if(optionOne){
//       navigate.push(`/message-to/${providedId}`);
//     }
//     if(secondOption){
//       navigate.push(`/message-to/${providedIdPartTwo}-${providedIdPartOne}`);
//     }else{
//       navigate.push(`/message-to/${providedId}`);
//     }


//   };

  // const removeFiancialAccount = async () => {
  //   await removeAccount( { accountId: document.stripeAccountData.id });
  //   removeFromDataBase("users", (user as User).uid);
  //   await logout();
  //   await deleteUser(user as User);
  // };



  return (
    <div className={`min-h-screen w-full h-full`}>
   {document && document.data && 
        <>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col w-full sm:gap-14 lg:gap-0">
          <div className='bg-dark-gray min-h-52 relative top-0 left-0'>
          <div className="flex gap-8 items-center absolute -bottom-12 left-4 m-2">
            <Image src={document.data.photoURL} alt='' width={60} height={60} className='w-48 h-48 rounded-full' />
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <p className='text-white text-3xl font-semibold'>{document.data.nickname}</p>
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
                Message <LucideMessageCircle />
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
            
            

            <div className="flex flex-col gap-4 w-full max-w-5xl">
                  <div className='flex gap-4 items-center'>
                <Button onClick={() => {
                  setActiveBtn('posts')
      }} type={activeBtn === 'posts' ? 'blue' : 'black'}>Posts</Button>
      <Button onClick={() => {
                  setActiveBtn('bookshelfs')
      }} type={activeBtn === 'bookshelfs' ? 'blue' : 'black'}>Bookshelfs</Button>
      <Button onClick={() => {
                  setActiveBtn('competitions')
      }} type={activeBtn === 'competitions' ? 'blue' : 'black'}>Competitions</Button>
      <Button onClick={() => {
                  setActiveBtn('clubs')
      }} type={activeBtn === 'clubs' ? 'blue' : 'black'}>Club</Button>
      <Button onClick={() => {
                  setActiveBtn('books')
      }} type={activeBtn === 'books' ? 'blue' : 'black'}>Books</Button>
      <Button onClick={() => {
                  setActiveBtn('reviews')
      }} type={activeBtn === 'reviews' ? 'blue' : 'black'}>Reviews</Button>    
    </div>
              <div className=" flex flex-col gap-4 w-full max-h-[36rem] overflow-y-auto ">
                {activeBtn && activeBtn === 'posts' && document.data.Post.length > 0  ? <>
                  {document.data.Post.map((item)=>(<Post key={item.id} type={'white'} userImg={document.data.photoURL} username={document.data.nickname} isOwner={item.ownerId === user?.id} timePassed={''} content={item.body} images={item.images} postData={item} />))}
                           
                
                </> : <>
               {activeBtn && <p className='text-center text-white'>No Posts Have been inserted yet !</p>}
                </>}
                


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
