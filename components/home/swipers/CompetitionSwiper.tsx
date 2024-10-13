'use client';
import React, { useCallback, useMemo } from 'react'
import BaseSwiper from './base-swiper/BaseSwiper';
import { SwiperSlide } from 'swiper/react';
import Competition from 'components/elements/Competition';
import { useQuery } from '@tanstack/react-query';


type Props = {}

function CompetitionSwiper({ }: Props) {
    const { data, error, isFetching, isLoading } = useQuery({
      queryKey: ['homeCompetitions'],
      'queryFn': () => fetch('/api/supabase/competition/getAll', {
            method: 'POST',
            headers: {
            },
           body: JSON.stringify({
             where: undefined,
             take: undefined,
             skip: undefined,
             orderBy: undefined,
             include: {members:true, rules:true},
           })
         }).then((item)=>item.json())
    })
  
     


    return (
    <>
        <p className='text-white text-2xl px-2 py-1'>Competitions, join, win and enjoy !</p>
    <BaseSwiper  additionalClasses='w-full' slidesOnSmallScreen={1.5} slidesOnLargeScreen2={2} slidesOnLargeScreen={3} slidesOnXlScreen={3} slidesOn2XlScreen={5}>
    {data && data.data && data.data.map((item, i )=>(
        <SwiperSlide key={i}>
        <Competition competitionId={item.id} competitionLogo={item.competitionLogo} competitionName={item.competitionName} membersAmount={item.members.length} comeptitionRemainingTime={new Date(item.endDate)} type={'dark'}  />
    </SwiperSlide>     
       ))}
  
    </BaseSwiper>
    </>
    )
}

export default CompetitionSwiper