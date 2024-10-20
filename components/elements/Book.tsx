import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import image from '../../assets/Logo.png'
import { FaStar } from 'react-icons/fa6';
type Props = {
  bookCover: string, additionalClasses?:string, recensions:number, pages: number, author: string, bookId: string, title: string, bookCategory: string, type: 'transparent' | 'blue' | 'black' | 'dark' | 'white'
 }

function Book({ bookCover, additionalClasses, recensions, pages, author, title, bookCategory, bookId, type }: Props) {
  return (
    <Link href={`/book/${bookId}`} className={`max-w-56 rounded-lg flex flex-col gap-1 w-full border-dark-gray border ${type === 'transparent' ? 'bg-transparent text-white' : type === 'blue' ? 'bg-primary-color text-white' : type === 'dark' ? 'bg-dark-gray text-white' : type === 'black' ? 'bg-transparent text-dark-gray' : 'bg-white text-dark-gray'} ${additionalClasses}`}>
      <Image width={60} height={60} src={bookCover} alt='' className='w-full h-44  rounded-t-lg object-cover' />

        <div className="flex flex-col gap-1 p-1">
          <p className='text-xl line-clamp-1 font-bold'>{title}</p>
          <p className='line-clamp-1'>{author}</p>
        <p className='line-clamp-1 text-sm font-light'>{bookCategory}</p>
        <div className="flex text-lg gap-2 items-center">
          <FaStar className={`${type === 'blue' ? ' text-orange-200' : 'text-primary-color'} text-2xl`}/>
          <p>{(recensions || 0).toFixed(1)}</p>
        </div>
        </div>
   
    </Link>
  )
}

export default Book