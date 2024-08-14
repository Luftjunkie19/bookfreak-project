import React from 'react'
import Link from "next/link";
import { FaUserGear } from "react-icons/fa6";
import { IoGitPullRequestSharp } from 'react-icons/io5';
import { MdAdminPanelSettings } from 'react-icons/md';
import { FaInfoCircle, FaUsers } from 'react-icons/fa';
import { RiArrowGoBackFill } from 'react-icons/ri';
type Props = {}

function DashboardBar({}: Props) {
  return (
       <div className="flex flex-col gap-3 p-1 justify-between text-white bg-dark-gray max-w-xs h-screen w-full">
                <div className="flex flex-col gap-4">
                <p className='flex items-center text-2xl font-bold gap-2'><FaUserGear  /> Settings</p>
                    <Link href={'/settings'} className='flex gap-2 items-center'><FaInfoCircle className='text-xl' /> General Info</Link>
                    <Link href={'/settings/requests'} className='flex gap-2 items-center'><IoGitPullRequestSharp className='text-xl'  /> Requests</Link>
                    <Link href={'/settings/administration'} className='flex gap-2 items-center'><MdAdminPanelSettings className='text-xl'  /> Administration</Link>
                    <Link href={'/settings/participants'} className='flex gap-2 items-center'><FaUsers className='text-xl' /> Participants</Link>
                </div>

                 <Link href={'/chat'} className='text-white flex items-center mb-16 ml-1 gap-2'><RiArrowGoBackFill className="text-xl text-primary-color" /> Back to competition</Link>
          </div>
  )
}

export default DashboardBar