

import React, {
  useEffect,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  useNavigate,
  useParams,
} from 'react-router';

import alertMessages from '../../../../assets/translations/AlertMessages.json';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useRealDatabase } from '../../../../hooks/useRealDatabase';
import useRealtimeDocument from '../../../../hooks/useRealtimeDocument';
import { User } from 'firebase/auth';

function TestStartedPage() {
  const { user } = useAuthContext();
  const alphabet = require("alphabet");
  const selectedLanguage = useSelector((state:any) => state.languageSelection.selectedLangugage);
  const { testId, startTime, attemptId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [accquiredPoints, setAccquiredPoints] = useState(0);
  const [test, setTest] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const navigate = useNavigate();
  const { addToDataBase } = useRealDatabase();
  const { getDocument } = useRealtimeDocument();
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadDocument = async () => {
    const testDocument = await getDocument("tests", testId as string);

    if (testDocument) {
      setTest(testDocument);
    }
  };

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  const checkIfCorrect = (chosenId, correctId) => {
    if (chosenId === correctId) {
      setAccquiredPoints((points) => {
        return points + 1;
      });

      // dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.successfull.answer[selectedLanguage]}`, alertType: "success" }));
    } else {
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

  const finishTest = () => {
    addToDataBase("tests", `${testId}/attempts/${attemptId}`, {
      id: attemptId,
      testId,
      startTime: new Date(Number.parseFloat(startTime as string)).toString(),
      endTime: new Date().toString(),
      finalResult: (accquiredPoints / Object.values((test as any).queries).length) * 100,
      timeOfGame: new Date().getTime() - Number.parseFloat(startTime as string),
      player: {
        nickname: (user as User).displayName,
        photoURL: (user as User).photoURL,
        uid: (user as User).uid,
      },
    });
    setSelectedAnswer(null);
    navigate(`/test/${testId}`);
  };

  return (
    <div className="min-h-screen relative top-0 left-0 h-full w-full flex flex-col">
   
    </div>
  );
}

export default TestStartedPage;
