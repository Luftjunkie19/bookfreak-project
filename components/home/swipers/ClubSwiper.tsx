'use client';
import React from 'react';

import Book from 'components/elements/Book';
import useGetDocuments from 'hooks/useGetDocuments';
import { SwiperSlide } from 'swiper/react';

import BaseSwiper from './base-swiper/BaseSwiper';
import Club from 'components/elements/Club';

type Props = {}

function BookSwiper({}: Props) {
    const {documents}=useGetDocuments('readersClubs');
  return (<>
  <p className='text-white text-2xl px-2 py-1'>Books, that might interest you</p>
    <BaseSwiper slidesOn2XlScreen={6}>
    {documents && documents.map((item, i )=>(
        <SwiperSlide key={i}>
        <Club requiredPages={item.requiredPagesRead} clubLogo={item.clubLogo} clubName={item.clubsName} membersAmount={0} clubData={item}  />
    </SwiperSlide>     
       ))}
  
    </BaseSwiper>
    </>
 )
}

export default BookSwiper