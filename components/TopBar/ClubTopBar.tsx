import Button from 'components/buttons/Button'
import Image from 'next/image'
import React from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { FaCamera } from 'react-icons/fa6'
import logoImg from '../../assets/Logo.png'
import { IoVideocam } from 'react-icons/io5'

type Props = {}

function ClubTopBar({}: Props) {
  return (
    <div className=' bg-dark-gray/70 w-full py-2 px-3 flex items-center'>
<div className="flex-1 flex items-center gap-2">
    <Image src={logoImg} alt='' height={50} className='w-8 h-8 rounded-full' width={50}/>
    <div className="flex flex-col text-white">
        <p className='text-sm'>Club Name</p>
        <p className='text-xs font-light'>5 Members</p>
    </div>
</div>
        <div className="flex items-center gap-3">
            <Button additionalClasses='text-white' type='transparent'>
                <IoVideocam/>
            </Button>
            <Button additionalClasses='text-white' type='transparent'>
                <BsThreeDots />
            </Button>
        </div>
    </div>
  )
}

export default ClubTopBar