import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import reuseableTranslations from "../../assets/translations/ReusableTranslations.json";
import useRealtimeDocuments from "../../hooks/useRealtimeDocuments";

function AuthorProfile() {
  const { authorName } = useParams();
  const [books, setBooks] = useState([]);
  const [data, setData] = useState(null);
  const { getDocuments } = useRealtimeDocuments();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dataAboutAuthor = async () => {
    try {
      const showItem = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${authorName}`;
      const data = await fetch(showItem);

      const finalData = await data.json();

      if (finalData.query.search[0]) {
        setData(finalData.query.search[0]);
      }
    } catch (error) {
      console.log(error);
      //=> Typeof wikiError
    }
  };

  const getImage = async () => {
    try {
      const data = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${authorName}&limit=20&callback=?`
      );
      const dataElements = await data.json();
      console.log(dataElements);
    } catch (error) {}
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadBooks = async () => {
    const bookEls = await getDocuments("books");

    if (bookEls) {
      setBooks(bookEls);
    }
  };
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    dataAboutAuthor();
  }, [dataAboutAuthor]);

  return (
    <div className="min-h-screen h-full w-full realtive top-0 left-0">
      <div className="flex justify-around mx-auto items-center w-full sm:flex-col lg:flex-row p-3 gap-5">
        <div className="w-40 h-50">
          <img
            src="https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
            alt=""
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 justify-center xl:w-1/2">
          <p className=" text-white text-3xl">{authorName}</p>

          {data && (
            <>
              <p className="text-white text-lg">Biography:</p>
              <div
                className="p-1 sm:w-full lg:w-3/5 italic font-medium text-white"
                dangerouslySetInnerHTML={{ __html: data.snippet }}
              />
            </>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col p-1">
        <p className="sm:text-xl self-center text-white lg:text-2xl font-semibold p-2">
          Books
        </p>
        <div className="max-w-[90rem] flex flex-wrap justify-center items-center gap-3">
          {books.filter((book) => book.author === authorName).length > 0 &&
            books
              .filter((book) => book.author === authorName)
              .map((book, i) => (
                <Link
                  to={`/book/${book.id}`}
                  key={i}
                  className=" xl:w-[15%] sm:w-[45%] md:w-[30%] lg:w-1/6  flex items-center flex-col bg-accColor rounded-md"
                >
                  <div className="w-full">
                    <img
                      className="w-full h-full rounded-t-lg"
                      src={book.photoURL}
                      alt=""
                    />
                  </div>

                  <div className="flex flex-col w-full h-full text-white p-2">
                    <p className="font-bold text-sm xl:text-base">
                      {book.title.trim(" ").length > 10
                        ? `${book.title.slice(0, 10)}...`
                        : book.title}
                    </p>
                    <p className="text-xs">
                      {book.author.trim(" ").length > 12
                        ? `${book.author.slice(0, 12)}...`
                        : book.author}
                    </p>

                    <p className="text-xs">
                      {book.pagesNumber}{" "}
                      {reuseableTranslations.pagesText[selectedLanguage]}
                    </p>
                    <p className="text-xs">
                      {book.category.trim(" ").length > 15
                        ? `${book.category.slice(0, 15)}...`
                        : book.category}
                    </p>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}

export default AuthorProfile;
