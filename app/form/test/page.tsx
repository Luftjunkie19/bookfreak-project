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

import {
  Button,
  Input,
} from '@mui/joy';


import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/BookPageTranslations.json';
import formTranslations from '../../../assets/translations/FormsTranslations.json';
import { snackbarActions } from '../../../context/SnackBarContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useRouter } from 'next/navigation';
import LabeledInput from 'components/input/LabeledInput';
import BlueButton from 'components/buttons/BlueButton';
import DarkButton from 'components/buttons/WhiteButton';
import { MdNoteAdd } from 'react-icons/md';
import Question from 'components/elements/question/Question';
import { DataView } from 'primereact/dataview';
import { Pagination } from '@nextui-org/react';

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
  
      dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.create[selectedLanguage]}`, alertType:"success"}));
      navigate.push('/');
      
    }

  };

  return (
    <div className={`min-h-screen h-full`}>
      <div className="flex flex-col m-4 gap-4 bg-dark-gray p-4 rounded-lg border-2 border-primary-color max-w-2xl w-full">
        <p className='text-white text-2xl font-semibold'>Create New Test</p>
        <LabeledInput additionalClasses='max-w-sm w-full' setValue={(value)=>console.log(value)} label='Test name'/>
      <div className="flex gap-4 items-center">
        <BlueButton additionalClasses='flex gap-2 items-center'>
            New Question
            <FaQuestionCircle />
          </BlueButton>
          <DarkButton additionalClasses='flex gap-2 items-center'>
            Create Test
            <MdNoteAdd />
          </DarkButton>
          </div>
      </div>

      <div className="flex flex-col mx-4 gap-4 p-4 rounded-lg">
        <p className='text-white text-2xl font-semibold'>Questions</p>
        <div className="grid w-full sm:max-h-[28rem] lg:max-h-fit h-full overflow-y-auto  lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {[{item:'item21'}, {item:'item5'}, {item:'item14'}, {item:'item2'}, {item:'item231'}, {item:'item55'}, {item:'item114'}, {item:'item3572'}, {item:'item201'}, {item:'item58'}, {item:'item142'}, {item:'item92'} ].map((item)=>(<Question key={item.item}/>))}
        </div>
        <Pagination className='self-center' total={10} initialPage={1} />
</div>

    </div>
  );
}

export default CreateTests;
