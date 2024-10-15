'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import { formatDistanceToNow } from 'date-fns';
import Lottie from 'lottie-react';
import {
  FaArrowDown,
  FaFlag,
  FaGamepad,
  FaHeart,
  FaPencil,
  FaPlay,
  FaShare,
  FaTrash,
  FaTrashCan,
} from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import {
  useNavigate,
  useParams,
} from 'react-router';
import Link  from 'next/link';
import uniqid from 'uniqid';

import translations from '../../../assets/translations/BookPageTranslations.json';
import formTranslations from '../../../assets/translations/FormsTranslations.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import RemoveBtn from 'components/buttons/RemoveBtn';
import TestTable from 'components/test/TestTable';
import Button from 'components/buttons/Button';

function TestMainPage({ params }:{params:{testId:string}}) {
  const { user } = useAuthContext();
  const { testId } = params;

  const [showOnlyYours, setShowOnlyYours] = useState(false);
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

  const navigate = useRouter();



  const moveToTest = () => {
    const attemptId = uniqid("Attempt");

    navigate.push(
      `/test/${document.testId}/played/time?=${new Date().getTime()}attempId?=${attemptId}`
    );
  };

  return (
    <div className={`h-screen w-full flex gap-2`}>
      {document && <>
        <div className="flex bg-dark-gray gap-2 h-screen p-2 flex-col max-w-sm w-full text-white">
          <Image src={document.refersToBook.photoURL} alt='' width={60} height={60} className='h-60 w-full p-2 object-cover rounded-2xl' />
          <div className="flex justify-between items-center">
            <div className="">
            <p className='text-xl text-white'>{document.testName}</p>
            <div className='text-sm flex gap-2 items-center text-white'>
              <p>40k Plays</p>
              <p>10k Players</p>
             </div>
            </div>
            <div className="flex gap-[0.125rem] text-xl items-center">
              <Button type='transparent'>
                <FaHeart />
              </Button>
                <Button type='transparent'>
                <FaShare />
              </Button>
                <Button type='transparent'>
                <FaFlag />
              </Button>
</div>
          </div>
          <div className="flex gap-2 items-center">
                    <Button type='transparent' additionalClasses='bg-green-400'>Start Test</Button>
            <Button type='white'>Attempt</Button>
          </div>
        <p>{Object.values(document.queries).length} Queries</p>
          <div className="flex flex-col gap-1">
            <p className='text-lg font-semibold'>Description</p>
            <div className='overflow-y-auto w-full max-h-36'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita nobis mollitia corporis reiciendis ab dicta nostrum labore numquam quia quasi quae amet maiores reprehenderit recusandae magnam soluta libero, nisi porro. Dolore nemo vitae perferendis placeat, similique dolorem commodi saepe. Natus quas, beatae dolore impedit explicabo suscipit vel distinctio dolorum nostrum in a, quo enim deleniti molestiae, unde laboriosam. Veritatis non enim nobis quis magnam quae similique voluptatibus eveniet voluptas dolore!</div>
          </div>
        </div>


      </>}
      <div className="flex flex-col gap-2 p-2 w-full">
        <div className="flex gap-2 my-2 items-center">
          <Button type='blue' additionalClasses=' font-normal'>Questions</Button>
          <Button type='white' additionalClasses=' font-normal'>Ranking</Button>
</div>
        <div className="flex flex-col gap-2">
          <p className='text-xl font-semibold text-white'>Questions</p>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[48rem] h-fit">
            <div className="bg-dark-gray p-2 rounded-lg text-white flex flex-col gap-1 max-w-3xl w-full">
              <p>1 Question</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae aperiam iusto illo eveniet commodi reprehenderit, sapiente quasi molestiae expedita sequi.</p>
              <div className="flex justify-between items-center p-2">
                <p>5 Answers</p>
                <Button type='dark-blue' additionalClasses='flex gap-2 text-sm font-base items-center'>Show Answers <FaArrowDown/></Button>
            </div>
            </div>
                <div className="bg-dark-gray p-2 rounded-lg text-white flex flex-col gap-1 max-w-3xl w-full">
              <p>1 Question</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae aperiam iusto illo eveniet commodi reprehenderit, sapiente quasi molestiae expedita sequi.</p>
              <div className="flex justify-between items-center p-2">
                <p>5 Answers</p>
                <Button type='dark-blue' additionalClasses='flex gap-2 text-sm font-base items-center'>Show Answers <FaArrowDown/></Button>
            </div>
            </div>
                <div className="bg-dark-gray p-2 rounded-lg text-white flex flex-col gap-1 max-w-3xl w-full">
              <p>1 Question</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae aperiam iusto illo eveniet commodi reprehenderit, sapiente quasi molestiae expedita sequi.</p>
              <div className="flex justify-between items-center p-2">
                <p>5 Answers</p>
                <Button type='dark-blue' additionalClasses='flex gap-2 text-sm font-base items-center'>Show Answers <FaArrowDown/></Button>
            </div>
            </div>
                <div className="bg-dark-gray p-2 rounded-lg text-white flex flex-col gap-1 max-w-3xl w-full">
              <p>1 Question</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae aperiam iusto illo eveniet commodi reprehenderit, sapiente quasi molestiae expedita sequi.</p>
              <div className="flex justify-between items-center p-2">
                <p>5 Answers</p>
                <Button type='dark-blue' additionalClasses='flex gap-2 text-sm font-base items-center'>Show Answers <FaArrowDown/></Button>
            </div>
            </div>
                <div className="bg-dark-gray p-2 rounded-lg text-white flex flex-col gap-1 max-w-3xl w-full">
              <p>1 Question</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae aperiam iusto illo eveniet commodi reprehenderit, sapiente quasi molestiae expedita sequi.</p>
              <div className="flex justify-between items-center p-2">
                <p>5 Answers</p>
                <Button type='dark-blue' additionalClasses='flex gap-2 text-sm font-base items-center'>Show Answers <FaArrowDown/></Button>
            </div>
            </div>
                <div className="bg-dark-gray p-2 rounded-lg text-white flex flex-col gap-1 max-w-3xl w-full">
              <p>1 Question</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae aperiam iusto illo eveniet commodi reprehenderit, sapiente quasi molestiae expedita sequi.</p>
              <div className="flex justify-between items-center p-2">
                <p>5 Answers</p>
                <Button type='dark-blue' additionalClasses='flex gap-2 text-sm font-base items-center'>Show Answers <FaArrowDown/></Button>
            </div>
            </div>
                <div className="bg-dark-gray p-2 rounded-lg text-white flex flex-col gap-1 max-w-3xl w-full">
              <p>1 Question</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae aperiam iusto illo eveniet commodi reprehenderit, sapiente quasi molestiae expedita sequi.</p>
              <div className="flex justify-between items-center p-2">
                <p>5 Answers</p>
                <Button type='dark-blue' additionalClasses='flex gap-2 text-sm font-base items-center'>Show Answers <FaArrowDown/></Button>
            </div>
            </div>
                <div className="bg-dark-gray p-2 rounded-lg text-white flex flex-col gap-1 max-w-3xl w-full">
              <p>1 Question</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae aperiam iusto illo eveniet commodi reprehenderit, sapiente quasi molestiae expedita sequi.</p>
              <div className="flex justify-between items-center p-2">
                <p>5 Answers</p>
                <Button type='dark-blue' additionalClasses='flex gap-2 text-sm font-base items-center'>Show Answers <FaArrowDown/></Button>
            </div>
            </div>
                <div className="bg-dark-gray p-2 rounded-lg text-white flex flex-col gap-1 max-w-3xl w-full">
              <p>1 Question</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae aperiam iusto illo eveniet commodi reprehenderit, sapiente quasi molestiae expedita sequi.</p>
              <div className="flex justify-between items-center p-2">
                <p>5 Answers</p>
                <Button type='dark-blue' additionalClasses='flex gap-2 text-sm font-base items-center'>Show Answers <FaArrowDown/></Button>
            </div>
            </div>
          </div>
 </div>
 
 
        {/* <TestTable/> */}
      </div>
    </div>
  );
}

export default TestMainPage;
