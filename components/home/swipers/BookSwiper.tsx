'use client';
import React, { Suspense } from 'react'
import BaseSwiper from './base-swiper/BaseSwiper'
import useGetDocuments from 'hooks/useGetDocuments'
import Book from 'components/elements/Book';
import { SwiperSlide } from 'swiper/react';

type Props = {}

function BookSwiper({}: Props) {
    const {documents}=useGetDocuments('books');
  return (
    <BaseSwiper>
    {documents && documents.map((item, i )=>(
        <SwiperSlide key={i}>
        <Book bookCover={item.photoURL} pages={item.pagesNumber} author={item.author} title={item.title} bookCategory={item.category} />
    </SwiperSlide>     
       ))}
  
    </BaseSwiper>
  )
}

export default BookSwiper