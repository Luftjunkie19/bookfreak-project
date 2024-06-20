import React from 'react'
import { FaBook } from 'react-icons/fa6'
import { MdGroups } from 'react-icons/md'
import { PiExamFill, PiRankingFill } from 'react-icons/pi'

type Props = {}

function SearchTabs({}: Props) {
    return (<>
 <p className='p-2 text-white font-semibold text-2xl px-2 py-2'>Any specific to search for ? Click and search it !</p> 
  
      <div className='mx-auto m-0 p-2 grid sm:grid-cols-2 sm:max-w-2xl lg:max-w-7xl sm:justify-items-center w-full lg:grid-cols-4 sm:gap-4 lg:gap-6'>
          <button className='bg-primary-color h-44 max-w-60 w-full  items-center justify-center p-4 rounded-lg text-white flex flex-col gap-2'>
              <FaBook className='text-6xl' />
              <p>Book</p>
          </button>
          <button className=' bg-primary-color h-44 max-w-60 w-full  p-4 rounded-lg items-center justify-center text-white flex flex-col gap-2'>
                    <PiRankingFill className='text-6xl' />
              <p>Competition</p>
          </button>
          <button className=' bg-primary-color h-44 max-w-60 w-full items-center justify-center p-4 rounded-lg text-white flex flex-col gap-2'>
              <MdGroups className='text-6xl' />
              <p>Club</p>
          </button>
          <button className=' bg-primary-color h-44 max-w-60 w-full p-4 items-center justify-center rounded-lg text-white flex flex-col gap-2'>
              <PiExamFill className='text-6xl' />
              <p>Tests</p>
        </button>
    </div>
  </>
  )
}

export default SearchTabs