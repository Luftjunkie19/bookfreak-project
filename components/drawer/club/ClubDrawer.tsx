'use client';
import { useParams } from 'next/navigation';
import React from 'react'
import { GiExitDoor } from 'react-icons/gi';
import { IoChatbubbles } from 'react-icons/io5';
import { MdEdit, MdSpaceDashboard } from 'react-icons/md';
import Drawer from '../Drawer'
import Link from 'next/link';
import { useCheckPathname } from 'hooks/useCheckPathname';

type Props = {isSwiped?:boolean}

function ClubDrawer({isSwiped}: Props) {
const {includesElements}=useCheckPathname();
    const {clubId}=useParams();

  return (
    <Drawer className={`${includesElements('/settings') && 'hidden'}`} isSwiped={isSwiped}>
    <div className="flex flex-col gap-4">
      <Link className='flex items-center text-white gap-2' href={`/club/${clubId}`}>
          <MdSpaceDashboard size={24} /> Dashboard
          </Link>
         <Link className='flex items-center text-white gap-2' href={`/club/${clubId}/chat`}>
         <IoChatbubbles size={24} /> Chat
      </Link>
      <Link className='flex items-center gap-2 text-white' href={`/club/${clubId}/settings`}>
          <MdEdit size={24} className=' text-primary-color'/> Settings
          </Link>
      </div>   
        
          <button className='flex items-center text-red-400 gap-2'>
              <GiExitDoor size={24} /> Leave
          </button>

    </Drawer>
  )
}

export default ClubDrawer