'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import { formatDistanceToNow } from 'date-fns';
import Lottie from 'lottie-react';
import {
  FaGamepad,
  FaPencil,
  FaPlay,
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
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import useRealtimeDocument from '../../../hooks/useRealtimeDocument';
import useGetDocument from 'hooks/useGetDocument';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import RemoveBtn from 'components/buttons/RemoveBtn';
import TestTable from 'components/test/TestTable';

function TestMainPage({ params }:{params:{testId:string}}) {
  const { user } = useAuthContext();
  const { testId } = params;
  const { document } = useGetDocument('tests', testId);

  const [showOnlyYours, setShowOnlyYours] = useState(false);
  const { removeFromDataBase } = useRealDatabase();
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
    <div className={`min-h-screen h-full w-full`}>
      {document && <>
        <div className="p-4 flex gap-1 flex-col text-white">
          <Image src={document.refersToBook.photoURL} alt='' width={60} height={60} className='h-80 w-60 rounded-lg'/>
          <p className='text-lg'>{document.testName}</p>
        <p>{Object.values(document.queries).length} Queries</p>
          <div className="flex gap-2 items-center">
            <RemoveBtn additionalClasses='flex items-center gap-4'>Delete <FaTrash /> </RemoveBtn>
          </div>
        </div>

          <TestTable/>

      </>}
    </div>
  );
}

export default TestMainPage;
