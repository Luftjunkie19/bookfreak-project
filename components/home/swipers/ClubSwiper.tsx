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
    <BaseSwiper additionalClasses='w-full' slidesOnSmallScreen={2} slidesOnLargeScreen2={2} slidesOnLargeScreen={3} slidesOnXlScreen={3} slidesOn2XlScreen={5}>
    {documents && documents.map((item, i )=>(
        <SwiperSlide key={i}>
        <Club  clubLogo={item.clubLogo} clubName={item.clubsName} membersAmount={0} clubData={item} hasRequirements={false} type={'white'}  />
    </SwiperSlide>     
       ))}
  
    </BaseSwiper>
    </>
 )
}

export default BookSwiper