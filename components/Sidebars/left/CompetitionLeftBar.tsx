'use client';
import { useRealDocument } from 'hooks/firestore/useGetRealDocument';
import { useAuthContext } from 'hooks/useAuthContext';
import Image from 'next/image';
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React, { useMemo } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaGear, FaVideo } from 'react-icons/fa6'
import { GiExitDoor } from 'react-icons/gi'
import { IoIosChatbubbles } from 'react-icons/io';
import { MdEdit, MdSpaceDashboard } from 'react-icons/md'
import { TbListDetails } from 'react-icons/tb'



function CompetitionLeftBar() {
  const { competitionId } = useParams();
  const { user } = useAuthContext();
  const { document } = useRealDocument('competitions', competitionId as string);
  const pathname = usePathname();
  const isMemberCheck = useMemo(() => {
    return user && document && document.members.find((item) => item.id === user.uid)
  }, [user, document]);
 
  return (
 <div className={`sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] 2xl:max-w-72 2xl:w-full sm:w-fit ${isMemberCheck && !pathname.includes('settings') ? 'flex' : 'hidden'} flex-col justify-between gap-6 bg-dark-gray p-4 border-r border-primary-color text-white`}>
      <div className="flex flex-col gap-4">
        <Link className='flex items-center gap-2' href={`/competition/${competitionId}`}>
        <MdSpaceDashboard size={24} /> 
        <p>Dashboard</p>
          </Link>
          <Link className='flex items-center gap-2' href={`/competition/${competitionId}/chat`}>
        <IoIosChatbubbles size={24} /> 
          <p>Chat</p>
          </Link>
          <Link className='flex items-center gap-2' href={`/competition/${competitionId}/settings`} >
              <FaGear size={24} /> Settings 
          </Link>
        </div>
        {isMemberCheck && user &&
          <div className='flex justify-between items-center gap-2'>
          <div className=" flex gap-2 items-center">
          <Image src={user.photoURL} alt='' width={60} height={60} className='w-8 h-8 rounded-full' />
          <p className='sm:hidden 2xl:block'>{user?.displayName}</p>
        </div>
           <button className='text-white text-xl'><BsThreeDotsVertical/></button>
          </div>
        }
       
        </div>

    
  )
}

export default CompetitionLeftBar