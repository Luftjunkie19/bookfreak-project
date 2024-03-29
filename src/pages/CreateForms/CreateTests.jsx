import React, { useState } from 'react';

import {
  FaPlus,
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
import {
  Autocomplete,
  TextField,
} from '@mui/material';

import alertMessages from '../../assets/translations/AlertMessages.json';
import translations from '../../assets/translations/BookPageTranslations.json';
import formTranslations from '../../assets/translations/FormsTranslations.json';
import { snackbarActions } from '../../context/SnackBarContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';

const alphabet = require('alphabet');

function CreateTests() {
  const { user } = useAuthContext();
  const [testName, setTestName] = useState('');
  const [refersToBook, setRefersToBook] = useState(null);
  const { addToDataBase } = useRealDatabase();
  const { documents: books } = useGetDocuments('books');
  const navigate = useNavigate();
const dispatch=useDispatch();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
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

    queries.map((query) =>
      addToDataBase('tests', `${testId}/queries/${query.queryId}`, {
        ...query,
      })
    );

    queries.map((query, i) =>
      query.possibleAnswers.map((answer) =>
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
    navigate('/');
  };

  return (
    <div className={`min-h-screen h-full ${!isDarkModed && "pattern-bg"}`}>
      <div className="w-full border-b-2 border-accColor p-2">
        <h1 className={`text-2xl text-center ${isDarkModed ? "text-white" : "text-black"} font-bold p-2`}>
          {formTranslations.topText.tests[selectedLanguage]}
        </h1>

        <div className="flex flex-col gap-2 w-full">
          {books.length > 0 && (
            <div className="sm:w-full md:max-w-lg my-2">
              <label className="flex flex-col sm:w-full md:max-w-lg">
                <span>
                  {formTranslations.testFields.testName.label[selectedLanguage]}
                </span>
                <Input
                  className={`bg-transparent w-full border-accColor ${isDarkModed ? "text-white" : "text-black"}`}
                  color="primary"
                  variant="outlined"
                  placeholder={
                    formTranslations.testFields.testName.placeholder[
                      selectedLanguage
                    ]
                  }
                  onChange={(e) => setTestName(e.target.value)}
                />
              </label>

              <Autocomplete
                className="w-full text-white my-4"
                options={books}
                getOptionLabel={(option) => option.title}
                onChange={setSelectedBook}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    className="w-full text-white"
                    {...params}
                    label={
                      formTranslations.testFields.bookSelection[selectedLanguage]
                    }
                    variant="outlined"
                  />
                )}
                placeholder="Select a book..."
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button onClick={enableCreating} startDecorator={<FaPlus />}>
              {
                formTranslations.testFields.buttonText.addNewQuery[
                  selectedLanguage
                ]
              }
            </Button>
            {queries.length > 1 && (
              <Button onClick={createNewTest} endDecorator={<PiExamFill />}>
                {
                  formTranslations.testFields.buttonText.createTestBtn[
                    selectedLanguage
                  ]
                }
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {createNewQuery && (
          <form>
            <label htmlFor="">
              <span>
                {formTranslations.testFields.questionLabel[selectedLanguage]}
              </span>
              <Input
                className={`bg-transparent max-w-xs border-accColor ${isDarkModed ? "text-white" : "text-black"}`}
                color="primary"
                size="md"
                variant="outlined"
                value={newQuery.question}
                onChange={(e) => handleQueryChange('question', e.target.value)}
              />
            </label>

            <div className="p-2">
              <p>
                {formTranslations.testFields.possibleAnswers[selectedLanguage]}:
              </p>
              <div className="flex gap-4 max-w-6xl flex-wrap">
                {newQuery.possibleAnswers.map((posAnswer) => (
                  <div
                    key={posAnswer.id}
                    className={`sm:w-80 cursor-pointer py-2 px-4 rounded-lg flex gap-2 items-center ${
                      newQuery.correctAnswer === posAnswer.id
                        ? 'bg-green-500'
                        : 'bg-accColor'
                    }`}
                    onClick={() => handleAnswerClick(posAnswer.id)}
                  >
                    <p className="text-white">
                      {alphabet.lower[posAnswer.label - 1]}
                    </p>
                    <Input
                      className="w-full"
                      value={posAnswer.answer}
                      onChange={(e) =>
                        handleAnswerChange(posAnswer.label, e.target.value)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setNewQuery((query) => ({
                          ...query,
                          possibleAnswers: query.possibleAnswers.filter(
                            (q) => q.label !== posAnswer.label
                          ),
                        }));
                      }}
                    >
                      <FaTrashAlt className="text-red-500 text-lg" />
                    </button>
                  </div>
                ))}
                <Button
                  onClick={() => {
                    setNewQuery((query) => ({
                      ...query,
                      possibleAnswers: [
                        ...query.possibleAnswers,
                        {
                          label: query.possibleAnswers.length + 1,
                          answer: '',
                          id: uniqid(`answer${query.possibleAnswers.length + 1}`),
                        },
                      ],
                    }));
                  }}
                >
                  {
                    formTranslations.testFields.buttonText.anotherQuestion[
                      selectedLanguage
                    ]
                  }
                </Button>
              </div>
            </div>
            <button
              className="btn btn-wide text-white bg-accColor mt-6 mx-2"
              onClick={(e) => {
                e.preventDefault();

                if (
                  newQuery.possibleAnswers.some(
                    (answer) => answer.answer.trim() === ''
                  )
                ) {
                  return;
                }

                if (!newQuery.correctAnswer) {
                  return;
                }

                if (newQuery.question.trim() === '') {
                  return;
                }

                setQueries((prevQueries) => [...prevQueries, { ...newQuery }]);
                setCreateNewQuery(false);
                setNewQuery({
                  question: '',
                  correctAnswer: null,
                  possibleAnswers: [
                    { label: 1, answer: '', id: uniqid('answer1') },
                    { label: 2, answer: '', id: uniqid('answer2') },
                  ],
                  queryId: uniqid(`query${queries.length}`),
                });
              }}
            >
              {
                formTranslations.testFields.buttonText.createBtn[
                  selectedLanguage
                ]
              }
            </button>
          </form>
        )}
      </div>

      {queries.length > 0 && (
        <div className="flex gap-2 flex-col p-2 overflow-y-scroll max-h-[37rem] max-w-3xl">
          <p>Queries:</p>
          {queries.map((query) => (
            <div className="max-w-2xl bg-accColor text-white py-2 px-4" key={query.queryId}>
              <div className="flex w-full justify-between">
                <button
                  className="flex gap-1 items-center"
                  onClick={() => {
                    setNewQuery(query);
                    enableCreating();
                  }}
                >
                  {translations.buttonsTexts.edit[selectedLanguage]} <FaPencil />
                </button>
                <button
                  className="flex gap-1 items-center"
                  onClick={() => {
                    console.log(queries);
                    setQueries((quers) =>
                      quers.filter((quer) => quer.queryId !== query.queryId)
                    );
                  }}
                >
                  {translations.buttonsTexts.delete[selectedLanguage]}{' '}
                  <FaTrashCan className="text-red-500" />
                </button>
              </div>
              <p className="py-2">{query.question}</p>
              <ul className="flex flex-wrap sm:flex-col md:flex-row justify-around items-center w-full gap-4">
                {query.possibleAnswers.map((answer) => (
                  <li className="w-2/5" key={answer.label}>
                    <div className="w-full flex gap-2">
                      <p>{alphabet.lower[answer.label - 1]}.</p>
                      <p>{answer.answer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CreateTests;
