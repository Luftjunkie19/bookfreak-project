import '../../pages/stylings/backgrounds.css';

import React, {
  useEffect,
  useState,
} from 'react';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import translations from '../../assets/translations/homePageTranslations.json';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';
import SkeletonBook from '../SkeletonsObjects/SkeletonBook';

function HomeBooks() {
  const { getDocuments, loadingDocs } = useRealtimeDocuments();
  const [documents, setElements] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadElements = async () => {
    const booksEl = await getDocuments("books");
    setElements(booksEl);
  };

  useEffect(() => {
    loadElements();
  }, []);
  const selectedLangugage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  const getRightNumber = () => {
    if (window.innerWidth > 0 && window.innerWidth < 1024) {
      return 8;
    } else {
      return 4;
    }
  };

  return (
    <>
      {documents && (
        <h2 className="text-4xl text-white font-bold p-2">
          {documents.length > 0
            ? `${translations.homePage.recentTexts.books[selectedLangugage]}`
            : "No books yet added"}
        </h2>
      )}
      <div className="sm:grid sm:grid-flow-col snap-always snap-inline sm:auto-cols-[100%] md:auto-cols-[67%] lg:auto-cols-[41%] sm:overflow-x-auto xl:flex xl:items-center w-full py-8 px-4 gap-5">
        {documents.length > 0 &&
          !loadingDocs &&
          documents.slice(0, getRightNumber()).map((doc, i) => (
            <Link
              to={`/book/${doc.id}`}
              key={i}
              className="flex justify-between items-center group xl:w-2/5 2xl:w-1/4 h-60 bg-accColor rounded-md hover:-translate-y-1 duration-500 transition-all shadow-md shadow-slate-50 hover:bg-white hover:text-accColor hover:shadow-black hover:shadow-md sm:snap-start"
            >
              <div className="w-2/5 sm:h-full 2xl:h-[115%] relative top-0 left-0 book-shadow rounded-md">
                <img
                  className="absolute -top-2 left-0 w-full h-full object-cover rounded-sm "
                  src={`${doc.photoURL}`}
                  alt="book cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-around pr-2 w-1/2 h-full">
                <div className="">
                  <p className="font-bold text-xl text-white group-hover:text-accColor">
                    {doc.title.trim("").length > 10
                      ? `${doc.title.slice(0, 10)}...`
                      : doc.title}
                  </p>
                  <p className="font-extralight text-white group-hover:text-accColor">
                    {translations.homePage.bookObject.by[selectedLangugage]}:{" "}
                    {doc.author}
                  </p>
                </div>

                <div className="">
                  <p>
                    {doc.pagesNumber}{" "}
                    {translations.homePage.bookObject.pages[selectedLangugage]}
                  </p>
                  <p>
                    {doc.category.trim("").length > 10
                      ? `${doc.category.slice(0, 10)}...`
                      : doc.category}
                  </p>
                </div>
              </div>
            </Link>
          ))}

        {loadingDocs &&
          Array.from(getRightNumber()).map((sceleton) => <SkeletonBook />)}
      </div>
    </>
  );
}

export default HomeBooks;
