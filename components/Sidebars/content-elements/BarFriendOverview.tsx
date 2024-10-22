import Image, { StaticImageData } from 'next/image'
import React from 'react'

type Props = {
    image: StaticImageData | string,
    username:string
}

function BarFriendOverview({username, image}: Props) {
  return (
    <div className="flex gap-3 cursor-pointer w-full">
                  <Image className=' w-8 h-8 rounded-full' src={image} alt='' width={40} height={40} />
                  <p className='text-white line-clamp-1 text-sm  '>{username} </p>
              </div>
  )
}

export default BarFriendOverview