import '../../../stylings/primereact-custom/dataview.css'
import Image from 'next/image'
import { Rating } from 'primereact/rating'
import React from 'react'
import { GoStar, GoStarFill } from 'react-icons/go'

type Props = {userImg:string, username:string, rate:number, content:string}

function Recension({rate, userImg, username, content}: Props) {
  return (
      <div className=' bg-white p-4 rounded-xl flex flex-col gap-2 max-w-3xl w-full border-2 border-primary-color text-secondary-color'>
          <Rating offIcon={<GoStar className='text-primary-color text-lg'/>} onIcon={<GoStarFill className='text-primary-color text-lg' />} stars={10} readOnly cancel={false} value={rate} />

          <p className="line-clamp-6">{content}</p>

          <div className="flex gap-2 items-center">
              <Image src={userImg} width={50} height={50} alt='' className='rounded-full h-8 w-8' />
              <p>{username}</p>
          </div>
    </div>
  )
}

export default Recension