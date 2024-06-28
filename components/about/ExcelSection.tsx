import React from 'react'
import ExcelTab from './excel-secrtion-items/ExcelTab'
import { RiLayout4Fill, RiRobot3Fill } from 'react-icons/ri'
import { BsPersonArmsUp } from 'react-icons/bs'
import { FaCoins } from 'react-icons/fa6'

type Props = {}

function ExcelSection({}: Props) {
  return (
      <div className='flex flex-col gap-4'>
          <p className='text-3xl font-semibold'>Features, Excelling Us</p>
          <div className="flex gap-6 items-center justify-around mx-auto m-0 max-w-screen-2xl w-full">
              
              <ExcelTab>
                  <RiRobot3Fill size={48} />
                  <p className='font-bold'><span className='text-secondary-color'>AI</span>ssistant</p>
              </ExcelTab>
              
                <ExcelTab>
                  <RiLayout4Fill size={48} />
                  <p className='font-bold'>Innovative Layout</p>
              </ExcelTab>
              
                <ExcelTab>
                  <BsPersonArmsUp size={48} />
                  <p className='font-bold'>Open-Mindedness</p>
              </ExcelTab>
              
                <ExcelTab>
                  <FaCoins size={48} />
                  <p className='font-bold'>Read and Earn</p>
            </ExcelTab>
          </div>
    </div>
  )
}

export default ExcelSection