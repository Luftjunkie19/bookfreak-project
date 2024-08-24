"use client";
import { Progress } from '@nextui-org/react'
import Button from 'components/buttons/Button'
import { PagesPerDayChart } from 'components/charts/competition/CompetitionCharts'
import Book from 'components/elements/Book'
import React from 'react'
import { FaPlusCircle } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa6'

type Props = {}

function Page({}: Props) {
  return (
    <div className='p-1 w-full flex flex-col gap-4'>
      <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 text-white">   
        <p className='text-3xl font-semibold'>Currently Reading Book</p>
        <p>If some thing has changed in your reading progress, you can update it now from dashboard perspective</p>
        </div>
        <div className="flex items-center gap-6">
        <div className="flex items-center max-w-3xl w-full gap-12">

          <Book additionalClasses='max-w-52 w-full' bookCover={''} pages={45} author={'Book Author'} bookId={'BookID'} title={'Book Title'} bookCategory={'Book Category'} type={'white'} />
      
          <div className="flex max-w-xl w-full flex-col gap-2">
            <p className='text-2xl font-semibold text-white'>Book Title</p>
            <p className='text-white'>90/115 Read Pages</p>
            <Progress
              aria-label='loading...'
              className="max-w-60 w-full"
      size='lg'
      value={80}
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
      </div>
      
      <div className="flex flex-col gap-2">
<div className="">
          <p className='text-white text-2xl'>Reading Statistics</p>
          <p className='text-gray-400 text-sm'>You can see a specific data about your progress here.</p>
        </div>

        <div className="flex items-center gap-6">
   <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
          </div>

             <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
          </div>

             <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       <PagesPerDayChart className='w-full h-full'/>
          </div>

        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="">
          <p className='text-white text-2xl'>Reading Notes</p>
          <p className='text-gray-400 text-sm'>You read something interesting and you want to note it ? Do it here and avoid fear of loosing the notes !</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="max-w-64 w-full flex flex-col justify-center items-center gap-4 h-96 p-2 rounded-lg bg-dark-gray border-primary-color border-2">
            
            <FaPlusCircle className='text-6xl text-primary-color'/>
            
            <div className="text-white flex flex-col gap-1 items-center justify-center">
            <p className='text-lg'>Add new Note</p>
            <p className='text-sm text-gray-400'>Remember it forever and search never more in notebooks !</p>
            </div>
          </div>
        </div>

      </div>
       


    </div>
  )
}

export default Page