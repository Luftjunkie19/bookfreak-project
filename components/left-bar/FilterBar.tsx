'use client';
import CreateBtn from './CreateBtn'
import React from 'react'
import SearchBtn from './SearchBtn'
import { Button, Tooltip } from '@nextui-org/react'
import { GiPayMoney } from 'react-icons/gi'
import { RiRobot3Fill } from 'react-icons/ri'
import { usePathname } from 'next/navigation'

type Props = {
    filterBarContent?:React.ReactNode
}

function FilterBar({filterBarContent }: Props) {
  const location = usePathname();
  return (
    <div className={`h-screen sm:max-w-40 xl:max-w-xs w-full ${location.includes('search') ? 'sm:hidden lg:flex': 'hidden'} z-40 py-4 px-6  bg-dark-gray  flex-col gap-6 rounded-r-xl border-r-2 border-primary-color`}>          

          {filterBarContent}
          
          
    
        
    </div>
  )
}

export default FilterBar