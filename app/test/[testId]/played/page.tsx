

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
import { snackbarActions } from '../../../../context/SnackBarContext';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useRealDatabase } from '../../../../hooks/useRealDatabase';
import useRealtimeDocument from '../../../../hooks/useRealtimeDocument';

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
    const testDocument = await getDocument("tests", testId);

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

      dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.successfull.answer[selectedLanguage]}`, alertType: "success" }));
    } else {
    dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.answer[selectedLanguage]}`, alertType:"error"}))
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
      startTime: new Date(Number.parseFloat(startTime)).toGMTString(),
      endTime: new Date().toGMTString(),
      finalResult: (accquiredPoints / Object.values(test.queries).length) * 100,
      timeOfGame: new Date().getTime() - startTime,
      player: {
        nickname: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      },
    });
    setSelectedAnswer(null);
    navigate(`/test/${testId}`);
  };

  return (
    <div className="min-h-screen relative top-0 left-0 h-full w-full flex flex-col pattern-bg">
      {test && (
        <>
          <div className="flex w-full justify-between flex-wrap p-2">
            <p className="text-white text-lg font-semibold">
              Question: {currentQuestion + 1}/
              {Object.values(test.queries).length}
            </p>

            <p className="text-white text-lg font-semibold">
              Correct answers:{" "}
              <span className='text-success'>
              {accquiredPoints}/
              {Object.values(test.queries).length}

              </span>
            </p>
          </div>

          <div className="flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center w-full h-full flex-col gap-3">
            <p
              className="text-white font-bold text-2xl"
              onClick={() =>
                console.log(Object.values(test.queries)[currentQuestion])
              }
            >
              {Object.values(test.queries)[currentQuestion].question}
            </p>

            <div className="flex gap-3 flex-wrap max-w-6xl justify-around items-center">
              {Object.values(test.answers)
                .flat()
                .filter(
                  (answer) =>
                    answer.queryId ===
                    Object.values(test.queries)[currentQuestion].queryId
                )
                .map((answer) => (
                  <button
                    disabled={selectedAnswer !== null}
                    className={`btn bg-accColor  active:scale-95 hover:scale-95 duration-500 transition-all btn-wide text-white ${
                      selectedAnswer !== null &&
                      answer.id ===
                        Object.values(test.queries)[currentQuestion]
                          .correctAnswer &&
                      "bg-green-400 text-black"
                    } ${
                      selectedAnswer !== null && selectedAnswer === answer.id
                        ? `${
                            answer.id ===
                            Object.values(test.queries)[currentQuestion]
                              .correctAnswer
                              ? "bg-green-400 text-black"
                              : "bg-red-500"
                          }`
                        : ""
                    }`}
                    onClick={() => {
                      setTimeout(() => {
                        setSelectedAnswer(answer.id);
                        checkIfCorrect(
                          answer.id,
                          Object.values(test.queries)[currentQuestion]
                            .correctAnswer
                        );
                      }, 1000);
                    }}
                  >
                    {alphabet.lower[answer.label - 1]}. {answer.answer}
                  </button>
                ))}
            </div>
            {selectedAnswer !== null &&
              currentQuestion !== Object.values(test.queries).length - 1 && (
                <button
                  onClick={() => {
                    pushToNextQuestion(Object.values(test.queries).length);
                  }}
                  className="btn bg-accColor text-white"
                >
                  Next Query
                </button>
              )}
            {currentQuestion === Object.values(test.queries).length - 1 &&
              selectedAnswer !== null && (
                <button
                  onClick={finishTest}
                  className="btn bg-accColor text-white"
                >
                  Finish
                </button>
              )}
          </div>
        </>
      )}
    </div>
  );
}

export default TestStartedPage;
