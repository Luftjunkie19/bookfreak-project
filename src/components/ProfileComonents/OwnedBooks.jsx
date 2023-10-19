import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import translations from "../../assets/translations/ProfileTranslations.json";

function OwnedBooks({ ownedBooks, ownerId }) {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  return (
    <div className="flex items-center justify-center flex-wrap w-full gap-4 mx-2">
      {ownedBooks ? (
        ownedBooks
          .filter((doc) => {
            return (
              doc.readers.find((reader) => reader.id === ownerId) ||
              doc.createdBy.id === ownerId
            );
          })
          .map((book, i) => (
            <Link to={`/book/${book.id}`} key={book.id}>
              <div className="rounded-lg relative top-0 left-0" key={i}>
                <div className="absolute top-0 left-0 w-full h-full rounded-lg bg-imgCover flex justify-center items-center">
                  <p className=" font-extrabold text-lg text-white">
                    {(
                      book.readers &&
                      book.readers.find(
                        (reader) =>
                          reader.id === ownerId || book.createdBy.id === ownerId
                      )?.pagesRead / book.pagesNumber
                    ).toFixed(2) * 100}{" "}
                    %
                  </p>
                </div>
                <img
                  className="w-28 h-36 rounded-lg object-cover"
                  src={book.photoURL}
                  alt=""
                />
              </div>
            </Link>
          ))
      ) : (
        <p> {translations.emptyNotifications.books[selectedLanguage]}</p>
      )}
    </div>
  );
}

export default OwnedBooks;
