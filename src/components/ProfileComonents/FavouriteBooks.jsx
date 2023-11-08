import React from "react";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import translations from "../../assets/translations/ProfileTranslations.json";

function FavouriteBooks({ favBooks }) {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  return (
    <div>
      <div className="flex justify-around items-center flex-wrap gap-3">
        {favBooks.length > 0 &&
          favBooks.map((doc, i) => (
            <Link to={`/book/${doc.id}`} key={doc.id}>
              <div key={i} className="rounded-lg relative top-0 left-0">
                <img
                  src={doc.photoURL}
                  alt=""
                  className="rounded-lg w-32 h-40 object-cover"
                />
                <div className="absolute p-1 w-full rounded-b-lg bg-modalAccColor h-1/3 bottom-0 left-0">
                  <p className=" font-bold text-white">
                    {doc.title && doc.title.length > 10
                      ? `${doc.title.slice(0, 10)}...`
                      : doc.title}
                  </p>
                  <p className=" text-xs text-white">
                    {doc.author && doc.author.length > 20
                      ? `${doc.author.slice(0, 20)}...`
                      : doc.author}
                  </p>
                </div>
              </div>
            </Link>
          ))}

        {favBooks && favBooks.length === 0 && (
          <p className="text-center">
            {translations.emptyNotifications.favourited[selectedLanguage]}
          </p>
        )}
      </div>
    </div>
  );
}

export default FavouriteBooks;
