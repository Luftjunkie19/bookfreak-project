'use client';
import { useRealDocument } from 'hooks/firestore/useGetRealDocument';
import { useAuthContext } from 'hooks/useAuthContext';
import Image from 'next/image';
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useMemo } from 'react'
import { FaGear, FaVideo } from 'react-icons/fa6'
import { GiExitDoor } from 'react-icons/gi'
import { IoIosChatbubbles } from 'react-icons/io';
import { MdEdit, MdSpaceDashboard } from 'react-icons/md'
import { TbListDetails } from 'react-icons/tb'



function CompetitionLeftBar() {
  const { competitionId } = useParams();
  const { user } = useAuthContext();
  const { document } = useRealDocument('competitions', competitionId as string);
 
  const isMemberCheck = useMemo(() => {
    return user && document && document.members.find((item) => item.id === user.uid)
  }, [user, document]);
 
  return (
    <div className={`h-screen max-w-72 w-full ${isMemberCheck ? 'flex' : 'hidden'} flex-col  gap-6 bg-dark-gray p-4 border-r border-primary-color text-white`}>
      <div className="flex flex-col gap-4">
        <Link className='flex items-center gap-2' href={`/competition/${competitionId}/dashboard`}>
        <MdSpaceDashboard size={24} /> 
        <p>Dashboard</p>
          </Link>
          <Link className='flex items-center gap-2' href={`/competition/${competitionId}/details`}>
        <IoIosChatbubbles size={24} /> 
          <p>Chat</p>
          </Link>
          <button className='flex items-center gap-2'>
              <FaGear size={24} /> Settings 
          </button>
        </div>
        {isMemberCheck &&
          <div className='flex flex-col gap-2'>
             <div className="flex flex-col gap-2">
          <button className='flex items-center text-red-400 gap-2'>
          <GiExitDoor size={24} /> 
          <p>Leave Competition</p>
          </button>
        </div>    
    
          <div className=" flex gap-4 items-center">
          <Image src={user.photoURL as string} alt='' width={60} height={60} className='w-8 h-8 rounded-full' />
          <p>{user?.displayName}</p>
        </div>
          </div>
        }
       
        </div>
    
  )
}

export default CompetitionLeftBar