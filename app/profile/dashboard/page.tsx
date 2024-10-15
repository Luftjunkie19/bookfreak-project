'use client';

import { useAuthContext } from 'hooks/useAuthContext';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import classes from '../../../stylings/gradient.module.css'
import { FaBook } from 'react-icons/fa6';
import { MdReviews } from 'react-icons/md';
import { FaBookOpen, FaTrophy } from 'react-icons/fa';
import Book from 'components/elements/Book';
import { Progress } from '@nextui-org/react';
import Button from 'components/buttons/Button';
import { Area, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AreaChart } from 'lucide-react';
import { PagesPerDayChart } from 'components/charts/competition/CompetitionCharts';
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
import { SwiperSlide } from 'swiper/react';
import { useQuery } from '@tanstack/react-query';

type Props = {}

function Page({ }: Props) {
  const { user } = useAuthContext();

  const { data: document } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id:user!.id  }),
    }).then((res) => res.json())
  });

    const [value, setValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 80 ? 80 : v + 5));
    }, 200);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className='flex sm:h-[calc(100vh-3rem)] overflow-y-auto lg:h-[calc(100vh-3.5rem)] flex-col gap-3'>{document && document.data && <>
      <p className='text-white text-3xl'>Welcome, <span className={`${classes['header-gradient']} ${classes['button-blue-dark-gradient']} font-bold`}>{document.data.nickname}</span></p>
      
      <div className="flex flex-col gap-2">
        <p className='text-4xl font-semibold text-white'>Overview</p>
        <div className="max-w-5xl p-4 flex sm:flex-col xl:flex-row gap-4 justify-between items-center bg-dark-gray rounded-lg w-full">
          <div className="flex gap-4 items-center">
          <div className="w-16 h-16 flex bg-primary-color justify-center items-center rounded-full">
            <FaBook className='text-3xl text-white'/>
          </div>
           <div className="flex flex-col gap-1 text-white">
            <p>Your books read this year</p>
            <p className='text-2xl font-bold'>12</p>
          </div>
          </div>

            <div className="flex gap-4 items-center">
          <div className="w-16 h-16 flex bg-secondary-color justify-center items-center rounded-full">
            <MdReviews className='text-3xl text-primary-color'/>
          </div>
           <div className="flex flex-col gap-1 text-white">
            <p>Reviews, you have shared</p>
            <p className='text-2xl font-bold'>42</p>
          </div>
          </div>

            <div className="flex gap-4 items-center">
          <div className="w-16 h-16 flex bg-secondary-color justify-center items-center rounded-full">
            <FaTrophy className='text-3xl text-yellow-600'/>
          </div>
           <div className="flex flex-col gap-1 text-white">
            <p>Your books read this year</p>
            <p className='text-2xl text-yellow-600 font-bold'>12</p>
          </div>
          </div>

      </div>
      </div>

      <div className="px-2 flex flex-col gap-2">
        <div className="flex flex-col gap-1 text-white">   
        <p className='text-3xl font-semibold'>Currently Reading Book</p>
        <p>If some thing has changed in your reading progress, you can update it now from dashboard perspective</p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
        <div className="flex sm:flex-col lg:flex-row items-center max-w-3xl w-full gap-12">

          <Book additionalClasses='max-w-52 w-full' bookCover={''} pages={45} author={'Book Author'} bookId={'BookID'} title={'Book Title'} bookCategory={'Book Category'} type={'white'} />
      
          <div className="flex max-w-xl w-full flex-col gap-2">
            <p className='text-2xl font-semibold text-white'>Book Title</p>
            <p className='text-white'>90/115 Read Pages</p>
            <Progress
              aria-label='loading...'
              className="max-w-60 w-full"
      size='lg'
      value={value}
              classNames={{
                'indicator':'bg-primary-color'
              }}

            />
            <p className='text-white'>80% Done</p>
            <Button type={'blue'} additionalClasses='flex w-fit px-3 gap-3 items-center justify-around'><span>Read Now</span> <FaBookOpen /> </Button>
</div>
        </div>

          <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
          </div>
          
        </div>
        <div className="flex max-w-6xl w-full flex-col gap-1">
          <p className='text-white text-xl'>Your Book Reading Statistics</p>
         <div className="flex gap-3 max-w-6xl overflow-x-auto items-center">
             <div className="max-w-xs h-64 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
            </div>
         
               <div className="max-w-xs h-64 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
            </div>
         
          <div className="max-w-xs h-64 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
          </div>

         </div>
        
     
          
         </div>
      </div>


    </>}</div>
  )
}

export default Page