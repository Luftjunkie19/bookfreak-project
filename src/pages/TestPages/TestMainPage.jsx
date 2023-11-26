import React, { useEffect, useState } from "react";

import { formatDistanceToNow } from "date-fns";
import Lottie from "lottie-react";
import { FaTrashCan } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import uniqid from "uniqid";

import { Button, ButtonGroup } from "@mui/material";

import animationLottie from "../../assets/lottieAnimations/Animation - 1700236886731.json";
import translations from "../../assets/translations/BookPageTranslations.json";
import formTranslations from "../../assets/translations/FormsTranslations.json";
import TestRanking from "../../components/TestTable/TestRanking";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useRealDatabase } from "../../hooks/useRealDatabase";
import useRealtimeDocument from "../../hooks/useRealtimeDocument";

function TestMainPage() {
  const { user } = useAuthContext();
  const { testId } = useParams();
  const [document, setDocument] = useState(null);
  const { getDocument } = useRealtimeDocument();
  const [showOnlyYours, setShowOnlyYours] = useState(false);
  const { removeFromDataBase } = useRealDatabase();

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadDocument = async () => {
    const documentEl = await getDocument("tests", testId);

    if (testId) {
      setDocument(documentEl);
    }
  };

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  const moveToTest = () => {
    const attemptId = uniqid("Attempt");

    navigate(
      `/test/${document.testId}/play/${new Date().getTime()}/${attemptId}`
    );
  };

  return (
    <div className="min-h-screen h-full w-full">
      {document && (
        <div className="max-w-[110rem] flex sm:flex-col lg:flex-row flex-wrap gap-4 justify-around items-center max-h-[64rem]">
          <div className="sm:w-full xl:w-2/5 flex items-center justify-center flex-col gap-2">
            {document.refersToBook.photoURL ? (
              <div className="w-full flex items-center justify-center flex-col gap-2">
                <div className=" w-56 h-72">
                  <img
                    className="w-full h-full object-cover"
                    src={document.refersToBook.photoURL}
                    alt=""
                  />
                </div>
                {document.createdBy.id === user.uid && (
                  <div className="sm:w-3/4 lg:w-1/4 flex">
                    <Button
                      className="my-2 gap-2 self-start"
                      color="error"
                      variant="contained"
                      onClick={() => {
                        removeFromDataBase("tests", testId);
                        toast.success("Removed successfully");
                        navigate("/tests");
                      }}
                    >
                      {translations.buttonsTexts.delete[selectedLanguage]}{" "}
                      <FaTrashCan />
                    </Button>
                  </div>
                )}
                <p className=" py-2 text-white font-semibold text-xl">
                  {document.refersToBook.title}
                </p>
              </div>
            ) : (
              <>
                <div className=" w-56 h-72">
                  <img
                    className="w-full h-full object-cover"
                    src="https://img.freepik.com/free-vector/college-entrance-exam-concept-illustration_114360-13742.jpg?size=338&ext=jpg&ga=GA1.1.1826414947.1699833600&semt=sph"
                    alt=""
                  />
                </div>
                {document.createdBy.id === user.uid && (
                  <div>
                    <Button
                      className="my-2 gap-2"
                      color="error"
                      variant="contained"
                      onClick={() => {
                        removeFromDataBase("tests", testId);
                        toast.success("Removed successfully");
                        navigate("/tests");
                      }}
                    >
                      {translations.buttonsTexts.delete[selectedLanguage]}{" "}
                      <FaTrashCan />
                    </Button>
                  </div>
                )}
                <p>{document.refersToBook}</p>
              </>
            )}
            <p>
              {Object.values(document.queries).length}{" "}
              {formTranslations.queries[selectedLanguage]}
            </p>
            <p>Created: {formatDistanceToNow(document.createdAt)} ago</p>
            <button
              className="btn text-white bg-accColor w-36 hover:bg-primeColor hover:scale-95 transition-all duration-500"
              onClick={moveToTest}
            >
              {formTranslations.playBtn[selectedLanguage]}
            </button>
          </div>{" "}
          {document.attempts && Object.values(document.attempts).length > 0 ? (
            <div className="flex flex-col gap-3 sm:w-full xl:w-1/2">
              <ButtonGroup
                className="sm:self-center xl:self-start"
                variant="contained"
                aria-label="outlined primary button group"
              >
                <Button onClick={() => setShowOnlyYours(false)}>
                  <p>{formTranslations.allAttempts[selectedLanguage]}</p>
                </Button>
                <Button onClick={() => setShowOnlyYours(true)}>
                  <p>{formTranslations.yourAttempts[selectedLanguage]}</p>
                </Button>
              </ButtonGroup>

              <TestRanking
                rowData={
                  showOnlyYours
                    ? Object.values(document.attempts).filter(
                        (attempt) => attempt.player.uid === user.uid
                      )
                    : Object.values(document.attempts)
                }
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:w-full xl:w-1/2 py-3">
              <Lottie
                className="max-w-lg self-center"
                animationData={animationLottie}
              />
              <p className=" text-white font-semibold text-lg self-center ">
                Perhabs somebody is solving now{" "}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TestMainPage;
