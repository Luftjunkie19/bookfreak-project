import React from 'react';

import { Link } from 'react-router-dom';

function Book({doc, i, translateText}) {
  return (
    <Link
              to={`/book/${doc.id}`}
              key={i}
              className="2xl:w-[10%] xl:w-[15%] sm:w-[47%] md:w-[30%] lg:w-1/6  flex items-center flex-col bg-accColor rounded-md"
            >
              <div className="w-full h-32">
                <img
                  className="w-full h-full object-cover rounded-t-lg"
                  src={doc.photoURL}
                  alt=""
                />
              </div>

              <div className="flex flex-col w-full h-full text-white p-2">
                <p className="font-bold text-sm xl:text-base">
                  {doc.title.trim(" ").length > 10
                    ? `${doc.title.slice(0, 10)}...`
                    : doc.title}
                </p>
                <p className="text-xs">
                  {doc.author.trim(" ").length > 12
                    ? `${doc.author.slice(0, 12)}...`
                    : doc.author}
                </p>

                <p className="text-xs">
                  {doc.pagesNumber}{" "}
                  {translateText}
                </p>
                <p className="text-xs">
                  {doc.category.trim(" ").length > 15
                    ? `${doc.category.slice(0, 15)}...`
                    : doc.category}
                </p>
              </div>
            </Link>
  )
}

export default Book