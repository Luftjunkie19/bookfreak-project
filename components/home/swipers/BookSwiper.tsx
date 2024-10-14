'use client';
import React, { Suspense } from 'react';

import Book from 'components/elements/Book';
import { SwiperSlide } from 'swiper/react';
import BaseSwiper from './base-swiper/BaseSwiper';
import { useQuery } from '@tanstack/react-query';


type Props = {}

function BookSwiper({}: Props) {
   const { data, error, isFetching, isLoading } = useQuery({
      queryKey: ['homeBooks'],
      'queryFn':  () => fetch('/api/supabase/book/getAll', {
            method: 'POST',
            headers: {
            },
            body: JSON.stringify({ skip: undefined, take: undefined, where: undefined, include: undefined })
      }).then((item) => item.json())
})
   
   return (<>
    <Suspense fallback={<p className='text-red-500'>Loading....</p>}>          
      <p className='text-white text-2xl px-2 py-1'>Books, that might interest you</p>
    
    <BaseSwiper slidesOnSmallScreen={1.5} slidesOnLargeScreen2={2} slidesOnLargeScreen={3} slidesOnXlScreen={3} slidesOn2XlScreen={5} additionalClasses='w-full'>
         {data && data.data && data.data.map((item, i) => (
        <SwiperSlide key={i}>
        <Book bookId={item.id} bookCover={item.bookCover} pages={item.pages} author={item.bookAuthor} title={item.title} bookCategory={item.genre} type={'transparent'} />
    </SwiperSlide>     
       ))}
  
    </BaseSwiper>
       </Suspense>
    </>
 )
}

export default BookSwiper