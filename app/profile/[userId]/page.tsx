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
import BlueButton from 'components/buttons/BlueButton';
import { BsFillPersonPlusFill } from 'react-icons/bs';
import DarkButton from 'components/buttons/WhiteButton';
import { IoIosChatbubbles, IoMdBookmarks } from 'react-icons/io';
import { MdSpaceDashboard } from 'react-icons/md';
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
import Slide from 'components/home/swipers/base-swiper/Slide';
import Book from 'components/elements/Book';

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
      {document && (<>          
        <div className="flex sm:flex-col lg:flex-row sm:p-2 lg:p-6 mx-auto m-0 max-w-screen-2xl gap-4 w-full justify-between">
          <div className="flex sm:flex-col lg:flex-row lg:items-center gap-6">
          <Image src={document.photoURL} alt='' className='sm:w-24 sm:h-24 lg:w-48 lg:h-48 rounded-full' width={70} height={70} />
            
            <div className="flex flex-col gap-2">
              <p className='text-2xl font-semibold text-white'>{document.nickname}</p>
              <p className='text-white'>0 Friends</p>
              <div className="flex gap-4 items-center">
                <Link href={`/profile/${id}/dashboard`} className='flex gap-2 text-white items-center'>Dashboard <MdSpaceDashboard size={24} /> </Link>
                <Link href={`/profile/${id}/settings`} className='flex gap-2 text-white items-center'>Settings <FaUserGear size={24} /></Link>
              </div>
               <div className="flex gap-4 items-center ">
  <div className="flex gap-2 items-center">
    
 <IoMdBookmarks className="text-white" size={24} />
    
    <div className=" text-white">Inserted {books.filter((item)=>item.createdBy.id === id).length}</div>

  </div>

  <div className="flex gap-2 items-center">
   
        <FaBook className="text-white" size={24}/>

    <div className="text-white">Read {yourFinishedBooks.length}</div>
  </div>

  <div className="flex gap-2 items-center">
   <FaHeart size={24} className='text-red-400'/>
    <p className=" text-white">Liked {lovedBooks.length}</p>
  </div>
          </div>
            </div>      
            
</div>
          <div className="flex gap-4 lg:self-end lg:items-center">
            <BlueButton additionalClasses='flex gap-2 text-sm items-center'>Send Request <BsFillPersonPlusFill /> </BlueButton>
              <DarkButton additionalClasses='flex gap-2 text-sm items-center'>Message <IoIosChatbubbles  /> </DarkButton>
</div>
          </div>
          
        <div className="flex sm:flex-col lg:flex-row mx-auto m-0 justify-between w-full p-4 gap-4">
          <div className="max-w-lg p-4 flex flex-col gap-2 rounded-lg w-full border-2 border-primary-color bg-dark-gray">
         
            <p className='text-white text-xl font-bold'>Description</p>
            <p className='text-white w-full h-32 overflow-y-auto'>{document.description.trim().length > 0 ?  document.description : "No description"}</p>
          </div>
          
       
                    
        </div>
             <div className="flex flex-col gap-1 p-4 w-full max-w-7xl">
          <p className='text-white text-2xl font-semibold'>Loved Books</p>
        {lovedBooks.length === 0 && <div>
            <p className='text-gray-500'>No Loved Books yet</p>
            </div>}
          <BaseSwiper  additionalClasses='w-full p-0'>
          {lovedBooks.map((item) => (<Slide key={item.id}>
          <Book bookCover={item.photoURL} pages={item.pagesNumber} author={item.author} bookId={item.id} title={item.title} bookCategory={item.category} />
        </Slide>))}
        </BaseSwiper>
</div>
        
             <div className="flex flex-col gap-1 p-4 w-full max-w-7xl">
          <p className='text-white text-2xl font-semibold'>Inserted Books</p>
        {yourFinishedBooks.length === 0 && <div>
            <p className='text-gray-500'>No Read Books yet</p>
            </div>}
          <BaseSwiper additionalClasses='w-full'>
          {yourFinishedBooks.map((item) => (<Slide key={item.id}>
          <Book bookCover={item.photoURL} pages={item.pagesNumber} author={item.author} bookId={item.id} title={item.title} bookCategory={item.category} />
        </Slide>))}
        </BaseSwiper>
</div>


                  <div className="flex flex-col gap-1 p-4 w-full max-w-7xl">
          <p className='text-white text-2xl font-semibold'>Inserted Books</p>
        {books.filter((item)=>item.createdBy.id === id).length === 0 && <div>
            <p className='text-gray-500'>No Inserted Books yet</p>
            </div>}
          <BaseSwiper additionalClasses='w-full'>
          {books.filter((item)=>item.createdBy.id === id).map((item) => (<Slide key={item.id}>
          <Book bookCover={item.photoURL} pages={item.pagesNumber} author={item.author} bookId={item.id} title={item.title} bookCategory={item.category} />
        </Slide>))}
        </BaseSwiper>
</div>
        

        
      </>
      )}
    </div>
  );
}

export default Profile;
