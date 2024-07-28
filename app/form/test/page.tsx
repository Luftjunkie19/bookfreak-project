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
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useRouter } from 'next/navigation';
import LabeledInput from 'components/input/LabeledInput';
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
  
      navigate.push('/');
      
    }

  };

  return (
    <div className={`min-h-screen h-full`}>
    

    </div>
  );
}

export default CreateTests;
