'use client';
import Image from 'next/image'
import React from 'react'
import image from '../../../../assets/Logo.png'
import { useRealDocument } from 'hooks/firestore/useGetRealDocument';
import Button from 'components/buttons/Button';
import { FaClockRotateLeft } from 'react-icons/fa6';
import { IoChatbubbles } from 'react-icons/io5';
import { FaBookOpen, FaUserFriends } from 'react-icons/fa';
import { GiCrane } from 'react-icons/gi';
import Slide from 'components/home/swipers/base-swiper/Slide';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useParams } from 'next/navigation';
import classes from '../../../../stylings/gradient.module.css'
import { PagesPerDayChart } from 'components/charts/competition/CompetitionCharts';
import CompetitionSwiper from 'components/home/swipers/CompetitionSwiper';
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
type Props = {}

function Page({ params }: { params: { competitionId: string } }) {
  const {competitionId} = params;
  const {document}=useRealDocument('competitions', competitionId);
return (
     <div
      className={`min-h-screen h-full overflow-y-auto  overflow-x-hidden w-full`}
    >
       <div className={`relative w-full ${classes['light-blue-gradient']} top-0 left-0 h-64 `}>
          {document && 
        <div className="absolute z-10 -bottom-16 flex gap-6 items-center  left-0 m-3">
            <Image src={image} alt='' width={60} height={60} className='w-44 z-10 h-44 object-cover rounded-lg' />
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-bold text-white">{document.competitionName}</p>
              <p>{document.members.length} Members</p>
              <div className="flex">
                <Image src={image} alt='' width={60} height={60} className='w-6 h-6 object-cover rounded-full' />
                <Image src={image} alt='' width={60} height={60} className='w-6 h-6 object-cover rounded-full' />
                <Image src={image} alt='' width={60} height={60} className='w-6 h-6 object-cover rounded-full' />
              </div>
            </div>
          
        </div>
          }
      </div>

      <div className="flex justify-end items-center gap-2 p-2">
        <Button additionalClasses='px-6 py-[0.375rem]' type={'blue'} >
Share
        </Button>
           <Button additionalClasses='px-6 py-[0.375rem]' type={'white-blue'} >
Request To Join
        </Button>
</div>

      <div className="flex overflow-x-hidden overflow-y-hidden  gap-4 w-full">
        
        <div className="flex flex-col my-4 mx-2 gap-3 max-w-sm w-full">
          <div className="w-full h-72  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
            <p className='flex gap-4 items-center text-lg font-bold text-white'><FaClockRotateLeft /> Activity</p>
            <div className="flex items-center gap-6">
              <IoChatbubbles className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>10 New Messages Today</p>
                <p className='text-sm font-extralight'>In last Month 1.2k Messages</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <FaUserFriends className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>19 Members Together</p>
                <p className='text-sm font-extralight'>Yesterday 0 new members</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <GiCrane  className="text-primary-color text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>Estimated 3 years ago</p>
                <p className='text-xs font-extralight'>Est. 19th of March 2021</p>
              </div>
            </div>
          </div>
              <div className="w-full h-72  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
            <p className='flex gap-4 items-center text-lg font-bold text-white'><FaClockRotateLeft /> Activity</p>
            <div className="flex items-center gap-6">
              <IoChatbubbles className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>10 New Messages Today</p>
                <p className='text-sm font-extralight'>In last Month 1.2k Messages</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <FaUserFriends className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>19 Members Together</p>
                <p className='text-sm font-extralight'>Yesterday 0 new members</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <GiCrane  className="text-primary-color text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>Estimated 3 years ago</p>
                <p className='text-xs font-extralight'>Est. 19th of March 2021</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-1 overflow-y-auto max-h-[56rem] h-full overflow-x-hidden max-w-4xl w-full">
          <div className="flex flex-col gap-1">
            <p className='text-white text-xl'>The Prize</p>
          <div className="flex gap-3 p-1 w-full items-center">
               <div className="w-full max-w-xs h-72 bg-dark-gray items-center p-2 flex flex-col justify-around border-green-400 border shadow-green-400 shadow gap-2 rounded-lg">
              <p className=' text-5xl font-bold text-green-400'>100.00$</p>
              <div className="flex flex-col gap-1 items-center">
              <p className='text-white text-lg self-center'>Prize only for the ranking-leader</p> 
<p className='text-yellow-700 text-3xl self-center font-bold'>#1</p>               
              </div>
          </div>

               <div className="w-full max-w-xs h-72 bg-dark-gray justify-around items-center  p-2 flex flex-col gap-4 rounded-lg">
              <div className="flex flex-col justify-around items-center">
                <Image src={image} width={60} height={60} className='w-12 h-12 rounded-full' alt=''/>
              <p className='text-white self-center'>Winner</p>
              <p className='text-white'>1. Username - 100 points</p>
              </div>
              <div className="flex flex-col gap-2 items-center">
              <p className='text-green-400 text-3xl font-bold'>15.00$</p>
              <Button type={'black'} additionalClasses='bg-green-400'>Claim Reward</Button>
              </div>
          </div>
           </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <BaseSwiper spaceBetween={2} additionalClasses='w-full' slidesOn2XlScreen={2} slidesOnLargeScreen2={1} slidesOnXlScreen={1} slidesOnLargeScreen={1} slidesOnSmallScreen={1}>
            <SwiperSlide>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>Overall Ranking</p>
            <div className="overflow-y-auto max-h-60 h-full flex flex-col">
              <div className="p-2 flex gap-2 items-center">
                <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>Username</p>
                  <p className='text-sm font-light'>12 Books</p>
                </div>
                <div className="p-2 align-middle text-center text-sm table-cell rounded-full text-white bg-orange-300">#1</div>
              </div>
               <div className="p-2 flex gap-2 items-center">
                <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>Username</p>
                  <p className='text-sm font-light'>12 Books</p>
                </div>
                <div className="p-2  align-middle table-cell text-sm text-center rounded-full text-white bg-gray-500">#2</div>
              </div>
               <div className="p-2 flex gap-2 items-center">
                <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>Username</p>
                  <p className='text-sm font-light'>12 Books</p>
                </div>
                <div className="p-2 align-middle table-cell  text-center text-sm rounded-full text-white bg-brown-500">#3</div>
              </div>
               <div className="p-2 flex gap-2 items-center">
                <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>Username</p>
                  <p className='text-sm font-light'>12 Books</p>
                </div>
                <div className="p-2 align-middle table-cell text-center text-sm rounded-full text-white bg-primary-color">#4</div>
              </div>
                <div className="p-2 flex gap-2 items-center">
                <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>Username</p>
                  <p className='text-sm font-light'>12 Books</p>
                </div>
                <div className="p-2 text-center align-middle table-cell text-sm rounded-full text-white bg-primary-color">#5</div>
              </div>
            </div>
          </div>
            </SwiperSlide>
                    <SwiperSlide>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>Week's Best Readers</p>
            <div className="overflow-y-auto max-h-60 h-full flex flex-col">
              <div className="p-2 flex gap-2 items-center">
                <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>Username</p>
                  <p className='text-sm font-light'>12 Books</p>
                </div>
                <div className="p-2 align-middle text-center text-sm table-cell rounded-full text-white bg-orange-300">#1</div>
              </div>
               <div className="p-2 flex gap-2 items-center">
                <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>Username</p>
                  <p className='text-sm font-light'>12 Books</p>
                </div>
                <div className="p-2  align-middle table-cell text-sm text-center rounded-full text-white bg-gray-500">#2</div>
              </div>
               <div className="p-2 flex gap-2 items-center">
                <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>Username</p>
                  <p className='text-sm font-light'>12 Books</p>
                </div>
                <div className="p-2 align-middle table-cell  text-center text-sm rounded-full text-white bg-brown-500">#3</div>
              </div>
               <div className="p-2 flex gap-2 items-center">
                <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>Username</p>
                  <p className='text-sm font-light'>12 Books</p>
                </div>
                <div className="p-2 align-middle table-cell text-center text-sm rounded-full text-white bg-primary-color">#4</div>
              </div>
                <div className="p-2 flex gap-2 items-center">
                <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>Username</p>
                  <p className='text-sm font-light'>12 Books</p>
                </div>
                <div className="p-2 text-center align-middle table-cell text-sm rounded-full text-white bg-primary-color">#5</div>
              </div>
            </div>
          </div>
            </SwiperSlide>
            <SwiperSlide>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>Month's Best Readers</p>
            <div className="overflow-y-auto max-h-60 h-full flex flex-col">
              <div className="p-2 flex gap-2 items-center">
                <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>Username</p>
                  <p className='text-sm font-light'>12 Books</p>
                </div>
                <div className="p-2 align-middle text-center text-sm table-cell rounded-full text-white bg-orange-300">#1</div>
              </div>
               <div className="p-2 flex gap-2 items-center">
                <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>Username</p>
                  <p className='text-sm font-light'>12 Books</p>
                </div>
                <div className="p-2  align-middle table-cell text-sm text-center rounded-full text-white bg-gray-500">#2</div>
              </div>
               <div className="p-2 flex gap-2 items-center">
                <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>Username</p>
                  <p className='text-sm font-light'>12 Books</p>
                </div>
                <div className="p-2 align-middle table-cell  text-center text-sm rounded-full text-white bg-brown-500">#3</div>
              </div>
               <div className="p-2 flex gap-2 items-center">
                <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>Username</p>
                  <p className='text-sm font-light'>12 Books</p>
                </div>
                <div className="p-2 align-middle table-cell text-center text-sm rounded-full text-white bg-primary-color">#4</div>
              </div>
                <div className="p-2 flex gap-2 items-center">
                <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>Username</p>
                  <p className='text-sm font-light'>12 Books</p>
                </div>
                <div className="p-2 text-center align-middle table-cell text-sm rounded-full text-white bg-primary-color">#5</div>
              </div>
            </div>
          </div>
            </SwiperSlide>
       
            
          </BaseSwiper>

          <div className="flex flex-col">
            <p className='text-white text-lg'>Data from members' progresses</p>
             <BaseSwiper spaceBetween={2} additionalClasses='w-full' slidesOn2XlScreen={2} slidesOnLargeScreen2={1} slidesOnXlScreen={1} slidesOnLargeScreen={1} slidesOnSmallScreen={1}>
            <SwiperSlide>
               <div className='max-w-sm w-full h-64 rounded-lg bg-dark-gray p-2'>
       <PagesPerDayChart className='w-full h-full' />
          </div>
            </SwiperSlide>
               <SwiperSlide>
               <div className='max-w-sm w-full h-64 rounded-lg bg-dark-gray p-2'>
       <PagesPerDayChart className='w-full h-full' />
          </div>
            </SwiperSlide>
               <SwiperSlide>
               <div className='max-w-sm w-full h-64 rounded-lg bg-dark-gray p-2'>
       <PagesPerDayChart className='w-full h-full' />
          </div>
          </SwiperSlide>
          </BaseSwiper>
          </div>
        </div>
         
  </div>
</div>
      
     
       
 
    </div>
  )
}

export default Page