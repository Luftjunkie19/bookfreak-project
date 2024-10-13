import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import image from '../../assets/Logo.png'
import Button from 'components/buttons/Button';
import { IoAlertCircle } from 'react-icons/io5';
type Props = { clubLogo: string, clubName: string, hasRequirements:boolean, membersAmount:number, clubData:any, type: 'transparent' | 'blue' | 'black' | 'dark' | 'white'}

function Club({clubData, clubLogo, clubName, hasRequirements, membersAmount, type}: Props) {
  return (
    <Link href={`/club/${clubData.id}`} className={`max-w-64 w-full ${type === 'transparent' ? 'bg-transparent text-white' : type === 'blue' ? 'bg-primary-color text-white' : type === 'dark' ? 'bg-dark-gray text-white' : type === 'black' ? 'bg-transparent text-dark-gray' : 'bg-white text-dark-gray'} rounded-lg flex flex-col gap-1`}>
      <Image width={50} height={60}  src={image} alt='' className='w-full max-h-44 h-full rounded-t-lg object-cover' />
      <div className="p-2 flex flex-col justify-between h-full gap-2">
        <div className="flex gap-2 flex-col   ">

        <p className=' font-bold text-xl'>{clubName}</p>
        <p>{membersAmount} Members</p>
        <div className="flex gap-2 items-center"><IoAlertCircle className=' text-yellow-700 text-lg'/> <p className=' text-sm font-light'>{hasRequirements ? `${clubData.requirements.length} Requirements` : 'Free to Join'}</p></div>
        </div>

        <Button type={`${type === 'transparent' ? 'blue' : type === 'blue' ? 'dark-blue' : type === 'dark' ? 'blue' : type === 'black' ? 'blue' : 'blue'}`}>{hasRequirements ? 'Request' : 'Join'}</Button>
      </div>
    </Link>
  )
}

export default Club