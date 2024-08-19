'use client';
import { useCheckPathname } from 'hooks/useCheckPathname';
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'
import { FaVideo } from 'react-icons/fa6'
import { GiExitDoor } from 'react-icons/gi'
import { IoChatbubbles } from 'react-icons/io5';
import { MdEdit, MdSpaceDashboard } from 'react-icons/md'
import { TbListDetails } from 'react-icons/tb'



function ClubBar() {
  const { clubId } = useParams();
  const { includesElements } = useCheckPathname();
  return (
    <div className={` ${!includesElements('settings') ? 'flex' : 'hidden'} flex-col justify-between sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] gap-6 bg-dark-gray p-4 border-r border-primary-color text-white`}>
      <div className="flex flex-col gap-4">
      <Link className='flex items-center gap-2' href={`/club/${clubId}`}>
          <MdSpaceDashboard size={24} /> 
          </Link>
         <Link className='flex items-center gap-2' href={`/club/${clubId}/chat`}>
         <IoChatbubbles size={24} /> 
      </Link>
      <Link className='flex items-center gap-2' href={`/club/${clubId}/settings`}>
          <MdEdit size={24} className=' text-blue-600'/> 
          </Link>
      </div>   
        
          <button className='flex items-center text-red-400 gap-2'>
              <GiExitDoor  size={24} /> 
          </button>
    </div>
  )
}

export default ClubBar