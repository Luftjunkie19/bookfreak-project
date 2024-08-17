'use client';
import CreateBtn from '../../buttons/CreateBtn'
import React from 'react'
import SearchBtn from '../../buttons/SearchBtn'
import { Tooltip } from '@nextui-org/react'
import { GiBookCover, GiBookshelf, GiCheckedShield, GiPayMoney } from 'react-icons/gi'
import { RiRobot3Fill } from 'react-icons/ri'
import { usePathname } from 'next/navigation'
import Button from 'components/buttons/Button';
import { FaPeopleGroup, FaQuoteRight, FaTrophy, FaUsers } from 'react-icons/fa6';
import { MdEditDocument, MdWorkspacePremium } from 'react-icons/md';
import { BsFillCalendar2EventFill } from 'react-icons/bs';
import { WiStars} from 'react-icons/wi';
import Link from 'next/link';
import { GrDocumentPerformance } from 'react-icons/gr';
import { useAuthContext } from 'hooks/useAuthContext';

type Props = {}

function DefaultLeftBar({ }: Props) {
  const {user } = useAuthContext();
  const location = usePathname();
  return (
    <div className={`overflow-y-auto ${location.includes('/book/') || location.includes('/competition/') || location.includes('/club/') || location.includes('form/test') || location.includes('/signup') || location.includes('/login') || location.includes('/profile/') || (location.includes('/chat') && !location.includes('aissistant')) ? 'hidden': 'sm:hidden lg:flex'} z-40 py-4 px-2 sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] lg:max-w-fit xl:max-w-36 2xl:max-w-64 w-full  border-r-dark-gray  flex-col gap-2 rounded-r-xl border-r-2 `}>          
      <div className="flex flex-col flex-grow">
        
      <SearchBtn />
      <div className="flex flex-col gap-2">
        <Link href={'/search/books'}>      
        <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <GiBookshelf className='text-2xl'/> <span className='sm:hidden xl:block'>Books</span> 
        </Button>
        </Link>
        <Link href={'/search/users'}>   <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <FaUsers className='text-2xl'/> <span className='sm:hidden xl:block'>Users</span> 
        </Button></Link>
        <Link href={'/search/tests'}>        <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <MdEditDocument className='text-2xl'/> <span className='sm:hidden xl:block'>Tests</span> 
        </Button></Link>
        <Link href={'/search/clubs'}>      <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <GiCheckedShield className='text-2xl'/>  <span className='sm:hidden xl:block'>Clubs</span>
        </Button></Link>
        <Link href={'/search/competitions'}>         <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <FaTrophy className='text-2xl'/>  <span className='sm:hidden xl:block'>Competitions</span> 
        </Button></Link>
        <Link href={'/search/quotes'}>
              <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <FaQuoteRight className='text-2xl'/> <span className='sm:hidden xl:block'>Quotes</span> 
        </Button></Link>
        <Link href={'/search/events'}>   
        <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
              <BsFillCalendar2EventFill className='text-2xl'/> <span className='sm:hidden xl:block'>Events</span> 
          </Button>
        </Link>
       
     


      </div>
      <div className="">
      <p className='text-white flex gap-4 text-lg items-center'>  <span className='sm:hidden xl:block'>Premium Features</span>  <WiStars className=' text-primary-color text-2xl'/> </p>
      <div className="flex text-sm gap-2 flex-col">
          <Link href={'/chat/aissistant'}>   
        <Button type='transparent' additionalClasses=' flex gap-2 items-center font-medium'>
              <RiRobot3Fill className='text-2xl text-gray-600'/> <p className=' text-gray-600'><span className=' text-primary-color sm:hidden xl:block'> AIssistant </span></p>
          </Button>
        </Link>
          <Link href={'/ai-test-creator'}>   
        <Button type='transparent' additionalClasses=' flex gap-2 items-center font-medium'>
              <GrDocumentPerformance className='text-2xl text-gray-600 xl:'/> <p className=' text-gray-600 sm:hidden xl:block'>AI-Test Creator</p>
          </Button>
        </Link>
          <Link href={'/aissistant'}>   
        <Button type='transparent' additionalClasses=' flex gap-2 items-center font-medium'>
              <GiBookCover  className='text-2xl text-gray-600'/> <p className=' text-gray-600 sm:hidden xl:block'>BookCover Creator</p>
          </Button>
        </Link>
</div>
        </div>
    </div>
        
      <div className="flex flex-col gap-2">
        <Button type='blue' additionalClasses='flex items-center gap-2 w-fit px-3'>Premium <MdWorkspacePremium className='' /></Button>
</div>
      

        
    </div>
  )
}

export default DefaultLeftBar