'use client';

import { useAuthContext } from 'hooks/useAuthContext';
import useRealtimeDocument from 'hooks/useRealtimeDocument';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import classes from '../../../stylings/gradient.module.css'
import { FaBook } from 'react-icons/fa6';
import { MdReviews } from 'react-icons/md';
import { FaBookOpen, FaTrophy } from 'react-icons/fa';
import Book from 'components/elements/Book';
import { Progress } from '@nextui-org/react';
import Button from 'components/buttons/Button';

type Props = {}

function Page({ }: Props) {
    const [userObj, setUserObj] = useState<null | any>(null);
  const { user } = useAuthContext();

  const { getDocument } = useRealtimeDocument();

    const [value, setValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 80 ? 80 : v + 10));
    }, 150);

    return () => clearInterval(interval);
  }, []);



  const currentUserObject = useCallback(async () => {
    if (!user) return null;
    const userRef = await getDocument('users', user.uid);
    setUserObj(userRef);
    console.log('hello');
  }, [user]);

  useEffect(() => {
    currentUserObject();
  },[currentUserObject])



  return (
    <div className='flex flex-col gap-3'>{userObj && <>
      <p className='text-white text-3xl'>Welcome, <span className={`${classes['header-gradient']} ${classes['button-blue-dark-gradient']} font-bold`}>{userObj.nickname}</span></p>
      
      <div className="flex flex-col gap-2">
        <p className='text-4xl font-semibold text-white'>Overview</p>
        <div className="max-w-5xl p-4 flex justify-between items-center bg-dark-gray rounded-lg w-full">
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
        <div className="flex items-center">
        <div className="flex items-center gap-12">

          <Book bookCover={''} pages={45} author={'Book Author'} bookId={'BookID'} title={'Book Title'} bookCategory={'Book Category'} type={'white'} />
      
          <div className="flex flex-col gap-2">
            <p className='text-2xl font-semibold text-white'>Book Title</p>
            <p className='text-white'>90/115 Read Pages</p>
            <Progress
              aria-label='loading...'
              className="max-w-md w-full"
      size='lg'
      value={value}
              classNames={{
                'value': 'max-w-md w-full',
                labelWrapper:'max-w-md w-full',
                'indicator':'bg-primary-color'
              }}

            />
            <p className='text-white'>80% Done</p>
            <Button type={'blue'} additionalClasses='flex  items-center justify-around'><span>Read Now</span> <FaBookOpen /> </Button>
</div>
        </div>

          <div className="max-w-lg w-full bg-dark-gray rounded-lg">
            <ResponsiveContainer width={700} height="80%">
    <AreaChart data={data}
      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <ReferenceLine x="Page C" stroke="green" label="Min PAGE" />
      <ReferenceLine y={4000} label="Max" stroke="red" strokeDasharray="3 3" />
      <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
  </ResponsiveContainer>
          </div>
        </div>
      </div>


    </>}</div>
  )
}

export default Page