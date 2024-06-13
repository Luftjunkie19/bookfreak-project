import Image from 'next/image';
import React from 'react';

type Props = {bookCover:string, pages:number, author:string, title:string, bookCategory:string}

function Book({bookCover, pages, author, title, bookCategory}: Props) {
  return (
    <div className='max-w-52 rounded-lg bg-primary-color'>
        <Image src={bookCover} alt='' width={24} height={24} className='max-h-16 h-full object-cover w-full'/>
        <div className="flex flex-col gap-1">
          <p>{title}</p>
          <p>{author}</p>
          <p>{pages} Pages</p>
          <p>{bookCategory}</p>
        </div>

    </div>
  )
}

export default Book