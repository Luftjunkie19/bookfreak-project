import Image from 'next/image';
import React from 'react';

type Props = {bookCover:string, pages:number, author:string, title:string, bookCategory:string}

function Book({bookCover, pages, author, title, bookCategory}: Props) {
  return (
    <div className='max-w-52 w-full rounded-lg bg-primary-color h-60'>
        <Image src={bookCover} alt='' width={24} height={24} className='h-32 rounded-t-lg object-cover w-full'/>
        <div className="flex flex-col gap-1 text-sm py-1 px-2">
          <p className="text-lg font-bold text-white">{title.length > 20 ? `${title.slice(0, 20)}...` : title}</p>
          <p className="text-white">{author}</p>
          <p className="text-white">{pages} Pages</p>
          <p className="text-white">{bookCategory.length > 20 ? `${bookCategory.slice(0, 20)}...` : bookCategory}</p>
        </div>

    </div>
  )
}

export default Book