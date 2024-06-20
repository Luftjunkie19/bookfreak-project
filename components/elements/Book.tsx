import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = { bookCover: string, pages: number, author: string, bookId:string,  title: string, bookCategory: string }

function Book({ bookCover, pages, author, title, bookCategory, bookId }: Props) {
  return (
    <Link href={`/book/${bookId}`}>
    <div className='max-w-52 w-full rounded-lg border-2 border-white bg-primary-color h-60'>
      <Image src={bookCover} alt='' width={24} height={24} className='h-32 rounded-t-lg object-cover w-full' />
      <div className="flex flex-col gap-1 text-sm py-1 px-2">
        <p className="text-lg font-bold text-white line-clamp-1">{title}</p>
        <p className="text-white">{author}</p>
        <p className="text-white">{pages} Pages</p>
        <p className="text-white line-clamp-1">{bookCategory}</p>
      </div>

    </div>
    </Link>
  )
}

export default Book