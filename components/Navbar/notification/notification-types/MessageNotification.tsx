import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    image:string | StaticImageData,
    notificationContent?:string,
    senderId:string,
    linkPath:string,
    isDirectMessage:boolean,
    messageContent?:string,
    senderNickname?:string
}

function MessageNotification({linkPath, image, senderNickname, notificationContent, isDirectMessage, senderId, messageContent}: Props) {
  return (
    <Link href={linkPath} className=" transition-all duration-500 hover:bg-secondary-color cursor-pointer flex gap-3 items-center justify-between text-white w-full p-1 rounded-lg">
    <Image src={image} alt='' width={50} height={50} className='w-12 h-12 object-cover rounded-full'/>
    <div className="flex flex-col self-start flex-1 gap-1">
        {isDirectMessage ? <>
            <span className='font-bold'>{senderNickname}</span>
<div className="flex justify-between w-full items-center">
            <p className='line-clamp-1 text-sm items-center'>{messageContent}</p>
            <p className='text-xs text-white opacity-45'>19:09</p>
</div>
        </> :  <p className='line-clamp-3 text-sm'>{notificationContent && notificationContent}</p>}
       
    </div>
  </Link>
  )
}

export default MessageNotification