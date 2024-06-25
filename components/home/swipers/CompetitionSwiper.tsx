'use client';
import useGetDocuments from 'hooks/useGetDocuments';
import React, { useCallback, useMemo } from 'react'
import BaseSwiper from './base-swiper/BaseSwiper';
import { SwiperSlide } from 'swiper/react';
import Competition from 'components/elements/Competition';

type Props = {}

function CompetitionSwiper({ }: Props) {
    const { documents } = useGetDocuments('competitions');
    
    const expiresIn = (expirationTime:number) => {
        return Math.floor((expirationTime - new Date().getTime()) / (1000 * 60 * 60 * 24)) < 0 ? `Expired ${Math.abs(Math.floor((expirationTime - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days ago` : `Expires in ${Math.floor((expirationTime - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
    };


    return (
    <>
  <p className='text-white text-2xl px-2 py-1'>Competitions, join, win and enjoy !</p>
    <BaseSwiper slidesOn2XlScreen={7}>
    {documents && documents.map((item, i )=>(
        <SwiperSlide key={i}>
        <Competition competitionId={item.id} competitionLogo={'https://img.freepik.com/free-vector/business-competition-concept-two-businessman-tug-snatching-trophies_1150-64060.jpg?size=626&ext=jpg&ga=GA1.1.2116175301.1718755200&semt=ais_user'} competitionName={item.competitionTitle} membersAmount={0} comeptitionRemainingTime={`${expiresIn(item.expiresAt)}`}  />
    </SwiperSlide>     
       ))}
  
    </BaseSwiper>
    </>
    )
}

export default CompetitionSwiper