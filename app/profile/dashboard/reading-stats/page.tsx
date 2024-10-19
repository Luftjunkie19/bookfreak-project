'use client';
import { PagesPerDayChart } from 'components/charts/competition/CompetitionCharts'
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
import React from 'react'
import { SwiperSlide } from 'swiper/react';

type Props = {}

function Page({}: Props) {
  return (
    <div className='w-full h-full'>

      <div className="flex flex-col w-full max-w-full py-2 px-1 gap-3">
        <p className='text-white text-2xl'>Reading Stats in a Month</p>
        <div className="flex items-center gap-2">
        <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
          </div>
        </div>
        <BaseSwiper additionalClasses='w-full' slidesOnSmallScreen={1}>
<SwiperSlide className='max-w-sm h-72 w-full'>
   <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
          </div>
</SwiperSlide>
<SwiperSlide className='max-w-sm h-72 w-full'>
             <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
          </div>
</SwiperSlide>

<SwiperSlide className='max-w-sm h-72 w-full'> 
             <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
          </div>
</SwiperSlide>
</BaseSwiper>
      </div>

        <div className="flex flex-col w-full gap-3 px-1 py-2">
        <p className='text-white text-2xl'>Elaborate Data from Your Reading Data (All time)</p>
        <BaseSwiper additionalClasses='w-full max-w-full' slidesOn2XlScreen={4} slidesOnLargeScreen2={2} slidesOnLargeScreen={2} slidesOnXlScreen={3} slidesOnSmallScreen={1}>
<SwiperSlide className='max-w-sm h-72 w-full'>
   <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
          </div>
</SwiperSlide>
<SwiperSlide className='max-w-sm h-72 w-full'>
             <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
          </div>
</SwiperSlide>

<SwiperSlide className='max-w-sm h-72 w-full'>
             <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
          </div>
</SwiperSlide>
</BaseSwiper>
      </div>

       <div className="flex flex-col gap-3 px-1 py-2 w-full">
        <p className='text-white text-2xl'>Your Preferences based on Your Reading Data (All time)</p>
        <BaseSwiper additionalClasses='w-full' slidesOn2XlScreen={4} slidesOnLargeScreen2={2} slidesOnLargeScreen={2} slidesOnXlScreen={3} slidesOnSmallScreen={1}>
<SwiperSlide className='max-w-sm h-72 w-full'>
   <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
          </div>
</SwiperSlide>
<SwiperSlide className='max-w-sm h-72 w-full'>
             <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
          </div>
</SwiperSlide>

<SwiperSlide className='max-w-sm h-72 w-full'>
             <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
          </div>
</SwiperSlide>
</BaseSwiper>
      </div>


    </div>
  )
}

export default Page