import { useCheckPathname } from 'hooks/useCheckPathname';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react'
import { FaInfoCircle, FaUsers } from 'react-icons/fa';
import { FaUserGear } from 'react-icons/fa6';
import { RiArrowGoBackFill } from 'react-icons/ri';
import Drawer from '../Drawer';

type Props = {isSwiped?:boolean, className?:string}

function ClubSettingsDrawer({isSwiped, className}: Props) {
    const { clubId } = useParams();
    const { includesElements } = useCheckPathname();
  return (
    <Drawer isSwiped={isSwiped} className={`${className} ${includesElements('/settings') ? 'sm:hidden lg:flex' : 'hidden'}`} >
 <div className="flex flex-col gap-4">
                <p className='flex items-center text-2xl font-bold gap-2'><FaUserGear  /> Settings</p>
                    <Link href={`/club/${clubId}/settings`} className='flex gap-2 items-center'><FaInfoCircle className='text-xl' /> General Info</Link>
                    <Link href={`/club/${clubId}/settings/participants`} className='flex gap-2 items-center'><FaUsers className='text-xl' /> Members</Link>
                </div>

                 <Link href={`/club/${clubId}/chat`} className='text-white flex items-center gap-2'><RiArrowGoBackFill className="text-xl text-primary-color" /> Back to competition</Link>


    </Drawer>
  )
}

export default ClubSettingsDrawer