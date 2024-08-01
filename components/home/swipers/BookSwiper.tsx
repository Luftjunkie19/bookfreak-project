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
  <p className='text-white text-2xl px-2 py-1'>Books, that might interest you</p>
    <BaseSwiper slidesOnSmallScreen={2} slidesOnLargeScreen2={2} slidesOnLargeScreen={3} slidesOnXlScreen={3} slidesOn2XlScreen={5} additionalClasses='w-full'>
    {documents && documents.map((item, i )=>(
        <SwiperSlide key={i}>
        <Book bookId={item.id} bookCover={item.photoURL} pages={item.pagesNumber} author={item.author} title={item.title} bookCategory={item.category} type={'transparent'} />
    </SwiperSlide>     
       ))}
  
    </BaseSwiper>
    </>
 )
}

export default BookSwiper