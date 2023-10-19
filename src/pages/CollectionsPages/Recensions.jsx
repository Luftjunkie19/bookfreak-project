import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Pagination } from "@mui/material";

import translations from "../../assets/translations/RecensionsTranslations.json";
import reuseableTranslations from "../../assets/translations/ReusableTranslations.json";
import { useCollection } from "../../hooks/useCollection";

function Recensions() {
  const { documents } = useCollection("books");
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  let recensionedBooks = documents.filter((book) => {
    return (
      book.readers.length > 0 &&
      book.readers.some(
        (reader) =>
          reader.hasFinished &&
          reader.pagesRead === book.pagesNumber &&
          reader.recension.trim() !== ""
      )
    );
  });

  return (
    <div className="min-h-screen h-full overflow-x-hidden">
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
      </h2>

      <div className="flex w-full  md:justify-start md:items-start flex-wrap gap-4 m-6">
        {recensionedBooks &&
          recensionedBooks.map((book) => (
            <Link
              className="sm:w-[43%] 2xl:w-[10%] xl:w-[15%] md:w-[30%] lg:w-[23%] flex flex-col group duration-500 transition-all hover:-translate-y-1 hover:bg-lightModeCol hover:text-accColor items-center bg-accColor text-white"
              to={`/book/${book.id}`}
              key={book.id}
            >
              <div className="w-full h-48">
                <img
                  className="w-full h-full object-cover"
                  src={book.photoURL}
                  alt=""
                />
              </div>
              <div className="flex flex-col gap-2 p-4 self-start">
                <p className="font-bold">{book.title}</p>
                <p>
                  {
                    book.readers.filter(
                      (reader) =>
                        reader.hasFinished && reader.recension.trim() !== ""
                    ).length
                  }{" "}
                  {book.readers.filter(
                    (reader) =>
                      reader.hasFinished && reader.recension.trim() !== ""
                  ).length > 1
                    ? `${translations.moreRecensions[selectedLanguage]}`
                    : `${translations.oneRecension[selectedLanguage]}`}
                </p>
                <p className="flex items-center gap-4 font-semibold">
                  <FaStar className="text-2xl text-yellow-400" />
                  {(
                    book.readers.reduce(
                      (prev, current) => prev + current.bookRate,
                      0
                    ) /
                    book.readers.filter(
                      (reader) =>
                        reader.hasFinished &&
                        reader.pagesRead === book.pagesNumber
                    ).length
                  ).toFixed(1)}
                </p>
              </div>
            </Link>
          ))}
      </div>

      <div className="flex justify-center items-center p-2">
        <Pagination
          variant="outlined"
          color="primary"
          showLastButton
          showFirstButton
          count={2}
        />
      </div>
    </div>
  );
}

export default Recensions;
