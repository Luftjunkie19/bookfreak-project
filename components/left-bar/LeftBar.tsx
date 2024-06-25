'use client';
import CreateBtn from './CreateBtn'
import React from 'react'
import SearchBtn from './SearchBtn'
import { Button, Tooltip } from '@nextui-org/react'
import { GiPayMoney } from 'react-icons/gi'
import { RiRobot3Fill } from 'react-icons/ri'
import { usePathname } from 'next/navigation'

type Props = {}

function LeftBar({ }: Props) {
  const location = usePathname();
  return (
    <div className={`h-screen ${location.includes('search') || location.includes('/competition/') || location.includes('club') ? 'hidden': 'sm:hidden lg:flex'} z-40 py-4 px-6  bg-dark-gray  flex-col gap-6 rounded-r-xl border-r-2 border-primary-color`}>          
    
       <SearchBtn/>
      <CreateBtn />
      <Tooltip classNames={{
        content:"text-white bg-dark-gray border border-primary-color"
       }} content="Replenish your account">
      <button><GiPayMoney className='text-white text-2xl' /></button>
      </Tooltip>
        <Tooltip classNames={{
        content:"text-white bg-dark-gray border border-primary-color"
      }} content="Utilize AIsssistant's Power">   
      <button className='text-white text-2xl'><RiRobot3Fill /></button>
       </Tooltip>
        
    </div>
  )
}

export default LeftBar