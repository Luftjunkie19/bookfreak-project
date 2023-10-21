import React from "react";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import translations from "../../assets/translations/ProfileTranslations.json";
import { useCollection } from "../../hooks/useCollection";

function FavouriteBooks({ id }) {
  const { documents } = useCollection("books");
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  return (
    <div>
      <div className="flex justify-around items-center flex-wrap gap-3">
        {documents &&
          documents.length > 0 &&
          documents
            .filter((doc) =>
              doc.likesData.likedBy.find((reader) => reader.uid === id)
            )
            .map((doc, i) => (
              <Link to={`/book/${doc.id}`} key={doc.id}>
                <div key={i} className="rounded-lg relative top-0 left-0">
                  <img
                    src={doc.photoURL}
                    alt=""
                    className="rounded-lg w-32 h-40 object-cover"
                  />
                  <div className="absolute p-1 w-full rounded-b-lg bg-modalAccColor h-1/3 bottom-0 left-0">
                    <p className=" font-bold text-white">
                      {doc.title.trim(" ").length > 10
                        ? `${doc.title.slice(0, 10)}...`
                        : doc.title}
                    </p>
                    <p className=" text-sm text-white">{doc.author}</p>
                  </div>
                </div>
              </Link>
            ))}

        {documents &&
          documents.filter((doc) =>
            doc.likesData.likedBy.find((reader) => reader.uid === id)
          ).length === 0 && (
            <p className="text-center">
              {translations.emptyNotifications.favourited[selectedLanguage]}
            </p>
          )}
      </div>
    </div>
  );
}

export default FavouriteBooks;
