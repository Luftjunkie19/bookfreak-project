import '../stylings/backgrounds.css';

import React from 'react';

import {
  FaBookOpen,
  FaUserAlt,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import translations from '../../assets/translations/SearchTranslations.json';

function SearchOption() {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state) => state.mode.isDarkMode)
  return (
    <div className="min-h-screen h-full flex flex-col justify-center items-center pattern-bg">
      <h2 className={`text-4xl font-extrabold text-center mb-6 ${isDarkModed ? "text-white" : "text-black"}`}>
        {translations.title[selectedLanguage]}
      </h2>

      <div className="flex justify-around items-center sm:flex-col xl:flex-row w-1/2 p-4">
        <Link
          className="btn btn-wide bg-accColor hover:bg-primeColor text-white border-none my-2"
          to="/search/users"
        >
          <FaUserAlt className="mr-2 text-xl" />
          {translations.options.users[selectedLanguage]}
        </Link>
        <Link
          className="btn btn-wide bg-accColor hover:bg-primeColor text-white border-none"
          to="/search/books"
        >
          <FaBookOpen className="mr-2 text-xl" />
          {translations.options.books[selectedLanguage]}
        </Link>
      </div>
    </div>
  );
}

export default SearchOption;
