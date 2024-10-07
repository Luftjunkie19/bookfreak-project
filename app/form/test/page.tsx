'use client'; 
import '../../../stylings/primereact-custom/dataview.css'

import React, { useState } from 'react';

import {
  FaPlus,
  FaQuestionCircle,
  FaTrashAlt,
} from 'react-icons/fa';
import {
  FaPencil,
  FaTrashCan,
} from 'react-icons/fa6';
import { PiExamFill } from 'react-icons/pi';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router';
import uniqid from 'uniqid';




import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/BookPageTranslations.json';
import formTranslations from '../../../assets/translations/FormsTranslations.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useRouter } from 'next/navigation';
import LabeledInput from 'components/input/LabeledInput';
import { MdNoteAdd, MdQuestionAnswer } from 'react-icons/md';
import Question from 'components/elements/question/Question';
import { DataView } from 'primereact/dataview';
import { Pagination } from '@nextui-org/react';
import Button from 'components/buttons/Button';
import AdBanner from 'components/advertisements/AdBanner';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { useFieldArray, useForm } from 'react-hook-form';

const alphabet = require('alphabet');

interface Test {
  name:string,
  description: string,
  questions:Question[],
  bookReferenceId?:string,
}

interface Question {
  questionContent: string,
  correctAnswer: string,
  answers:Answer[]
}

interface Answer {
  answerContent: string,
  isCorrect: boolean
}

function CreateTests() {
  const { user } = useAuthContext();
  const [testName, setTestName] = useState('');
  const navigate = useRouter();
const dispatch=useDispatch();
const {register,setValue}=useForm<Test>();
const {fields}=useFieldArray({name:'answer'});
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);

  return (
    <div className={`min-h-screen h-full flex`}>
      <div className='xl:bg-dark-gray flex flex-col gap-2 p-2 xl:h-screen max-w-xs w-full'>
        <p className='text-xl font-semibold text-white'>Test Creator</p>
        <LabeledInput additionalClasses='p-2' label='Question' type={'light'}  />
        
        <div className="flex flex-col gap-2">
          <p className='text-lg text-white'>Possible Answers</p>
          <div className="flex flex-col overflow-y-auto gap-2 h-60">
                 <LabeledInput additionalClasses='p-2' label='Answer A' type={'light'} />
            
                      <LabeledInput additionalClasses='p-2' label='Answer B' type={'light'}  />
            
                      <LabeledInput additionalClasses='p-2' label='Answer C' type={'light'}  />
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Button type={'blue'}>Create Test</Button>
            <Button type={'white-blue'}>New Answer</Button>
        </div>
      </div>
      
      <div className="w-full flex flex-col gap-2 p-4">
        <div className="text-white">
        <p className='text-3xl font-semibold'>Test , Correct and gain your knowledge </p>
        <p className='text-sm font-light'>No Test about recent book you have read ? Don’t hesitate and create the Test !</p>
      <AdBanner/>
          
       </div>
      
        <p className='text-white flex gap-2 items-center'><BsQuestionCircleFill className='text-primary-color text-2xl' /> 5 Questions</p>
        <div className="flex">
          <div className="max-w-3xl flex flex-col gap-2 w-full bg-dark-gray text-white p-2 rounded-lg">
            <p className='text-sm font-extralight'>Question 1</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque in amet placeat dolore quia nesciunt nam saepe unde enim minima harum quasi maiores voluptatibus pariatur mollitia impedit modi vero, totam, soluta expedita, omnis cumque fugiat incidunt! Assumenda distinctio optio perspiciatis voluptatum dignissimos, ducimus commodi quis incidunt ab expedita velit, beatae quae quisquam, tempora temporibus inventore officia ratione dolore enim animi. Error quasi eveniet maiores mollitia perspiciatis, quo cupiditate qui veniam?</p>
            <div className="flex w-full justify-between p-1">
              <p>4 Answers</p>
                <Button type={'transparent'} additionalClasses='text-primary-color flex gap-2 items-center'>Show Answers <MdQuestionAnswer /></Button>
</div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default CreateTests;
