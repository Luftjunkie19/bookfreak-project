'use client';
import Image from 'next/image'
import React from 'react'
import image from '../../../assets/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
import { FaUser, FaUsers } from 'react-icons/fa6'
import { usePathname } from 'next/navigation'
import { useAuthContext } from 'hooks/useAuthContext'
import { useCheckPathname } from 'hooks/useCheckPathname';
import BarFriendOverview from '../content-elements/BarFriendOverview';

type Props = {}

function DefaultRightBar({ }: Props) {
    const { includesElements } = useCheckPathname();
    const { user } = useAuthContext();
    return (
        <div className={` ${!user || includesElements('/search') || includesElements('/post/') || includesElements('/competition/') || includesElements('/club') || includesElements('/signup') || includesElements('/login') || includesElements('form/') || includesElements('/chat') || includesElements('/test/') || includesElements('/settings') || includesElements('/profile/dashboard') ? 'hidden' : 'sm:hidden lg:flex flex-col'} sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)]  min-w-32 lg:max-w-40 2xl:max-w-64 w-full gap-3 border-l-2 border-dark-gray`}>
          <p className='text-xl p-2 text-white flex items-center gap-2'>Friends <FaUsers className='text-2xl' /></p>
          <div className="flex flex-col gap-3 px-2 overflow-y-auto">
          <BarFriendOverview image={image} username={'Nickname'} />
          <BarFriendOverview image={image} username={'Nickname'} />
          <BarFriendOverview image={image} username={'Nickname'} />
          <BarFriendOverview image={image} username={'Nickname'} />
                   <BarFriendOverview image={image} username={'Nickname'} />
          </div>
    </div>
  )
}

export default DefaultRightBar