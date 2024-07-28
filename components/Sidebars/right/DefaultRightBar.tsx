'use client';
import Image from 'next/image'
import React from 'react'
import image from '../../../assets/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
import { FaUser, FaUsers } from 'react-icons/fa6'
import { usePathname } from 'next/navigation'
import { useAuthContext } from 'hooks/useAuthContext'

type Props = {}

function DefaultRightBar({ }: Props) {
    const location = usePathname();
    const { user } = useAuthContext();
  return (
      <div className={` ${ !user || location.includes('search') || location.includes('/competition/') || location.includes('club') || location.includes('signup') || location.includes('login') ? 'hidden': 'sm:hidden lg:flex'} h-screen max-w-xs min-w-52 w-full flex flex-col gap-2   border-l-2 border-dark-gray`}>
          <p className='text-xl p-2 text-white flex items-center gap-2'>Friends <FaUsers className='text-2xl' /></p>
          
          <div className="flex flex-col gap-4 px-2">
              <div className="flex gap-3 w-full">
                  <Image className=' w-8 h-8 rounded-full' src={image} alt='' width={40} height={40} />
                  <p className='text-white line-clamp-1 text-sm  '>Username </p>
              </div>
              <div className="flex gap-3 w-full">
                  <Image className=' w-8 h-8 rounded-full' src={image} alt='' width={40} height={40} />
                  <p className='text-white line-clamp-1 text-sm  '>Username </p>
              </div>
              <div className="flex gap-3 w-full">
                  <Image className=' w-8 h-8 rounded-full' src={image} alt='' width={40} height={40} />
                  <p className='text-white line-clamp-1 text-sm  '>Username </p>
              </div>
              <div className="flex gap-3 w-full">
                  <Image className=' w-8 h-8 rounded-full' src={image} alt='' width={40} height={40} />
                  <p className='text-white line-clamp-1 text-sm  '>Username </p>
              </div>
          </div>
    </div>
  )
}

export default DefaultRightBar