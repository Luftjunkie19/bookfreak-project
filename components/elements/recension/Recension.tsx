import Button from 'components/buttons/Button'
import '../../../stylings/primereact-custom/dataview.css'
import Image from 'next/image'
import { Rating } from 'primereact/rating'
import React from 'react'
import image from '../../../assets/Logo.png'
import { GoStar, GoStarFill } from 'react-icons/go'
import { BsThreeDots } from 'react-icons/bs'

type Props = { userImg: string, username: string, rate: number, isOwner: boolean, content: string, type: 'blue' | 'dark' | 'white' | 'blue-white' | 'dark-blue'}

function Recension({ rate, userImg, username, content, type, isOwner  }: Props) {
  return (
    <div className={`flex max-w-3xl w-full flex-col gap-2  rounded-lg ${type === 'blue' ? 'bg-primary-color text-white' : type === 'dark' ? ' bg-dark-gray text-white' : type === 'white' ? 'text-dark-gray bg-white' : type === 'blue-white' ? 'bg-primary-color text-white' : 'bg-dark-gray text-white'} `} >
      <div className={`${type === 'blue' ? 'bg-white text-dark-gray' : type === 'dark' ? ' bg-primary-color text-white' : type === 'white' ? 'bg-white text-primary-color' : type === 'blue-white' ? 'bg-white text-primary-color' : 'bg-primary-color text-white'}  shadow-lg w-full rounded-t-lg flex justify-between items-center  px-2 py-1`}>
               <Rating size={24} readOnly cancel={false} stars={10} value={10}  className={`${type ==='white' || type === 'blue-white'  ? 'white': '#FBBF24'}`} />
{isOwner &&   <Button type='transparent' additionalClasses='text-2xl'><BsThreeDots/></Button>}
            
          </div>

          <div className="flex flex-col gap-2 px-2 ">
              <p className='line-clamp-6'> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est distinctio expedita doloremque consectetur corrupti quasi. Voluptatem, autem alias! Voluptates dicta et minima at consectetur, esse molestiae distinctio est! Ex, delectus non. Cum recusandae et blanditiis? Reprehenderit dolores minus consequuntur quae fugit nesciunt aliquid tempore explicabo? A voluptas, nisi facere distinctio magnam corporis provident ad aperiam facilis earum ipsa voluptates, adipisci praesentium officia eveniet mollitia? Dolorem in accusantium reiciendis fugiat hic.</p>
          </div>

      <div className={`flex justify-between shadow-large ${type === 'blue' ? 'bg-white text-dark-gray' : type === 'dark' ? ' bg-primary-color text-white' : type === 'white' ? 'bg-white text-primary-color' : type === 'blue-white' ? 'bg-white text-primary-color' : 'bg-primary-color text-white'}  px-2 py-1 rounded-b-lg items-center w-full`}>
            <div className="flex gap-4 items-center">
                  <Image className=' w-12 h-12 rounded-full' src={image} alt='' width={40} height={40} />
          <p className={`${type === 'blue' ? 'text-dark-gray' : type === 'dark' ? 'text-white' : type === 'white' ? 'text-primary-color' : type === 'blue-white' ? 'text-primary-color' : 'text-white'} line-clamp-1 text-sm`}>Username </p>
        </div>
        <p className='text-xs self-end font-semibold'>1 hour ago</p>
          </div>
    </div>
  )
}

export default Recension