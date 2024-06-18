import React, {
  useEffect,
  useState,
} from 'react';

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
import {
  useNavigate,
  useParams,
} from 'react-router';
import uniqid from 'uniqid';

import alertMessages from '../../../../assets/translations/AlertMessages.json';
import translations from '../../../../assets/translations/BookPageTranslations.json';
import formTranslations from '../../../../assets/translations/FormsTranslations.json';
import { snackbarActions } from '../../../../context/SnackBarContext';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useFormRealData } from '../../../../hooks/useFormRealData';
import { useRealDatabase } from '../../../../hooks/useRealDatabase';
import useRealtimeDocuments from '../../../../hooks/useRealtimeDocuments';

const alphabet = require("alphabet");

function EditTest() {
  const { testId } = useParams();
  const dispatch=useDispatch();
  const { user } = useAuthContext();
  const { getDocuments } = useRealtimeDocuments();
  const { updateDatabase } = useRealDatabase();
  const { document } = useFormRealData("tests", testId);
  const [books, setBooks] = useState<any[]>([]);
  const [data, setData] = useState(null);
  const [refersToBook, setRefersToBook] = useState(null);
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadBooks = async () => {
    const booksEls = await getDocuments("books");

    if (booksEls) {
      setBooks(booksEls as any[]);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadData = async () => {
    if (document) {
        setData(document);
    }
  };
  useEffect(() => {
    loadBooks();
    loadData();
  }, [loadBooks, loadData]);

  const [newQuery, setNewQuery] = useState({
    question: "",
    correctAnswer: null,
    possibleAnswers: [
      { label: 1, answer: "", id: uniqid("question1") },
      { label: 2, answer: "", id: uniqid("question2") },
    ],
    queryId: uniqid(`${uniqid(`query`)}`),
  });

  const [createNewQuery, setCreateNewQuery] = useState(false);
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

  const setSelectedBook = (e, value) => {
    setRefersToBook(value);
  };

  const removeQuestion = (id) => {
    setData((data) => {
      (data as any).queries = Object.values((data as any).queries).filter(
        (q) => q.queryId !== id
      );
      return data;
    });
  };

  const enableCreating = () => {
    setCreateNewQuery(!createNewQuery);
  };

  const updateTest = () => {
    updateDatabase(data, "tests", testId);

    Object.values((data as any).queries).map((query:any, i) =>
      query.possibleAnswers.map((answer) =>
        updateDatabase(
          {
            ...answer,
            queryId: query.queryId,
          },
          "tests",
          `${testId}/answers/${query.queryId}/${answer.label}`
        )
      )
    );

    navigate(`/test/${testId}`);
    dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.update[selectedLanguage]}`, alertType:"success"}));
  };

  return (
    <div className={`min-h-screen h-full`}>
     

    
    </div>
  );
}

export default EditTest;
