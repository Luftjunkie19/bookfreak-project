import '../stylings/TableStyling.css';

import React, {
  useEffect,
  useState,
} from 'react';

import { formatDistanceToNow } from 'date-fns';
import Lottie from 'lottie-react';
import {
  FaGamepad,
  FaPencil,
  FaTrashCan,
} from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import {
  useNavigate,
  useParams,
} from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import uniqid from 'uniqid';

import {
  Button,
  ButtonGroup,
} from '@mui/material';

import animationLottie
  from '../../assets/lottieAnimations/Animation - 1700236886731.json';
import translations from '../../assets/translations/BookPageTranslations.json';
import formTranslations from '../../assets/translations/FormsTranslations.json';
import TestRanking from '../../components/TestTable/TestRanking';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';

function TestMainPage() {
  const { user } = useAuthContext();
  const { testId } = useParams();
  const [document, setDocument] = useState(null);
  const { getDocument } = useRealtimeDocument();
  const [showOnlyYours, setShowOnlyYours] = useState(false);
  const { removeFromDataBase } = useRealDatabase();
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
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
    <div className={`min-h-screen h-full w-full ${!isDarkModed ? 'pattern-bg' : ''}`}>
      {document && (
        <div className="flex sm:flex-col lg:flex-row gap-4 justify-around items-center">
          <div className="sm:w-full xl:w-2/5 flex items-center justify-center flex-col gap-2 py-6">
            {document.refersToBook.photoURL ? (
              <div className="w-full flex items-center justify-center flex-col gap-2">
                <div className="w-56 h-72">
                  <img
                    className="w-full h-full rounded-lg object-cover"
                    src={document.refersToBook.photoURL}
                    alt=""
                  />
                </div>
                {document.createdBy.id === user.uid && (
                  <div className=" max-w-md flex justify-around items-center gap-2">
                    <Button
                    sx={{fontFamily:"Montserrat"}}
                      className="my-2 self-start"
                      color="error"
                      variant="contained"
                      onClick={() => {
                        removeFromDataBase("tests", testId);
                        toast.success("Removed successfully");
                        navigate("/tests");
                      }}
                      endIcon={<FaTrashCan />}
                    >
                      {translations.buttonsTexts.delete[selectedLanguage]}{" "}
                      
                    </Button>{" "}
                    <Button
                       sx={{fontFamily:"Montserrat"}}
                      className="my-2 gap-2"
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        navigate(`/edit-test/${testId}`);
                      }}
                      endIcon={<FaPencil />}
                    >
                      Edit 
                    </Button>
                  </div>
                )}
                <p className={` py-2 ${isDarkModed ? "text-white" : "text-black"} font-semibold text-xl`}>
                  {document.refersToBook.title}
                </p>
              </div>
            ) : (
              <>
                <div className="w-56 h-72">
                  <img
                    className="w-full h-full rounded-lg object-cover"
                    src="https://img.freepik.com/free-vector/college-entrance-exam-concept-illustration_114360-13742.jpg?size=338&ext=jpg&ga=GA1.1.1826414947.1699833600&semt=sph"
                    alt=""
                  />
                </div>
                {document.createdBy.id === user.uid && (
                  <div className="sm:w-4/5 md:w-3/5 lg:w-2/5 flex justify-around items-center">
                    <Button
                    sx={{fontFamily:"Montserrat"}}
                      className="my-2 self-start"
                      color="error"
                      variant="contained"
                      onClick={() => {
                        removeFromDataBase("tests", testId);
                        toast.success("Removed successfully");
                        navigate("/tests");
                      }}
                      endIcon={<FaTrashCan />}
                    >
                      {translations.buttonsTexts.delete[selectedLanguage]}{" "}
                      
                    </Button>{" "}
                    <Button
                       sx={{fontFamily:"Montserrat"}}
                      className="my-2 gap-2"
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        navigate(`/edit-test/${testId}`);
                      }}
                      endIcon={<FaPencil />}
                    >
                      Edit 
                    </Button>
                  </div>
                )}
                <p className={`text-lg ${isDarkModed ? "text-white" : "text-black"} font-semibold`}>{document.refersToBook}</p>
              </>
            )}
            <div className="flex sm:w-4/5 md:w-3/5 lg:w-2/5 flex-col">
              <p classsName={`${isDarkModed ? "text-white" : "text-black"} font-medium`}>
                {Object.values(document.queries).length}{" "}
                {formTranslations.queries[selectedLanguage]}
              </p>
              <p classsName={`${isDarkModed ? "text-white" : "text-black"} font-medium`}>Created: {formatDistanceToNow(document.createdAt)} ago</p>
              <p className={`${isDarkModed ? "text-white" : "text-black"}`}>
                Made by:{" "}
                <Link className=' underline text-info' to={`/profile/${document.createdBy.id}`}>
                  {document.createdBy.nickname}
                </Link>
              </p>
            </div>
            <button
              className="btn text-white bg-accColor w-36 hover:bg-primeColor hover:scale-95 transition-all duration-500"
              onClick={moveToTest}
            >
              {formTranslations.playBtn[selectedLanguage]}
              <FaGamepad />
            </button>
          </div>{" "}
          {document.attempts && Object.values(document.attempts).length > 0 ? (
            <div className="flex flex-col gap-3 sm:m-3 md:m-0 max-w-3xl w-full">
              <ButtonGroup
                className="sm:self-center xl:self-start p-2"
                variant="contained"
                aria-label="outlined primary button group"
              >
                <Button      sx={{ fontFamily:"Montserrat", backgroundColor:"#4266b5 "}} onClick={() => setShowOnlyYours(false)}>
                  <p>{formTranslations.allAttempts[selectedLanguage]}</p>
                </Button>
                <Button sx={{ fontFamily:"Montserrat", backgroundColor:"#4266b5 "}} onClick={() => setShowOnlyYours(true)}>
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
              <p className={`${isDarkModed ? "text-white" : "text-black"} font-semibold text-lg self-center `}>
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
