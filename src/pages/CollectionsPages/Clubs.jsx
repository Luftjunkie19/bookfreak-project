import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Pagination } from "@mui/material";

import clubsTranslations from "../../assets/translations/ClubsTranslations.json";
import useRealtimeDocuments from "../../hooks/useRealtimeDocuments";

function Clubs() {
  const { getDocuments } = useRealtimeDocuments();
  const [documents, setElements] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadElements = async () => {
    const booksEl = await getDocuments("readersClubs");
    setElements(booksEl);
  };

  useEffect(() => {
    loadElements();
  }, [loadElements]);

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  return (
    <div className="min-h-screen h-full">
      <h2 className="text-2xl text-center font-semibold py-2 text-white">
        {documents && documents.length && documents.length}{" "}
        {documents && documents.length > 1
          ? `${clubsTranslations.clubObject.quantity.more[selectedLanguage]}`
          : `${clubsTranslations.clubObject.quantity.one[selectedLanguage]}`}{" "}
        {documents && documents.length > 1
          ? `${clubsTranslations.clubObject.founded.more[selectedLanguage]}`
          : `${clubsTranslations.clubObject.founded.one[selectedLanguage]}`}
      </h2>
      <div className="flex items-center flex-wrap gap-4 p-2 my-8 mx-4">
        {documents && documents.length ? (
          documents.map((doc) => (
            <Link
              to={`/readers-clubs/${doc.id}`}
              key={doc.id}
              className="flex xl:w-1/6 sm:w-[47%] md:w-[30%] lg:w-1/6 items-center gap-2 group p-2 rounded-lg overflow-hidden hover:shadow-md hover:shadow-black hover:bg-lightModeCol bg-accColor hover:scale-[1.01] duration-200 transition-all"
            >
              <img
                src={doc.clubLogo}
                alt=""
                referrerPolicy="no-referrer"
                className="w-16 h-16 object-cover rounded-full group-hover:scale-95 duration-200 transition-all"
              />

              <div className="flex gap-2 flex-col text-white group-hover:text-primeColor p-4">
                <p className="text-lg font-semibold">{doc.clubsName}</p>
                {/*  <p>
                  {doc.users.length}{" "}
                  {clubsTranslations.clubObject.members[selectedLanguage]}
          </p>*/}
              </div>
            </Link>
          ))
        ) : (
          <p>No clubs added yet</p>
        )}
      </div>

      {/**
       .map((member) => {
            return documents.filter((book) => {
              return book.readers.find(
                (reader) =>
                  reader.id === member.value.id &&
                  reader.pagesRead === book.pagesNumber
              );
            });
          })
          .map((array) =>
            array.reduce((prev, cur) => prev + cur?.pagesNumber, 0)
          )
          .reduce((prev, cur) => prev + cur, 0) 
       
       */}

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

export default Clubs;
