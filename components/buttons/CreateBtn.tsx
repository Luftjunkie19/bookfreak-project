'use client';
import { FaPlusCircle } from 'react-icons/fa';
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

function CreateBtn({buttonColour}:{buttonColour:string}) {
  const router = useRouter();
  const navigateToForm = (path: string) => {
    router.push(path);
  }


  return (
    <Dropdown className='sm:hidden lg:block'>
      <DropdownTrigger>
        <button className="outline-none border-none bg-none sm:hidden lg:block">
          <FaPlusCircle size={24} className={`${buttonColour}`} />
        </button>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
        <DropdownItem
          onClick={() => navigateToForm('/form/book')}
          key="book"
          description="Create a new book !"
          startContent={<FaBook className='' />}
        >
          Book
        </DropdownItem>

        <DropdownItem
          onClick={() => navigateToForm('/form/competition')}
          key="competition"
          description="Create, Compete and win !"
          startContent={<PiRankingFill className='' />}
        >
          Competition
        </DropdownItem>
        <DropdownItem
          onClick={() => navigateToForm('/form/club')}
          key="club"
          showDivider
          description="Create, Socialize, Enjoy !"
          startContent={<SiClubhouse className='' />}
        >
          <Link href="/form/club">
            Club
          </Link>
        </DropdownItem>
        <DropdownItem
          key="test"
          onClick={() => navigateToForm('/form/test')}
          description="Create, Test, Deduct !"
          startContent={<PiExamFill className='' />}
        >
          Test
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default CreateBtn;
