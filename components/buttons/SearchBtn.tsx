'use client';
import { FaPlusCircle, FaSearch } from 'react-icons/fa';
import { FaBook } from 'react-icons/fa6';
import {
  PiExamFill,
  PiRankingFill,
} from 'react-icons/pi';
import { SiClubhouse } from 'react-icons/si';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function SearchBtn() {
  const router = useRouter();
  const navigateToForm = (path: string) => {
    router.push(path);
  }


  return (

        <div className="outline-none border-none bg-none flex items-center gap-4 text-white">
          <FaSearch size={24} />
          <span className='text-xl sm:hidden xl:block'>Search</span>
        </div>
     
  );
}

export default SearchBtn;
