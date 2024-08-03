'use client';

import Link from 'next/link';
import React from 'react'
import { FaUserFriends } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import { GrLineChart } from 'react-icons/gr';
import { IoIosWallet } from 'react-icons/io';
import { MdSpaceDashboard } from 'react-icons/md';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { TbListDetails } from 'react-icons/tb';

type Props = {}

function ProfileDashboardLeftBar({}: Props) {
  return (
      <div className='bg-dark-gray flex justify-between flex-col p-2 sm:h-fit lg:h-screen  sm:w-full lg:max-w-fit xl:max-w-60 2xl:max-w-xs w-full'>
          <div className="flex flex-col gap-2">
                <p className='text-white text-2xl flex gap-2 items-center'>Dashboard <MdSpaceDashboard className='text-2xl' /></p>
          <div className="flex gap-3 flex-col">
              <Link className='text-white flex gap-3 items-center' href={'/'}><TbListDetails className='text-xl' /> Overview</Link>
              <Link className='text-white flex gap-3 items-center'  href={'/'}><FaUserFriends className='text-xl' /> You and Friends</Link>
              <Link className='text-white flex gap-3 items-center'  href={'/'}><IoIosWallet className='text-xl text-green-400' /> Financial Data</Link>
              <Link className='text-white flex gap-3 items-center'  href={'/'}><GrLineChart className='text-primary-color text-xl'/> Book Statistics</Link>
          </div>

          </div>
          
          <div className="">
               <Link className='text-white flex gap-3 items-center'  href={'/'}><RiArrowGoBackFill  className='text-primary-color text-xl'/> Back to Profile</Link>
          </div>
    </div>
  )
}

export default ProfileDashboardLeftBar