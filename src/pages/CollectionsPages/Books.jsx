import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

import { Pagination } from '@mui/material';

import lottieAnimation
  from '../../assets/lottieAnimations/Animation - 1700320134586.json';
import reuseableTranslations
  from '../../assets/translations/ReusableTranslations.json';
import translations from '../../assets/translations/SearchTranslations.json';
import typesTranslation from '../../assets/translations/TypesTranslations.json';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

function Books() {
  const { getDocuments } = useRealtimeDocuments();
  const [orderedDocuments, setElements] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadElements = async () => {
    const booksEl = await getDocuments("books");
    setElements(booksEl);
  };

  useEffect(() => {
    loadElements();
  }, [loadElements]);

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const setBooks = useCallback((pagesObjects) => {
    return pagesObjects;
  }, []);

  const categoryTypes = [
    { value: "All", label: typesTranslation.bookFilter.all[selectedLanguage] },
    {
      value: "Fiction",
      label: typesTranslation.bookFilter.fiction[selectedLanguage],
    },
    {
      value: "Non-fiction",
      label: typesTranslation.bookFilter["non-fiction"][selectedLanguage],
    },
    {
      value: "Crime",
      label: typesTranslation.bookFilter.crime[selectedLanguage],
    },
    {
      value: "Science fiction and fantasy",
      label: typesTranslation.bookFilter.scienceFF[selectedLanguage],
    },
    {
      value: "Children's and young adult literature",
      label: typesTranslation.bookFilter.cayal[selectedLanguage],
    },
    {
      value: "Travel and adventure literature",
      label: typesTranslation.bookFilter.travelaal[selectedLanguage],
    },
    {
      value: "Popular science and popular history",
      label: typesTranslation.bookFilter.popularScience[selectedLanguage],
    },
    {
      value: "Self-help and personal development",
      label: typesTranslation.bookFilter.selfHelp[selectedLanguage],
    },
    {
      value: "History and culture",
      label: typesTranslation.bookFilter.history[selectedLanguage],
    },
    {
      value: "Art and design",
      label: typesTranslation.bookFilter.artDesign[selectedLanguage],
    },
    {
      value: "Business and economics",
      label: typesTranslation.bookFilter.Business[selectedLanguage],
    },
    {
      value: "Psychology and philosophy",
      label: typesTranslation.bookFilter.Psychology[selectedLanguage],
    },
    {
      value: "Health and medicine",
      label: typesTranslation.bookFilter.Health[selectedLanguage],
    },
    {
      value: "Erotic literature",
      label: typesTranslation.bookFilter.Erotic[selectedLanguage],
    },
  ];

  const sortTypes = [
    { label: typesTranslation.bookSort.Default[selectedLanguage], value: "" },
    {
      label: typesTranslation.bookSort.pagesDescending[selectedLanguage],
      value: "pages-desc",
    },
    {
      label: typesTranslation.bookSort.pagesAscending[selectedLanguage],
      value: "pages-asc",
    },
    {
      label: typesTranslation.bookSort.timeDesc[selectedLanguage],
      value: "time-desc",
    },
    {
      label: typesTranslation.bookSort.timeAsc[selectedLanguage],
      value: "time-asc",
    },
  ];

  const timeAsc = (a, b) => {
    return a.createdBy.createdAt - b.createdBy.createdAt;
  };

  const timeDesc = (a, b) => {
    return b.createdBy.createdAt - a.createdBy.createdAt;
  };

  const pagesDesc = (a, b) => {
    return b.pagesNumber - a.pagesNumber;
  };

  const pagesAsc = (a, b) => {
    return a.pagesNumber - b.pagesNumber;
  };

  const undefinedCase = (a, b) => {
    return a - b;
  };

  const [sortParam, setSortParam] = useState("All");
  const [sortType, setSortType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const objectsOnPage = () => {
    if (document.body.clientWidth > 0 && document.body.clientWidth < 1024) {
      return 10;
    } else {
      return 45;
    }
  };

  const filterBooks = useCallback(
    (param) => {
      if (param === "All" || param === "") {
        return orderedDocuments;
      }

      const sortedBy = orderedDocuments.filter(
        (book) => book.category === param
      );
      return sortedBy;
    },
    [orderedDocuments]
  );

  let sortedArray = filterBooks(sortParam);

  const sortBooksBy = useCallback(
    (type) => {
      let sortType;
      switch (type) {
        case "time-asc":
          sortType = timeAsc;
          break;
        case "time-desc":
          sortType = timeDesc;
          break;
        case "pages-desc":
          sortType = pagesDesc;
          break;
        case "pages-asc":
          sortType = pagesAsc;
          break;
        default:
          sortType = undefinedCase;
      }

      return sortType !== "" ? sortedArray.sort(sortType) : sortedArray;
    },
    [sortedArray]
  );

  const memoizedBooks = useMemo(() => {
    return sortBooksBy(sortType);
  }, [sortBooksBy, sortType]);

  const pagesAmount = Math.ceil(sortedArray.length / objectsOnPage());

  const fetchObjects = useCallback(
    (page) => {
      const start = (page - 1) * objectsOnPage();
      const end = start + objectsOnPage();
      const pageObjects = memoizedBooks.slice(start, end);
      return pageObjects;
    },
    [memoizedBooks]
  );

  const handlePagesChange = (e, value) => {
    if (currentPage < pagesAmount) {
      setCurrentPage(currentPage + 1);
      const pageObjects = fetchObjects(currentPage + 1);
      setBooks(pageObjects);
      return;
    }

    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const pageObjects = fetchObjects(currentPage - 1);
      setBooks(pageObjects);
      return;
    }

    setCurrentPage(value);
  };

  useEffect(() => {
    const pageObjects = fetchObjects(currentPage);
    setBooks(pageObjects);
    sortBooksBy(sortType);
  }, [currentPage, fetchObjects, sortBooksBy, sortType, setBooks]);

  let books = setBooks(fetchObjects(currentPage));

  return (
    <div className="min-h-screen h-full">
      <div className="flex sm:flex-col lg:flex-row justify-around items-center p-3 w-full">
        <label className="flex flex-col sm:w-full  lg:w-1/3">
          <span>{reuseableTranslations.categoryText[selectedLanguage]}:</span>
          <CreatableSelect
            className="w-full"
         
            isClearable
            isSearchable
            options={categoryTypes}
            onChange={(e) => {
              const selectedOption =
                e && e.value ? e : { value: "", label: "" };
              setSortParam(selectedOption.value);
            }}
          />
        </label>
        <label className="flex flex-col sm:w-full lg:w-1/3">
          <span>
            {reuseableTranslations.sortTexts[selectedLanguage]}:{" "}
            {sortType === "" ? "everything" : sortType}
          </span>
          <CreatableSelect
            className="w-full"

            isClearable
            isSearchable
            options={sortTypes}
            onChange={(e) => {
              const selectedOption =
                e && e.value ? e : { value: "", label: "" };

              setSortType(selectedOption.value);
            }}
          />
        </label>
      </div>

      <div className="flex flex-wrap w-screen lg:flex-row gap-4 justify-center items-center p-4">
        {books && books.length > 0 ? (
          books.map((doc, i) => (
            <Link
              to={`/book/${doc.id}`}
              key={i}
              className="2xl:w-[10%] xl:w-[15%] sm:w-[47%] md:w-[30%] lg:w-1/6  flex items-center flex-col bg-accColor rounded-md"
            >
              <div className="w-full">
                <img
                  className="w-full h-full rounded-t-lg"
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
                  {reuseableTranslations.pagesText[selectedLanguage]}
                </p>
                <p className="text-xs">
                  {doc.category.trim(" ").length > 15
                    ? `${doc.category.slice(0, 15)}...`
                    : doc.category}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <>
            {sortedArray.length === 0 && (
              <div className="w-full flex flex-col justify-center items-center">
                <h2>
                  {translations.noResults[selectedLanguage]} {sortParam}
                </h2>
                <Lottie animationData={lottieAnimation} />
              </div>
            )}
          </>
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

export default Books;
