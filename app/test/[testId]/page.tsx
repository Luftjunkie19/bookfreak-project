'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import image from '../../../assets/Logo.png'
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
import alphabet from 'alphabet'
import translations from '../../../assets/translations/BookPageTranslations.json';
import formTranslations from '../../../assets/translations/FormsTranslations.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import RemoveBtn from 'components/buttons/RemoveBtn';
import TestTable from 'components/test/TestTable';
import Button from 'components/buttons/Button';
import { useQuery } from '@tanstack/react-query';
import ModalComponent from 'components/modal/ModalComponent';
import { useDisclosure } from '@nextui-org/react';
import { FaInfoCircle } from 'react-icons/fa';

function TestMainPage({ params }:{params:{testId:string}}) {
  const { user } = useAuthContext();
  const { testId } = params;

  const {data:document}=useQuery({queryKey:['test'], queryFn:()=>fetch('/api/supabase/test/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({id:testId}),
  }).then((res)=>res.json())})

  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

  const navigate = useRouter();

  const { isOpen:isAnswerModalOpen, onOpen:onAnswerModalOpen, onOpenChange:onAnswerModalOpenChange, onClose:onAnswerModalClose} = useDisclosure();
  const [modalQuestion, setModalQuestion] = useState<any>(null);


const answerModal=(item:any)=>{
      return(<ModalComponent modalSize='sm' isOpen={isAnswerModalOpen} modalTitle='Q&A' modalBodyContent={<div className="w-full h-fit flex flex-col gap-3">
        <p className="text-white text-xl font-bold">{item.questionContent}</p>
        {item.answers.map((item, index) => (<p key={item.id} className={`${item.isCorrect ? 'text-green-400 font-semibold' : 'text-white'}`}>{alphabet[index].toUpperCase()}. {item.answerContent}</p>))}
      </div>} onClose={()=>{
          setModalQuestion(null);
          onAnswerModalClose();
      }} onOpenChange={()=>{
        onAnswerModalOpenChange();
      }}/>)
     }



  const moveToTest = () => {
    const attemptId = uniqid("Attempt");

    navigate.push(
      `/test/${document.id}/played?time=${new Date().getTime()}&?attempId=${attemptId}`
    );
  };

  return (
    <div className={`h-screen w-full flex gap-2`}>
      {document && <>
        <div className="flex bg-dark-gray gap-2 h-screen p-2 flex-col max-w-sm w-full text-white">
          <Image src={image} alt='' width={60} height={60} className='h-60 max-w-60 w-full p-2 object-cover rounded-2xl' />
          <div className="flex justify-between items-center">
            <div className="">
            <p className='text-xl text-white'>{document.testName}</p>
            <div className='text-sm flex gap-2 items-center text-white'>
              <p>{document.results.length} Plays</p>
              <p>{document.results.map((item)=>item.user).length} Players</p>
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
                    <Button onClick={moveToTest} type='black' additionalClasses='bg-green-400'>Start Test</Button>
            <Button type='white'>Attempt</Button>
          </div>
        <p>{document.questions.length} Queries</p>
          <div className="flex flex-col gap-1">
            <p className='text-lg font-semibold'>Description</p>
            <div className='overflow-y-auto w-full max-h-36'>{document.description}</div>
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
          <div className="flex flex-col gap-3 overflow-y-auto w-full sm:max-h-96 2xl:max-h-[36rem] h-full ">
      {document && document.questions && document.questions.map((query, index)=>(<div key={query.id} className="bg-dark-gray p-2 rounded-lg text-white flex flex-col gap-1 max-w-3xl w-full">
              <p>{index + 1} Question</p>
              <p>{query.questionContent}</p>
              <div className="flex justify-between items-center p-2">
                <p>{query.answers.length} Answers</p>
                <Button onClick={()=>{
                  setModalQuestion(query);
                  onAnswerModalOpen();
                }} type='dark-blue' additionalClasses='flex gap-2 text-sm font-base items-center'>Show Answers <FaInfoCircle/></Button>
            </div>
            </div>))}

            {modalQuestion && answerModal(modalQuestion)}
         
      
          </div>
 </div>
 
 
        {/* <TestTable/> */}
      </div>
    </div>
  );
}

export default TestMainPage;
