import React, { useCallback, useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import CreatableSelect from "react-select/creatable";

import { useOrderedCollection } from "../hooks/useOrderedCollection";

function Books() {
  const { orderedDocuments } = useOrderedCollection("books");

  const setBooks = useCallback((pagesObjects) => {
    return pagesObjects;
  }, []);

  const categoryTypes = [
    { value: "All", label: "All" },
    { value: "Fiction", label: "Fiction" },
    { value: "Non-fiction", label: "Non-fiction" },
    { value: "Crime", label: "Crime" },
    {
      value: "Science fiction and fantasy",
      label: "Science fiction and fantasy",
    },
    {
      value: "Children's and young adult literature",
      label: "Children's and young adult literature",
    },
    {
      value: "Travel and adventure literature",
      label: "Travel and adventure literature",
    },
    {
      value: "Popular science and popular history",
      label: "Popular science and popular history",
    },
    {
      value: "Self-help and personal development",
      label: "Self-help and personal development",
    },
    {
      value: "History and culture",
      label: "History and culture",
    },
    { value: "Art and design", label: "Art and design" },
    { value: "Business and economics", label: "Business and economics" },
    { value: "Psychology and philosophy", label: "Psychology and philosophy" },
    { value: "Health and medicine", label: "Health and medicine" },
    { value: "Erotic literature", label: "Erotic literature" },
  ];

  const sortTypes = [
    { label: "Default", value: "" },
    { label: "Pages (descending)", value: "pages-desc" },
    { label: "Pages (ascending)", value: "pages-asc" },
    { label: "Time (descending)", value: "time-desc" },
    { label: "Time (ascending)", value: "time-asc" },
  ];

  const timeAsc = (a, b) => {
    return (
      a.createdBy.createdAt.toDate().getTime() -
      b.createdBy.createdAt.toDate().getTime()
    );
  };

  const timeDesc = (a, b) => {
    return (
      b.createdBy.createdAt.toDate().getTime() -
      a.createdBy.createdAt.toDate().getTime()
    );
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

  // eslint-disable-next-line react-hooks/exhaustive-deps

  const [sortParam, setSortParam] = useState("All");
  const [sortType, setSortType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const objectsOnPage = () => {
    if (document.body.offsetWidth <= 425) {
      return 4;
    } else if (
      425 < document.body.offsetWidth &&
      document.body.offsetWidth <= 767
    ) {
      return 4;
    } else if (
      document.body.offsetWidth > 768 &&
      document.body.offsetWidth <= 1024
    ) {
      return 6;
    } else if (
      document.body.offsetWidth >= 1025 &&
      document.body.offsetWidth <= 1560
    ) {
      return 8;
    } else {
      return 10;
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const nextPage = () => {
    if (currentPage < pagesAmount) {
      setCurrentPage(currentPage + 1);
      const pageObjects = fetchObjects(currentPage + 1);
      setBooks(pageObjects);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const pageObjects = fetchObjects(currentPage - 1);
      setBooks(pageObjects);
    }
  };

  useEffect(() => {
    const pageObjects = fetchObjects(currentPage);
    setBooks(pageObjects);
    sortBooksBy(sortType);
  }, [currentPage, fetchObjects, sortBooksBy, sortType, setBooks]);

  let books = setBooks(fetchObjects(currentPage));

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {
        <h2>
          {sortedArray.length > 0
            ? `There are ${sortedArray.length} books from ${
                sortParam === "" ? "all categories" : sortParam
              } read now 😁`
            : `No books from ${sortParam} read now 😨`}
        </h2>
      }

      <div className="sort-section">
        Filter by: {sortParam === "All" ? "everything" : sortParam}
        <label>
          <span>Category:</span>
          <CreatableSelect
            required
            className="select-input"
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
        <label>
          <span>Sort by: {sortType === "" ? "everything" : sortType}</span>
          <CreatableSelect
            required
            className="select-input"
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

      <div className={sortedArray.length > 0 ? "books-holder" : "sort-section"}>
        {books && books.length > 0 ? (
          books.map((doc, i) => (
            <Link to={`/book/${doc.id}`} key={i}>
              <div key={i} className="book">
                <div className="prev-cover">
                  <img src={doc.photoURL && doc.photoURL} alt="cover" />
                </div>

                <h4> {doc.title}</h4>
                <p>Author: {doc.author}</p>
                <small>
                  Added by: {doc.createdBy.displayName}, at:
                  <br />
                  {doc.createdBy.createdAt.toDate().toDateString()}
                </small>
              </div>
            </Link>
          ))
        ) : (
          <>
            {sortedArray.length === 0 && (
              <div className="buttons">
                <h2>No results on {sortParam} has been found.</h2>
              </div>
            )}
          </>
        )}
      </div>

      <p>
        {currentPage}/{pagesAmount}
      </p>

      <div className="pages-buttons">
        {currentPage > 1 && (
          <button className="btn" onClick={previousPage}>
            <FaArrowLeft /> Previous
          </button>
        )}

        {currentPage < pagesAmount && (
          <button className="btn" onClick={nextPage}>
            Next <FaArrowRight />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default Books;
