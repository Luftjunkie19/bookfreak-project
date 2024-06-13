'use client';
import React, { Suspense } from 'react'
import BaseSwiper from './base-swiper/BaseSwiper'
import Slide from './base-swiper/Slide'
import useGetDocuments from 'hooks/useGetDocuments'
import Book from 'components/elements/Book';

type Props = {}

function BookSwiper({}: Props) {
    const {documents}=useGetDocuments('books');
  return (
    <BaseSwiper>
    {documents && documents.map((item, i )=>(
        <Suspense key={i} fallback={<p>Loading...</p>}>
        <Slide>
        <Book bookCover={item.photoURL} pages={0} author={item.author} title={item.title} bookCategory={item.category} />
    </Slide>     
        </Suspense>
       ))}
  
    </BaseSwiper>
  )
}

export default BookSwiper