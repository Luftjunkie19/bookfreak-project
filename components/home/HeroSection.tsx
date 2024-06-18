'use client';
import React from 'react';

import Lottie from 'lottie-react';

import lottieAnimation from '../../assets/lottieAnimations/Reading-Robot.json';

type Props = {}

function HeroSection({}: Props) {
  return (
    <div className=' mx-auto m-0 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-7xl w-full flex items-center justify-between p-4'>
        <div className="flex sm:max-w-md 2xl:max-w-xl w-full flex-col gap-1 text-white">
            <p className="sm:text-3xl 2xl:text-4xl font-semibold">Welcome To BookFreak !</p>
            <p className="text-lg">The place for everyone that is beloved in Books. Attend competitions and win prizes, Join Clubs and build new friendships. Find books by means of AI and explore new books genres.</p>
            <div className="grid grid-cols-2 py-1 gap-2 items-center max-w-md w-full">
            <button className='bg-primary-color p-2 rounded-lg'>Read more</button>
            <button className='bg-primary-color p-2 rounded-lg'>Browse</button>
            </div>
        </div>
        <Lottie className='lg:max-w-56 xl:max-w-64 2xl:max-w-sm w-full' animationData={lottieAnimation} />
    </div>
  )
}

export default HeroSection