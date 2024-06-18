'use client';
import React from 'react';

import Book from 'components/elements/Book';
import useGetDocuments from 'hooks/useGetDocuments';
import { SwiperSlide } from 'swiper/react';

import BaseSwiper from './base-swiper/BaseSwiper';

type Props = {}

function BookSwiper({}: Props) {
    const {documents}=useGetDocuments('books');
  return (<>
  <p className='text-white text-2xl m-2'>Books, that might interest you</p>
    <BaseSwiper>
    {documents && documents.map((item, i )=>(
        <SwiperSlide key={i}>
        <Book bookCover={item.photoURL} pages={item.pagesNumber} author={item.author} title={item.title} bookCategory={item.category} />
    </SwiperSlide>     
       ))}
  
    </BaseSwiper>
    </>
 )
}

export default BookSwiper