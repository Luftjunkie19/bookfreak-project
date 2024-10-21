import Button from 'components/buttons/Button'
import Image, { StaticImageData } from 'next/image'
import React from 'react'
import { FaUserFriends } from 'react-icons/fa'
import { FaCheck } from 'react-icons/fa6'
import { MdCancel } from 'react-icons/md'

type Props = {
    image:string | StaticImageData,
    nickname:string,
    senderId:string,
}


function FriendshipNotification({image, nickname, senderId}: Props) {
  return (
    <div className=" transition-all duration-500 hover:bg-secondary-color cursor-pointer flex gap-3 items-center justify-between text-white w-full p-1 rounded-lg">
    <Image src={image} alt='' width={50} height={50} className='w-12 h-12 object-cover rounded-full'/>
    <div className="flex flex-col self-start flex-1 gap-1">
      <p className='line-clamp-1 text-sm flex w-full justify-between items-center'>{nickname} <span className='text-xs bg-primary-color/40 text-opacity-50 py-1 px-2  rounded-full flex gap-1 items-center'>Request <FaUserFriends /></span></p>    
  <div className="flex justify-between w-full">
  <div className="flex items-center gap-2">
      <Button type='black' additionalClasses='text-sm hover:bg-green-400 transition-all duration-500 p-0 bg-primary-color'>Confirm</Button>
        <Button type='black' additionalClasses='text-sm hover:bg-red-400 transition-all duration-500 bg-secondary-color p-0'>Reject</Button>
      </div>
      <p className="text-xs self-end">19:10</p>
  </div>
    </div>
  </div>
  )
}

export default FriendshipNotification