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
    <Dropdown>
      <DropdownTrigger>
        <button className="outline-none border-none bg-none">
          <FaSearch size={24} className="text-white " />
        </button>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
        <DropdownItem
          as={'a'}
          href='/search/books'
          key="book"
          description="Find an inspriring Book !"
          startContent={<FaBook className='' />}
        >
          Book
        </DropdownItem>

        <DropdownItem
          as={'a'}
          href='/search/competitions'
          key="competition"
          description="Search, Find, Compete and win !"
          startContent={<PiRankingFill className='' />}
        >
          Competition
        </DropdownItem>
        <DropdownItem
         as={'a'}
          href='/search/clubs'
          key="club"
          showDivider
          description="Find, Socialize, Enjoy !"
          startContent={<SiClubhouse className='' />}
        >
          <Link href="/clubs">
            Club
          </Link>
        </DropdownItem>
        <DropdownItem
          key="test"
         as={'a'}
          href='/search/tests'
          description="Find, Test, Deduct !"
          startContent={<PiExamFill className='' />}
        >
          Test
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default SearchBtn;
