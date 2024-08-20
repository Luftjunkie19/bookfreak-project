import DashboardBar from 'components/Sidebars/left/competition/DashboardBar'
import React from 'react'
import { FaBook, FaCircleUser } from 'react-icons/fa6'
import { RiContractFill, RiQuestionAnswerFill } from 'react-icons/ri'

type Props = {}

function Page({}: Props) {
  return (
    <div className='flex w-full'>
  <DashboardBar/>
      <div className='w-full p-2'>
        <div className="flex flex-col gap-1">
        <p className='text-white'>Requests/Reports from Participants</p>

          <div className="">

            <div className="flex text-white mx-auto justify-between p-1 items-center max-w-5xl w-full">
              <p className='flex-1 justify-center flex items-center gap-6 text-center'>User <FaCircleUser className='text-2xl text-primary-color' /></p>
              <p className='flex-1 justify-center flex items-center gap-6 text-center'>Read <FaBook className='text-2xl text-primary-color'/></p>
                       <p className='flex-1 justify-center flex items-center gap-6 text-center'>Conditions <RiContractFill className='text-2xl text-primary-color'/></p>
              <p className='flex-1 justify-center flex items-center gap-6 text-center'>Answers <RiQuestionAnswerFill className='text-2xl text-primary-color' /></p>
            </div>
            
          <div className="flex flex-col gap-2 max-w-5xl w-full bg-dark-gray p-2 rounded mx-auto">

            <div className=""></div>
          </div>
          
        </div>
          </div>

        <div className="flex flex-col gap-1">
        <p className='text-white'>Administration of the Competition</p>
          
            <div className="flex flex-col gap-2 bg-dark-gray p-2 rounded-lg">

            <div className=""></div>
          </div>
                </div>

        <div className="">
          <p className='text-white'>Participants of the Competition</p>
          
            <div className="flex flex-col gap-2 bg-dark-gray p-2 rounded-lg">

            <div className=""></div>
          </div>
        </div>
        
</div>
  </div>
  )
}

export default Page