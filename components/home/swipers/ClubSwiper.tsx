'use client';
import React, { Suspense } from 'react';

import Book from 'components/elements/Book';
import { SwiperSlide } from 'swiper/react';

import BaseSwiper from './base-swiper/BaseSwiper';
import Club from 'components/elements/Club';
import { useQuery } from '@tanstack/react-query';

type Props = {}

function BookSwiper({ }: Props) {
   
   const { data, error, isFetching, isLoading } = useQuery({
      queryKey: ['homeClubs'],
      'queryFn':  () => fetch('/api/supabase/club/getAll', {
            method: 'POST',
            headers: {
            },
            body: JSON.stringify({ skip: undefined, take: undefined, where: undefined, include:{members:true, requirements:true} })
      }).then((item) => item.json())  
})
   

  return (<>
    <Suspense fallback={<p>Loading...</p>}>         
     <p className='text-white text-2xl px-2 py-1'>Clubs, that are waiting for you</p>
    <BaseSwiper additionalClasses='w-full' slidesOnSmallScreen={1.5} slidesOnLargeScreen2={2} slidesOnLargeScreen={3} slidesOnXlScreen={3} slidesOn2XlScreen={5}>
        {data && data.data && data.data.map((item, i) => (
           <SwiperSlide key={i}>
        <Club  clubLogo={item.clubLogo} clubName={'CLUBNAME !'} membersAmount={item.members.length} clubData={item} hasRequirements={item.requirements.length > 0} type={'white'}  />
    </SwiperSlide>     
       ))}
  
    </BaseSwiper>
       </Suspense>
    </>
 )
}

export default BookSwiper