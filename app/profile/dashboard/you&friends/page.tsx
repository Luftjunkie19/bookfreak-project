'use client';
import Image from 'next/image'
import React from 'react'
import image from '../../../../assets/Logo.png';
import { SwiperSlide } from 'swiper/react';
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
import Button from 'components/buttons/Button';
import { FaBan, FaUnlock } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from 'hooks/useAuthContext';
import { formatDistanceToNow } from 'date-fns';
type Props = {}

function Page({}: Props) {
const {user}=useAuthContext();

  const { data: document } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id:user!.id, include:{
        'recensions':{'include':{'book':true}},
        'booksInRead':{orderBy:{'readingDate':'desc'}}, 
        'notifications':true,
        friendsStarted:true,
        friends:true,
        blockedUsers:{
          where:{
            blockedBy:user.id
          },
          include:{
            blockedUser:true,
          }
        }
       }}),
    }).then((res) => res.json())
  });


  return (
    <div className='sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] w-full overflow-y-auto'>
      
      <div className="flex flex-col gap-2">
        <p className='text-white text-xl'>Comparison of your and your friends results</p>
      <div className="max-w-6xl w-full">   
      <BaseSwiper spaceBetween={8} additionalClasses='w-full' slidesOn2XlScreen={3} slidesOnLargeScreen2={3} slidesOnXlScreen={2} slidesOnLargeScreen={2} slidesOnSmallScreen={1}>
      
      <SwiperSlide>
        <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>All-time Ranking</p>
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
              {document && (document.data.friends.length > 0 || document.data.friendsStarted.length > 0) ? [...document.data.friends, ...document.data.friendsStarted].map((item)=>(
  <div key={item.id} className="p-2 flex gap-2 items-center">
  <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
  <div className="flex flex-col flex-1 gap-1">
    <p>Username</p>
    <p className='text-sm font-light'>12 Books</p>
  </div>
  <div className="p-2 align-middle table-cell text-sm text-center rounded-full text-white bg-gray-500">#2</div>
</div>
              )) : <>
              <p>No data about your friends is available.</p>
              </>}
            </div>
      </div>
      </SwiperSlide>
       
        <SwiperSlide>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>Annually Ranking</p>
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
            {document && (document.data.friends.length > 0 || document.data.friendsStarted.length > 0) ? [...document.data.friends, ...document.data.friendsStarted].map((item)=>(
  <div key={item.id} className="p-2 flex gap-2 items-center">
  <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
  <div className="flex flex-col flex-1 gap-1">
    <p>Username</p>
    <p className='text-sm font-light'>12 Books</p>
  </div>
  <div className="p-2 align-middle table-cell text-sm text-center rounded-full text-white bg-gray-500">#2</div>
</div>
              )) : <>
              <p>No data about your friends is available.</p>
              </>}
            </div>
          </div>
      </SwiperSlide>
       
        <SwiperSlide>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>Monthly Ranking</p>
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
            {document && document.data && (document.data.friends.length > 0 || document.data.friendsStarted.length > 0) ? [...document.data.friends, ...document.data.friendsStarted].map((item)=>(
  <div key={item.id} className="p-2 flex gap-2 items-center">
  <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
  <div className="flex flex-col flex-1 gap-1">
    <p>Username</p>
    <p className='text-sm font-light'>12 Books</p>
  </div>
  <div className="p-2 align-middle table-cell text-sm text-center rounded-full text-white bg-gray-500">#2</div>
</div>
              )) : <>
              <p>No data about your friends is available.</p>
              </>}
            </div>
          </div>
        </SwiperSlide>
       
        <SwiperSlide>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>Weekly Ranking</p>
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
            {document && (document.data.friends.length > 0 || document.data.friendsStarted.length > 0) ? [...document.data.friends, ...document.data.friendsStarted].map((item)=>(
  <div key={item.id} className="p-2 flex gap-2 items-center">
  <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
  <div className="flex flex-col flex-1 gap-1">
    <p>Username</p>
    <p className='text-sm font-light'>12 Books</p>
  </div>
  <div className="p-2 align-middle table-cell text-sm text-center rounded-full text-white bg-gray-500">#2</div>
</div>
              )) : <>
              <p>No data about your friends is available.</p>
              </>}
            </div>
          </div>
        </SwiperSlide>
     
      </BaseSwiper>
    </div>
      </div>

      <div className="flex sm:flex-col 2xl:flex-row gap-8 2xl:items-center">
      <div className="flex flex-col max-w-sm w-full gap-2">
        <p className="text-white text-xl">Your friends</p>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
            {document && (document.data.friends.length > 0 || document.data.friendsStarted.length > 0) ? [...document.data.friends, ...document.data.friendsStarted].map((item)=>(
  <div key={item.id} className="p-2 flex gap-2 items-center">
  <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
  <div className="flex flex-col flex-1 gap-1">
    <p>Username</p>
    <p className='text-sm font-light'>12 Books</p>
  </div>
  <div className="p-2 align-middle table-cell text-sm text-center rounded-full text-white bg-gray-500">#2</div>
</div>
              )) : <>
              <p>No data about your friends is available.</p>
              </>}
            </div>
      </div>
        </div>
             <div className="flex flex-col gap-2 max-w-xl w-full">
        <p className="text-white text-xl">Requests, that have been sent to you</p>
          <div className="bg-dark-gray max-w-xl w-full p-2 rounded-lg text-white">
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
            {document && (document.data.friends.length > 0 || document.data.friendsStarted.length > 0) ? [...document.data.friends, ...document.data.friendsStarted].map((item)=>(
  <div key={item.id} className="p-2 flex gap-2 items-center">
  <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
  <div className="flex flex-col flex-1 gap-1">
    <p>Username</p>
    <p className='text-sm font-light'>12 Books</p>
  </div>
  <div className="flex gap-2 items-center">
    <Button additionalClasses='bg-green-400' type='black'>Accept</Button>
     <Button additionalClasses='bg-red-400' type='black'>Decline</Button>
  </div>
</div>

              )) : <>
              <p>No data about your friends is available.</p>
              </>}
              
      
             
             
            </div>
      </div>
      </div>
      </div>
      
      <div className="flex flex-col gap-2 my-4">
        <p className='text-white text-xl'>People you have blocked or suspended</p>
           <div className="bg-dark-gray max-w-xl w-full p-2 rounded-lg text-white">
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
              {document && document.data.blockedUsers.length > 0 ?
               document.data.blockedUsers.map((blockedUser)=>(<div key={blockedUser.id} className="p-2 flex gap-2 items-center">
                <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>{blockedUser.blockedUser.nickname}</p>
                  <p className='text-sm font-light'>{formatDistanceToNow(new Date(blockedUser.dateOfBlock))}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Button  type='transparent'><FaBan className="text-xl text-red-400" /></Button>
                   <Button type='transparent'><FaUnlock className="text-primary-color text-lg" /></Button>
                </div>
              </div>)) : <>
              
              <p>For now you have not blocked anyone</p>
              
              </>
              }
            
             
            </div>
      </div>
      </div>
    </div>
  )
}

export default Page