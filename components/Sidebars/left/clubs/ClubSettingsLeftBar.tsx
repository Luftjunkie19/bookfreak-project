'use client';
import { IoGitPullRequestSharp } from 'react-icons/io5';
import { MdAdminPanelSettings } from 'react-icons/md';
import { FaInfoCircle, FaUsers } from 'react-icons/fa';
import { RiArrowGoBackFill } from 'react-icons/ri';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react'
import { FaUserGear } from 'react-icons/fa6';
import { useCheckPathname } from 'hooks/useCheckPathname';

type Props = {}

function ClubSettingsLeftBar({}: Props) {
    const { clubId } = useParams();
    const { includesElements } = useCheckPathname();
  return (
      <div className={`${includesElements('/settings') ? 'sm:hidden lg:flex' : 'hidden'} flex-col gap-3 p-2 justify-between text-white bg-dark-gray sm:w-fit 2xl:max-w-xs sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] w-full`}>
                <div className="flex flex-col gap-4">
                <p className='flex items-center text-2xl font-bold gap-2'><FaUserGear  /> Settings</p>
                    <Link href={`/club/${clubId}/settings`} className='flex gap-2 items-center'><FaInfoCircle className='text-xl' /> General Info</Link>
                    <Link href={`/club/${clubId}/settings/participants`} className='flex gap-2 items-center'><FaUsers className='text-xl' /> Members</Link>
                </div>

                 <Link href={`/club/${clubId}/chat`} className='text-white flex items-center gap-2'><RiArrowGoBackFill className="text-xl text-primary-color" /> Back to competition</Link>
      </div>
  )
}

export default ClubSettingsLeftBar