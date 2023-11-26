import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Pagination } from '@mui/material';

import lottieAnimation
  from '../../assets/lottieAnimations/Animation - 1700320134586.json';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

function Tests() {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const [tests, setTests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [testQueries, setTestQueries] = useState([]);
  const { getDocuments } = useRealtimeDocuments();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadTests = async () => {
    const testsEls = await getDocuments("tests");

    if (testsEls) {
      setTests(testsEls);
    }
  };

  useEffect(() => {
    loadTests();
  }, [loadTests]);

  const objectsOnPage = () => {
    if (document.body.clientWidth > 0 && document.body.clientWidth < 1024) {
      return 10;
    } else {
      return 45;
    }
  };
  const fetchObjects = useCallback(
    (page) => {
      const start = (page - 1) * objectsOnPage();
      const end = start + objectsOnPage();
      const pageObjects = tests.slice(start, end);
      return pageObjects;
    },
    [tests]
  );

  const handlePagesChange = (e, value) => {
    if (currentPage < pagesAmount) {
      setCurrentPage(currentPage + 1);
      const pageObjects = fetchObjects(currentPage + 1);
      setTests(pageObjects);
      return;
    }

    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const pageObjects = fetchObjects(currentPage - 1);
      setTests(pageObjects);
      return;
    }
    setCurrentPage(value);
  };

  const pagesAmount = Math.ceil(tests.length / objectsOnPage());

  useEffect(() => {
    if (tests.length > 0) {
      const fetchedObjects = fetchObjects(currentPage);
      setTests(fetchedObjects);
    }
  }, [currentPage, tests, fetchObjects]);

  return (
    <div className="min-h-screen h-full overflow-x-hidden">
      {/** 
      <h2
        onClick={() => {
          console.log(recensionedBooks);
        }}
        className="text-center text-white sm:text-base lg:text-2xl font-bold py-2"
      >
        {recensionedBooks.length}{" "}
        {recensionedBooks.length > 1
          ? `${reuseableTranslations.booksObjects.books[selectedLanguage]}`
          : `${reuseableTranslations.booksObjects.book[selectedLanguage]}`}{" "}
        {recensionedBooks.length > 1
          ? `${translations.textUpOn.moreBooks[selectedLanguage]}`
          : `${translations.textUpOn.oneBook[selectedLanguage]}`}
        .
      </h2>*/}

      <div className="flex w-full  md:justify-start md:items-start flex-wrap gap-4 m-6">
        {tests.length > 0 &&
          tests.map((test) => (
            <Link
              className="sm:w-[43%] 2xl:w-[13%] xl:w-[15%] md:w-[30%] lg:w-[23%] flex flex-col group duration-500 transition-all hover:-translate-y-1 hover:bg-lightModeCol hover:text-accColor items-center bg-accColor text-white"
              to={`/test/${test.testId}`}
              key={test.testId}
            >
              {test.refersToBook.photoURL ? (
                <div className="w-full h-48 group-hover:border-b-accColor border-b-white border-b-2">
                  <img
                    src={test.refersToBook.photoURL}
                    alt=""
                    className="w-full h-full object-fill"
                  />
                </div>
              ) : (
                <div className="w-full h-48 p-2 group-hover:border-b-accColor border-b-white border-b-2">
                  <img
                    src="https://m.media-amazon.com/images/I/51qwdm+hKgL.png"
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 p-4 self-start">
                <p className="font-bold">{test.testName}</p>
                {test.refersToBook.title ? (
                  <p className="font-semibold">{test.refersToBook.title}</p>
                ) : (
                  <>
                    <p className="font-semibold">{test.refersToBook}</p>
                  </>
                )}
                <p>{Object.values(test.queries).length} Queries</p>
              </div>
            </Link>
          ))}

        {tests.length === 0 && (
          <div className="flex justify-center items-center flex-col w-full">
            <Lottie animationData={lottieAnimation} />
          </div>
        )}
      </div>

      <div className="flex justify-center items-center p-2">
        <Pagination
          variant="outlined"
          color="primary"
          showLastButton
          showFirstButton
          count={pagesAmount}
          onChange={handlePagesChange}
        />
      </div>
    </div>
  );
}

export default Tests;
