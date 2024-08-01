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
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useRouter } from 'next/navigation';
import LabeledInput from 'components/input/LabeledInput';
import { MdNoteAdd, MdQuestionAnswer } from 'react-icons/md';
import Question from 'components/elements/question/Question';
import { DataView } from 'primereact/dataview';
import { Pagination } from '@nextui-org/react';
import Button from 'components/buttons/Button';
import AdBanner from 'components/advertisements/AdBanner';
import { BsQuestionCircleFill } from 'react-icons/bs';

const alphabet = require('alphabet');

function CreateTests() {
  const { user } = useAuthContext();
  const [testName, setTestName] = useState('');
  const [refersToBook, setRefersToBook] = useState<any | null>(null);
  const { addToDataBase } = useRealDatabase();
  const { documents: books } = useGetDocuments('books');
  const navigate = useRouter();
const dispatch=useDispatch();
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const setSelectedBook = (_, value) => {
    setRefersToBook(value);
  };

  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState({
    question: '',
    correctAnswer: null,
    possibleAnswers: [
      { label: 1, answer: '', id: uniqid('question1') },
      { label: 2, answer: '', id: uniqid('question2') },
    ],
    queryId: uniqid(`query${queries.length}`),
  });
  const [createNewQuery, setCreateNewQuery] = useState(false);

  const enableCreating = () => {
    setCreateNewQuery(!createNewQuery);
  };

  const handleQueryChange = (field, value) => {
    setNewQuery((prevQuery) => ({
      ...prevQuery,
      [field]: value,
    }));
  };

  const handleAnswerChange = (label, value) => {
    setNewQuery((prevQuery) => ({
      ...prevQuery,
      possibleAnswers: prevQuery.possibleAnswers.map((answer) =>
        answer.label === label ? { ...answer, answer: value } : answer
      ),
    }));
  };

  const handleAnswerClick = (label) => {
    setNewQuery((prevQuery) => ({
      ...prevQuery,
      correctAnswer: prevQuery.correctAnswer === label ? null : label,
    }));
  };

  const createNewTest = () => {

    if (user) {
      const testId = uniqid('Test');
  
      addToDataBase('tests', testId, {
        testName: testName,
        refersToBook: refersToBook
          ? {
              id: refersToBook.id,
              title: refersToBook.title,
              author: refersToBook.author,
              photoURL: refersToBook.photoURL,
            }
          : 'No book selected',
        testId: testId,
        createdBy: {
          nickname: user.displayName,
          id: user.uid,
          photoURL: user.photoURL,
        },
        createdAt: new Date().getTime(),
      });
  
      queries.map((query:any) =>
        addToDataBase('tests', `${testId}/queries/${query.queryId}`, {
          ...query,
        })
      );
  
      queries.map((query:any, i) =>
        query.possibleAnswers.map((answer:any) =>
          addToDataBase(
            'tests',
            `${testId}/answers/${query.queryId}/${answer.label}`,
            {
              ...answer,
              queryId: query.queryId,
            }
          )
        )
      );
  
      navigate.push('/');
      
    }

  };

  return (
    <div className={`min-h-screen h-full flex`}>
      <div className='xl:bg-dark-gray flex flex-col gap-2 p-2 xl:h-screen max-w-sm w-full'>
        <p className='text-xl font-semibold text-white'>Test Creator</p>
        <LabeledInput label='Question' type={'light'} setValue={function (value: string): void {
          
        }} />
        
        <div className="flex flex-col gap-2">
          <p className='text-lg text-white'>Possible Answers</p>
          <div className="flex flex-col overflow-y-auto gap-2 h-60">
                 <LabeledInput label='Answer A' type={'light'} setValue={function (value: string): void {
          
            }} />
            
                      <LabeledInput label='Answer B' type={'light'} setValue={function (value: string): void {
          
            }} />
            
                      <LabeledInput label='Answer C' type={'light'} setValue={function (value: string): void {
          
        }} />
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
