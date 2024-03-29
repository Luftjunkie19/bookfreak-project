import '../../pages/stylings/backgrounds.css';

import React from 'react';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import translations from '../../assets/translations/homePageTranslations.json';
import useGetDocuments from '../../hooks/useGetDocuments';

function HomeBooks() {
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
const {documents}=useGetDocuments('books');

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
        <h2 className={`text-4xl ${isDarkModed ? "text-white" :"text-black"} font-bold p-2`}>
          {documents.length > 0
            ? `${translations.homePage.recentTexts.books[selectedLangugage]}`
            : "No books yet added"}
        </h2>
      )}
      <div className="sm:grid sm:grid-flow-col snap-always snap-inline sm:auto-cols-[100%] md:auto-cols-[67%] lg:auto-cols-[41%] sm:overflow-x-auto xl:flex xl:items-center w-full py-8 px-4 gap-5">
        {documents.length > 0 &&
          documents.slice(0, getRightNumber()).map((doc, i) => (
            <Link
              to={`/book/${doc.id}`}
              key={i}
              className={`flex justify-between items-center group xl:w-2/5 2xl:w-1/4 h-60 bg-accColor rounded-md hover:-translate-y-1 duration-500 transition-all ${isDarkModed ? "hover:bg-white hover:text-accColor shadow-slate-50 " :"hover:bg-primeColor hover:text-white shadow-slate-950"} shadow-md   hover:shadow-black hover:shadow-md sm:snap-start`}
            >
              <div className={`w-2/5 sm:h-full 2xl:h-[115%] relative top-0 left-0 shadow-md ${isDarkModed ? "shadow-white" :"shadow-slate-950"} rounded-md`}>
                <img
                  className="absolute -top-2 left-0 w-full h-full object-cover rounded-sm "
                  src={`${doc.photoURL}`}
                  alt="book cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-around pr-2 w-1/2 h-full">
                <div className="">
                  <p className={`font-bold text-xl ${isDarkModed ? "group-hover:text-accColor" :"text-white"} text-white`}>
                    {doc.title.trim("").length > 10
                      ? `${doc.title.slice(0, 10)}...`
                      : doc.title}
                  </p>
                  <p className={`font-extralight ${isDarkModed ? "group-hover:text-accColor" :"text-white"} text-white`}>
                    {translations.homePage.bookObject.by[selectedLangugage]}:{" "}
                    {doc.author}
                  </p>
                </div>

                <div className={`${isDarkModed ? "group-hover:text-accColor" :"text-white"} text-white`}>
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

 
      </div>
    </>
  );
}

export default HomeBooks;
