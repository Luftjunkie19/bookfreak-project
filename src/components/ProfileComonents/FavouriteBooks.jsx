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
                <div key={i} className="rounded-lg">
                  <img
                    src={doc.photoURL}
                    alt=""
                    className="rounded-lg w-32 h-40 object-cover"
                  />
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
