import React from "react";

import { FaBookOpen, FaUserAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import translations from "../../assets/translations/SearchTranslations.json";

function SearchOption() {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  return (
    <div className="min-h-screen h-full flex flex-col justify-center items-center">
      <h2 className="text-4xl font-extrabold text-center text-white mb-6">
        {translations.title[selectedLanguage]}
      </h2>

      <div className="flex justify-around items-center sm:flex-col xl:flex-row w-1/2 p-4">
        <Link
          className="btn btn-wide bg-sky-600 hover:bg-sky-800 text-white border-none my-2"
          to="/search/users"
        >
          <FaUserAlt className="mr-2 text-xl" />
          {translations.options.users[selectedLanguage]}
        </Link>
        <Link
          className="btn btn-wide bg-sky-600 hover:bg-sky-800 text-white border-none"
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
