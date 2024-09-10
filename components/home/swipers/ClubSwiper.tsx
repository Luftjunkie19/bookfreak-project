'use client';
import React from 'react';

import Book from 'components/elements/Book';
import useGetDocuments from 'hooks/useGetDocuments';
import { SwiperSlide } from 'swiper/react';

import BaseSwiper from './base-swiper/BaseSwiper';
import Club from 'components/elements/Club';
import useGetCollection from 'hooks/firestore/useGetCollection';

type Props = {}

function BookSwiper({}: Props) {
  return (<>
  <p className='text-white text-2xl px-2 py-1'>Clubs, that are waiting for you</p>
    {/* <BaseSwiper additionalClasses='w-full' slidesOnSmallScreen={1.5} slidesOnLargeScreen2={2} slidesOnLargeScreen={3} slidesOnXlScreen={3} slidesOn2XlScreen={5}>
    {documents && documents.map((item, i )=>(
        <SwiperSlide key={i}>
        <Club  clubLogo={item.clubLogo} clubName={item.clubName} membersAmount={item.members.length} clubData={item} hasRequirements={item.requirements.length > 0} type={'white'}  />
    </SwiperSlide>     
       ))}
  
    </BaseSwiper> */}
    </>
 )
}

export default BookSwiper