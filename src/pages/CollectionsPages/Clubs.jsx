import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';
import {
  Link,
  useSearchParams,
} from 'react-router-dom';

import {
  Autocomplete,
  Pagination,
  TextField,
} from '@mui/material';

import lottieAnimation
  from '../../assets/lottieAnimations/Animation - 1700320134586.json';
import clubsTranslations
  from '../../assets/translations/ClubsTranslations.json';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

function Clubs() {
  const { getDocuments } = useRealtimeDocuments();
  const [documents, setElements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadElements = async () => {
    const booksEl = await getDocuments("readersClubs");
    setElements(booksEl);
  };

  const objectsOnPage = () => {
    if (document.body.clientWidth > 0 && document.body.clientWidth < 1024) {
      return 10;
    } else {
      return 45;
    }
  };
  const fetchObjects = useCallback(
    (page) => {
      const start = (page - 1) * objectsOnPage();
      const end = start + objectsOnPage();
      const pageObjects = documents.slice(start, end);
      return pageObjects;
    },
    [documents]
  );

  const handlePagesChange = (e, value) => {
    if (currentPage < pagesAmount) {
      setCurrentPage(currentPage + 1);
      const pageObjects = fetchObjects(currentPage + 1);
      setElements(pageObjects);
      return;
    }

    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const pageObjects = fetchObjects(currentPage - 1);
      setElements(pageObjects);
      return;
    }
    setCurrentPage(value);
  };

  const pagesAmount = Math.ceil(documents.length / objectsOnPage());

  useEffect(() => {
    loadElements();
  }, [loadElements]);

  useEffect(() => {
    if (documents.length > 0) {
      const fetchedObjects = fetchObjects(currentPage);
      setElements(fetchedObjects);
    }
  }, [currentPage, documents, fetchObjects]);

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  const [filterQuery, setFilterQuery] = useSearchParams({ filters: "" });

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
      <div className="flex w-full justify-center items-center">
        <Autocomplete
          className="sm:w-3/4 md:max-w-sm"
          onChange={(e, value) => {
            if (value === null) {
              setFilterQuery(
                (prev) => {
                  prev.set("filters", "");
                  return prev;
                },
                { replace: true }
              );
              return;
            }
            setFilterQuery(
              (prev) => {
                prev.set("filters", value);
                return prev;
              },
              { replace: true }
            );
          }}
          sx={{
            ".MuiAutocomplete-input": {
              color: "white",
            },
            ".MuiAutocomplete-inputRoot": {
              background: "#4267B5",
            },

            ".MuiAutocomplete-inputFocused": {
              borderColor: "#FFF",
            },
          }}
          id="free-solo-demo"
          freeSolo
          options={documents.map((option) => option.clubsName)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Club's name"
              onChange={(e, value) => {
                setFilterQuery(
                  (prev) => {
                    prev.set("filters", e.target.value);
                    return prev;
                  },
                  { replace: true }
                );
              }}
            />
          )}
        />
      </div>
      <div className="flex sm:justify-center md:justify-start items-center flex-wrap gap-4 p-2 my-8 mx-4">
        {documents &&
          documents.length > 0 &&
          documents
            .filter((doc) =>
              doc.clubsName
                .toLowerCase()
                .includes(filterQuery.get("filters").toLowerCase())
            )
            .map((doc) => (
              <Link
                to={`/readers-clubs/${doc.id}`}
                key={doc.id}
                className="flex sm:flex-col 2xl:flex-row xl:w-1/6 sm:w-4/5 md:w-[47%] lg:w-1/5 items-center gap-2 group p-2 rounded-lg overflow-hidden hover:shadow-md hover:shadow-black hover:bg-lightModeCol bg-accColor hover:scale-[1.01] duration-200 transition-all"
              >
                <img
                  src={doc.clubLogo}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover self-start rounded-full group-hover:scale-95 duration-200 transition-all"
                />

                <div className="flex gap-2 flex-col text-white group-hover:text-primeColor p-4">
                  <p className="text-lg font-semibold">{doc.clubsName}</p>
                </div>
              </Link>
            ))}

        {documents.filter((doc) =>
          doc.clubsName
            .toLowerCase()
            .includes(filterQuery.get("filters").toLowerCase())
        ).length === 0 && (
          <div className="flex w-full flex-col justify-center items-center gap-3">
            <Lottie animationData={lottieAnimation} />
            <p className="text-2xl font-bold text-white text-center">
              No data available
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center p-2">
        <Pagination
          variant="outlined"
          color="primary"
          showLastButton
          showFirstButton
          count={pagesAmount}
          onChange={handlePagesChange}
        />
      </div>
    </div>
  );
}

export default Clubs;
