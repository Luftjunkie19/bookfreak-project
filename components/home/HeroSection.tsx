'use client';
import Lottie from 'lottie-react'
import React from 'react'
import lottieAnimation from '../../assets/lottieAnimations/Reading-Robot.json'

type Props = {}

function HeroSection({}: Props) {
  return (
    <div className=' mx-auto m-0 lg:max-w-4xl xl:max-w-5xl w-full flex items-center justify-between p-4'>
        <div className="flex max-w-md w-full flex-col gap-1 text-white">
            <p className="text-3xl font-semibold">Welcome To BookFreak !</p>
            <p>The place for everyone that is beloved in Books. Attend competitions and win prizes, Join Clubs and build new friendships. Find books by means of AI and explore new books genres.</p>
            <div className="grid grid-cols-2 py-1 gap-2 items-center max-w-md w-full">
            <button className='bg-primary-color p-2 rounded-lg'>Read more</button>
            <button className='bg-primary-color p-2 rounded-lg'>Browse</button>
            </div>
        </div>
        <Lottie className='lg:max-w-56 xl:max-w-64 w-full' animationData={lottieAnimation} />
    </div>
  )
}

export default HeroSection