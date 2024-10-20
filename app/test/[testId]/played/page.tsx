'use client';
import React, {
  useEffect,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';


import alertMessages from '../../../../assets/translations/AlertMessages.json';
import { useAuthContext } from 'hooks/useAuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import alphabet from 'alphabet'
import toast from 'react-hot-toast';
import Image from 'next/image';

function TestStartedPage() {
  const { user } = useAuthContext();
  const alphabet = require("alphabet");
  const selectedLanguage = useSelector((state:any) => state.languageSelection.selectedLangugage);
  const { testId } = useParams();
  const searchParams = useSearchParams()
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [timeGone, setTimeGone]=useState<number>(0);
  const [accquiredPoints, setAccquiredPoints] = useState<number>(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<{id:string, isCorrect:boolean}>();
  const navigate = useRouter();
  const dispatch = useDispatch();

  const {data:userDocument}=useQuery({
    queryKey: ['test'], queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: user!.id }),
    }).then((res) => res.json())
  });

  const { data: document } = useQuery({
    queryKey: ['test'], queryFn: () => fetch('/api/supabase/test/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: testId }),
    }).then((res) => res.json())
  });


  const insertResult = async () => { 
    const time = Number.parseInt(searchParams.get('time') as string); 
    const attemptId= searchParams.get('attemptId');

 const insertedObj = await fetch('/api/supabase/result/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: {score: accquiredPoints, testId, userId: user!.id, id: attemptId, percentageResult: Math.floor((accquiredPoints / document.questions.length) * 100), timeStarted: new Date(time), timeFinished: new Date(), timeDevoted: new Date().getTime() - new Date(time).getTime() } })
    });

    const insertedObjFetched = await insertedObj.json();

    return insertedObjFetched;
  }



  useEffect(()=>{
  const interval= setInterval(()=>{
    setTimeGone(timeGone + 1);
  },1000);
  
  if(timeGone > 30 && document && currentQuestion < document.questions.length - 1){
    setCurrentQuestion(currentQuestion + 1);
    setTimeGone(0);
    clearInterval(interval);
    }
    
    if (document && currentQuestion === document.questions.length - 1) {
      setTimeGone(0);  
    clearInterval(interval);
    }

  return ()=>clearInterval(interval);


},[currentQuestion, document, timeGone])


  const validateAnswer = (chosenId: string, correctAnswers: string[]) => {
 setTimeout(() => {
      if (correctAnswers.find((corAs) => corAs === chosenId)) {
        setAccquiredPoints((points) => {
          return points + 1;
        });
        setIsAnswerCorrect({ id: chosenId, isCorrect: true });
        toast.success(alertMessages.notifications.successfull.answer[selectedLanguage]);
        if (currentQuestion !== document.questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        }
      } else {
        setIsAnswerCorrect({ id: chosenId, isCorrect: false });
        toast.error(alertMessages.notifications.wrong.answer[selectedLanguage]);
        if (currentQuestion !== document.questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        }
  }
   setTimeout(async () => {
     setIsAnswerCorrect(undefined);
     setTimeGone(0);
     if (currentQuestion === document.questions.length - 1) {
       const insertedObj = await insertResult();
       console.log(insertedObj);
       if (insertedObj.data) {
         navigate.push('/search/tests');
       }
     }
      }, 2000);
        
        
    }
  , 2000);
    
    
  }






  return (
    <div className="sm:h-[calc(100vh-3.25rem)] lg:h-[calc(100vh-4rem)] relative overflow-y-auto justify-between top-0 left-0 w-full flex flex-col gap-4 items-center">
      {document && <div className='flex justify-center gap-16 items-center w-full h-full flex-col'>
        <div className="flex flex-col gap-2 bg-white text-dark-gray max-w-lg w-full rounded-lg p-6">
          <p>{currentQuestion + 1} Question</p>
        <p className='text-2xl font-bold mb-2'>{document.questions[currentQuestion].questionContent}</p>
        </div>

      <div className="flex w-full self-end gap-2 items-center mx-auto m-0 p-2">
        {document.questions[currentQuestion].answers.map((item, index)=>(<button disabled={isAnswerCorrect ? true : false} onClick={()=>{
          validateAnswer(item.id, document.questions[currentQuestion].correctAnswer);

        }} className={`flex border-primary-color border-2 ${typeof isAnswerCorrect !== 'undefined' && isAnswerCorrect.id !== item.id && !isAnswerCorrect.isCorrect  && 'bg-red-400'}  ${typeof isAnswerCorrect !== 'undefined' && isAnswerCorrect.id === item.id && isAnswerCorrect.isCorrect  && 'bg-green-400'} bg-dark-gray hover:text-dark-gray hover:bg-primary-color/40  transition-all duration-400 cursor-pointer flex-1  text-white p-3 rounded-lg`} key={item.id}>
          <p>{alphabet[index].toUpperCase()}. {item.answerContent}</p>
        </button>))}
      </div>
      </div>}

      <div className="bg-primary-color text-white flex w-full justify-between p-4 items-center">
      { userDocument && userDocument.data &&
<div className="flex gap-2 items-center">
 <Image className='w-8 h-8 rounded-full' src={userDocument.data.photoURL} alt="" width={60} height={60}/>
 <p className="text-white">{userDocument.data.nickname}</p>
</div>
}
    
        <p className='text-white text-lg font-semibold'>{Math.floor(timeGone / 60) > 10 ? Math.floor(timeGone / 60) : `0${Math.floor(timeGone / 60)}`}:{timeGone >= 10 ? timeGone : `0${timeGone}`}</p>
        
        
        <p className='text-white flex gap-2 items-center'>Points gained <span className=' text-lg font-semibold'>{accquiredPoints}</span></p>
      </div>
      
    </div>
  );
}

export default TestStartedPage;
