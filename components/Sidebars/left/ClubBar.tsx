'use client';
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'
import { FaVideo } from 'react-icons/fa6'
import { GiExitDoor } from 'react-icons/gi'
import { IoChatbubbles } from 'react-icons/io5';
import { MdEdit, MdSpaceDashboard } from 'react-icons/md'
import { TbListDetails } from 'react-icons/tb'



function ClubBar() {
  const {clubId}=useParams();
  return (
       <div className='flex flex-col gap-6 bg-dark-gray p-4 border-r border-primary-color text-white'>
          <Link className='flex items-center gap-2' href={`/club/${clubId}/dashboard`}>
          <MdSpaceDashboard size={24} /> 
          </Link>
          <Link className='flex items-center gap-2' href={`/club/${clubId}/details`}>
          <TbListDetails size={24} /> 
          </Link>
          <button className='flex items-center gap-2'>
              <IoChatbubbles size={24} /> 
          </button>
          <button className='flex text-blue-300  items-center gap-2'>
              <MdEdit size={24} /> 
          </button>
          <button className='flex items-center text-red-400 gap-2'>
              <GiExitDoor  size={24} /> 
          </button>
    </div>
  )
}

export default ClubBar