import Image, { StaticImageData } from 'next/image'
import React from 'react'

type Props = {
    image: StaticImageData | string,
    username:string
}

function BarFriendOverview({username, image}: Props) {
  return (
    <div className="flex group gap-3 items-center hover:bg-white/80 transition-all duration-500  cursor-pointer px-2 py-1 rounded-lg w-full">
                  <Image className=' w-8 h-8 rounded-full' src={image} alt='' width={40} height={40} />
                  <p className='text-white transition-all group-hover:text-dark-gray line-clamp-1 text-sm  '>{username} </p>
              </div>
  )
}

export default BarFriendOverview