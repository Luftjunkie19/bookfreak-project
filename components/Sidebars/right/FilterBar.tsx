'use client';
import CreateBtn from '../../buttons/CreateBtn'
import React from 'react'
import SearchBtn from '../../buttons/SearchBtn'
import { Button, Tooltip } from '@nextui-org/react'
import { GiPayMoney } from 'react-icons/gi'
import { RiRobot3Fill } from 'react-icons/ri'
import { usePathname } from 'next/navigation'
import { FaSortAmountDown } from 'react-icons/fa';
import { FaFilter } from 'react-icons/fa6';

type Props = {
  filterBarContent?: React.ReactNode,
      sortingBarContent?:React.ReactNode
}

function FilterBar({filterBarContent, sortingBarContent }: Props) {
  const location = usePathname();
  return (
    <div className={`h-screen sm:max-w-40 xl:max-w-xs w-full ${location.includes('search') ? 'sm:hidden lg:flex': 'hidden'} z-40 py-4 px-6  bg-dark-gray  flex-col gap-6 rounded-r-xl border-r-2 border-primary-color`}>          
      <div className="flex flex-col gap-2">
        <p className="text-white flex items-center gap-2"><FaFilter /> Filters</p>
          {filterBarContent}
      </div>
      
      <div className="flex flex-col gap-2">
        <p className="text-white flex items-center gap-2"><FaSortAmountDown/> Sorting</p>
        {sortingBarContent}
      </div>
          
          
    
        
    </div>
  )
}

export default FilterBar