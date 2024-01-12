import React from 'react';

import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import reuseableTranslations
  from '../../assets/translations/ReusableTranslations.json';
import useGetDocuments from '../../hooks/useGetDocuments';

function AuthorProfile() {
  const { authorName } = useParams();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
const {documents:books}=useGetDocuments('books');


 

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

<div className="">{reuseableTranslations.authorDescription[selectedLanguage]} {authorName}</div>
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
