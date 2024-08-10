'use client';
import useGetDocuments from 'hooks/useGetDocuments';
import React, { useCallback, useMemo } from 'react'
import BaseSwiper from './base-swiper/BaseSwiper';
import { SwiperSlide } from 'swiper/react';
import Competition from 'components/elements/Competition';
import useGetCollection from 'hooks/firestore/useGetCollection';

type Props = {}

function CompetitionSwiper({ }: Props) {
    const { documents } = useGetCollection('competitions');
    
    const expiresIn = (expirationTime:number) => {
        return Math.floor((expirationTime - new Date().getTime()) / (1000 * 60 * 60 * 24)) < 0 ? <span className='text-red-400 font-semibold'><span className='text-white font-normal'>Expired</span> {Math.abs(Math.floor((expirationTime - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days ago</span> : <span className='text-red-400 font-semibold'> <span className='text-white font-normal'>Expires in</span> {Math.floor((expirationTime - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</span>; 
    };


    return (
    <>
  <p className='text-white text-2xl px-2 py-1'>Competitions, join, win and enjoy !</p>
    <BaseSwiper  additionalClasses='w-full' slidesOnSmallScreen={1.5} slidesOnLargeScreen2={2} slidesOnLargeScreen={3} slidesOnXlScreen={3} slidesOn2XlScreen={5}>
    {documents && documents.map((item, i )=>(
        <SwiperSlide key={i}>
        <Competition competitionId={item.id} competitionLogo={'https://img.freepik.com/free-vector/business-competition-concept-two-businessman-tug-snatching-trophies_1150-64060.jpg?size=626&ext=jpg&ga=GA1.1.2116175301.1718755200&semt=ais_user'} competitionName={item.competitionName} membersAmount={item.members.length} comeptitionRemainingTime={expiresIn(item.competitionExpiryDate)} type={'dark'}  />
    </SwiperSlide>     
       ))}
  
    </BaseSwiper>
    </>
    )
}

export default CompetitionSwiper