import React from "react";

import { motion } from "framer-motion";
import { FaX } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import translations from "../../assets/translations/BookPageTranslations.json";
import reuseableTranslations from "../../assets/translations/ReusableTranslations.json";

function LikersList({ likers, likesAmount, closeList }) {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full fixed top-0 left-0 bg-imgCover z-[99999]"
    >
      <button
        onClick={closeList}
        className="absolute btn btn-error top-0 right-0 m-6 text-white"
      >
        <FaX />
        {reuseableTranslations.closeBtn[selectedLanguage]}
      </button>

      <div className="absolute flex flex-col bg-accColor rounded-lg sm:w-full md:w-2/3 lg:w-1/3 2xl:w-1/4 p-4 gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <p className="text-xl font-medium text-white text-center">
          {likesAmount} {translations.andPersons.part2[selectedLanguage]}
        </p>
        {likers &&
          likers.map((liker) => (
            <Link key={liker.lovedBy} to={`/profile/${liker.lovedBy}`}>
              <div className="flex gap-2 items-center text-white">
                <img
                  className="w-16 h-16 rounded-full object-cover"
                  src={liker.photoURL}
                  alt={liker.lovedBy}
                />
                <p>{liker.displayName}</p>
              </div>
            </Link>
          ))}
      </div>
    </motion.div>
  );
}

export default LikersList;
