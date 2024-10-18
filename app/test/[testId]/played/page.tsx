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

  const {data:document}=useQuery({queryKey:['test'], queryFn:()=>fetch('/api/supabase/test/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({id:testId}),
  }).then((res)=>res.json())})


const checkIfCorrect = (chosenId, correctAnswers) => {
    if (correctAnswers.find((corAs)=>corAs === chosenId) && correctAnswers.length === 1) {
      setTimeout(()=>{
        setAccquiredPoints((points) => {
          return points + 1;
        });
        setIsAnswerCorrect({id:chosenId, isCorrect:true});
        toast.success(alertMessages.notifications.successfull.answer[selectedLanguage]);
        setCurrentQuestion(currentQuestion + 1);
      }, 2000)

      // dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.successfull.answer[selectedLanguage]}`, alertType: "success" }));
    } else {
      setIsAnswerCorrect({id:chosenId, isCorrect:false});
      toast.error(alertMessages.notifications.wrong.answer[selectedLanguage]);
    // dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.answer[selectedLanguage]}`, alertType:"error"}))
    }
  };

  const pushToNextQuestion = (queriesAmount) => {
    if (queriesAmount - 1 > currentQuestion) {
      setCurrentQuestion((curQuestion) => {
        return curQuestion + 1;
      });
      setSelectedAnswer(null);
    }
  };

useEffect(()=>{
  const interval= setInterval(()=>{
    setTimeGone(timeGone + 1);
  },1000);
  
  if(timeGone > 30 && document){
    setCurrentQuestion(currentQuestion >= document.questions.length - 1 ? 0 : currentQuestion + 1);
    setTimeGone(0);
    clearInterval(interval);
  }

  return ()=>clearInterval(interval);


},[currentQuestion, document, timeGone])


  // const finishTest = () => {
  //   addToDataBase("tests", `${testId}/attempts/${attemptId}`, {
  //     id: attemptId,
  //     testId,
  //     startTime: new Date(Number.parseFloat(startTime as string)).toString(),
  //     endTime: new Date().toString(),
  //     finalResult: (accquiredPoints / Object.values((test as any).queries).length) * 100,
  //     timeOfGame: new Date().getTime() - Number.parseFloat(startTime as string),
  //     player: {
  //       nickname: (user as User).displayName,
  //       photoURL: (user as User).photoURL,
  //       uid: (user as User).uid,
  //     },
  //   });
  //   setSelectedAnswer(null);
  //   navigate(`/test/${testId}`);
  // };

  return (
    <div className="h-screen relative top-0 left-0 p-1 w-full flex flex-col">
      <div className="flex justify-between items-center px-2 py-1">
        <p className='text-white text-lg font-semibold'>{Math.floor(timeGone / 60) > 10 ? Math.floor(timeGone / 60) : `0${Math.floor(timeGone / 60)}`}:{timeGone >= 10 ? timeGone : `0${timeGone}`}</p>
        <p className='text-white flex gap-2 items-center'>Points gained <span className='text-primary-color text-lg font-semibold'>{accquiredPoints}</span></p>
      </div>
      {document && <>
         <p className='text-white text-center text-2xl font-bold mb-2  min-h-[50%]'>{document.questions[currentQuestion].questionContent}</p>
      <div className="flex w-full gap-2 items-center mx-auto m-0 p-2">
        {document.questions[currentQuestion].answers.map((item, index)=>(<div onClick={()=>{
          checkIfCorrect(item.id, document.questions[currentQuestion].correctAnswer);
          
        }} className={`flex ${isAnswerCorrect && isAnswerCorrect.id === item.id && 'bg-green-400'} hover:text-dark-gray hover:bg-primary-color/40 transition-all duration-400 cursor-pointer flex-1 bg-dark-gray text-white p-3 rounded-lg`} key={item.id}>
          <p>{alphabet[index].toUpperCase()}. {item.answerContent}</p>
        </div>))}
      </div>
      </>}
    </div>
  );
}

export default TestStartedPage;
