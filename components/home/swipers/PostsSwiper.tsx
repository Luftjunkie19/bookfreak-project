'use client';

import React, { Suspense } from 'react'
import BaseSwiper from './base-swiper/BaseSwiper'
import { SwiperSlide } from 'swiper/react'
import Post from 'components/elements/activity/Post'
import { useQuery } from '@tanstack/react-query'
import { useAuthContext } from 'hooks/useAuthContext'

type Props = {}

function PostsSwiper({ }: Props) {
    const { user } = useAuthContext();
    const { data, error, isFetching, isLoading } = useQuery({
      queryKey: ['homePosts'],
      'queryFn': () => fetch('/api/supabase/post/getAll', {
            method: 'POST',
            headers: {
            },
           body: JSON.stringify({
             where: undefined,
             take: undefined,
             skip: undefined,
             orderBy: undefined,
             include: {comments:true, owner:true, lovers:true},
           })
         }).then((item)=>item.json())
    })
  

  return (
          <Suspense fallback={<p>Loading...</p>}>
        <p className='text-white text-2xl px-2 py-1'>The most popular posts of recent time !</p>
    <BaseSwiper  additionalClasses='w-full' slidesOnSmallScreen={1.5} slidesOnLargeScreen2={2} slidesOnLargeScreen={3} slidesOnXlScreen={3} slidesOn2XlScreen={5}>
    {data && data.data && data.data.map((item, i )=>(
        <SwiperSlide className='2xl:max-w-2xl xl:max-w-md xs:max-w-sm w-full' key={i}>
       <Post addClasses='w-full'  type={'white'} userImg={item.owner.photoURL} username={item.owner.nickname} isOwner={item.owner.id === user?.id} timePassed={''} content={item.body} postData={item} />
    </SwiperSlide>     
       ))}
  
    </BaseSwiper>
        </Suspense>
  )
}

export default PostsSwiper