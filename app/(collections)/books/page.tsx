import '../stylings/backgrounds.css';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import {
  Autocomplete,
  Box,
  Pagination,
  PaginationItem,
  TextField,
} from '@mui/material';

import lottieAnimation
  from '../../assets/lottieAnimations/Animation - 1700320134586.json';
import formTranslations from '../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../assets/translations/ReusableTranslations.json';
import translations from '../../assets/translations/SearchTranslations.json';
import typesTranslation from '../../assets/translations/TypesTranslations.json';
import Book from '../../components/Items/Book';
import ManagementBar from '../../components/RecensionsComponents/ManagementBar';
import useGetDocuments from '../../hooks/useGetDocuments';

function Books() {
  const {documents: orderedDocuments}=useGetDocuments('books');
  const [filterQuery, setFilterQuery] = useSearchParams({ filters: "" });
  
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const setBooks = useCallback((pagesObjects) => {
    return pagesObjects;
  }, []);

  const categoryTypes = [
    {
      filter:(array)=>{
        return array.filter((book) => book.category ===  "Fiction");
      },
      label: typesTranslation.bookFilter.fiction[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Non-fiction");
      },
      label: typesTranslation.bookFilter["non-fiction"][selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "Crime");
      },
      label: typesTranslation.bookFilter.crime[selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "Science fiction and fantasy");
      },
      label: typesTranslation.bookFilter.scienceFF[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Children's and young adult literature");
      },
      label: typesTranslation.bookFilter.cayal[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Travel and adventure literature");
      },
      label: typesTranslation.bookFilter.travelaal[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Popular science and popular history");
      },
      label: typesTranslation.bookFilter.popularScience[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Self-help and personal development");
      },
      label: typesTranslation.bookFilter.selfHelp[selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "History and culture");
      },
      label: typesTranslation.bookFilter.history[selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "Art and design");
      },
      label: typesTranslation.bookFilter.artDesign[selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "Business and economics");
      },
      label: typesTranslation.bookFilter.Business[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Psychology and philosophy");
      },
      label: typesTranslation.bookFilter.Psychology[selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "Health and medicine");
      },
      label: typesTranslation.bookFilter.Health[selectedLanguage],
    },
    {
      filter:   (array)=>{
        return array.filter((book) => book.category === "Erotic literature");
      },
      label: typesTranslation.bookFilter.Erotic[selectedLanguage],
    },
  ];

  const sortTypes = [
    {
      label: typesTranslation.bookSort.Default[selectedLanguage],
      sort: (array) => array.slice().sort((a, b) => a.title - b.title),
    },
    {
      label: typesTranslation.bookSort.pagesDescending[selectedLanguage],
      sort: (array) => array.slice().sort((a, b) => b.pagesNumber - a.pagesNumber),
    },
    {
      label: typesTranslation.bookSort.pagesAscending[selectedLanguage],
      sort: (array) => array.slice().sort((a, b) => a.pagesNumber - b.pagesNumber),
    },
   
  ];

  
  const [currentPage, setCurrentPage] = useState(1);
  const objectsOnPage = () => {
    if (document.body.clientWidth > 0 && document.body.clientWidth < 1024) {
      return 10;
    } else {
      return 45;
    }
  };

  const pagesAmount = Math.ceil(orderedDocuments.length / objectsOnPage());

  const fetchObjects = useCallback(
    (page) => {
      const start = (page - 1) * objectsOnPage();
      const end = start + objectsOnPage();
      const pageObjects = orderedDocuments.slice(start, end);
      return pageObjects;
    },
    [orderedDocuments]
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
  }, [currentPage, fetchObjects, setBooks]);

  let books = setBooks(fetchObjects(currentPage));

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");
  
  const applyFilters = (filters) => {
    setSelectedFilters(filters);
    console.log(filters);
  };

  const applySort = (sort) => {
    setSelectedSort(sort);
  };
  
  const filteredArray=() => {
    if (selectedFilters.length > 0) {
      const filteredDocuments = selectedFilters.reduce((result, selectedFilter) => {
        const filterOption = categoryTypes.find(option => option.label === selectedFilter);
  
        if (filterOption) {
          const temp = filterOption.filter(result);
          return temp;
        }
  
        return result;
      }, books);
  
      return filteredDocuments;
    } else {
      return books;
    }
  };

const sortedArray=() => {
  if (selectedSort.trim("") !== "") {
    return sortTypes
      .find((option) => option.label === selectedSort)
      .sort(filteredArray())
  } else {
    return filteredArray();
  }
};
  return (
    <div className={`min-h-screen h-full ${!isDarkModed && "pattern-bg"}`}>
      <div className="flex flex-wrap gap-6 items-center p-3 w-full">
        <ManagementBar sortSelected={selectedSort} filtersSelected={selectedFilters} sortOptions={sortTypes} filterOptions={categoryTypes} applyFilters={applyFilters} applySort={applySort} filterText={reuseableTranslations.categoryText[selectedLanguage]} sortText={reuseableTranslations.sortTexts[selectedLanguage]}/>
        <Autocomplete
          className="sm:w-3/4 md:max-w-lg"
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
            color:"white",
            ".MuiAutocomplete-input": {
              color: "white",
            },
            ".MuiAutocomplete-inputRoot": {
              background: "#4267B5",
            },

            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              border: "0",
            },
          }}
          id="free-solo-demo"
          freeSolo
          options={books.map((option) => option.title)}
          renderOption={(props, option) => (<Box {...props} sx={{ color: 'white'}}>{option}</Box>)}
          renderInput={(params) => (
            <TextField
              sx={{ color: 'white'}}
              {...params}
         label={formTranslations.placeHoldersCollections.booksTitle[selectedLanguage]}
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

      <div className="flex flex-wrap w-screen lg:flex-row gap-4 justify-center items-center p-4">
        {sortedArray().filter((doc) =>
          doc.title
            .toLowerCase()
            .includes(filterQuery.get("filters").toLowerCase())
        ) && sortedArray().filter((doc) =>
          doc.title
            .toLowerCase()
            .includes(filterQuery.get("filters").toLowerCase())
        ).length > 0 ? (
          sortedArray().filter((doc) =>
          doc.title
            .toLowerCase()
            .includes(filterQuery.get("filters").toLowerCase())
        ).map((doc, i) => (
          <Book doc={doc} i={i} translateText={reuseableTranslations.pagesText[selectedLanguage]}/>
          ))
        ) : (
          <>
            {sortedArray().filter((doc) =>
          doc.title
            .toLowerCase()
            .includes(filterQuery.get("filters").toLowerCase())
        ).length === 0 && (
              <div className="w-full flex flex-col justify-center items-center">
                <h2 className="text-xl font-bold">
                  {translations.noResults[selectedLanguage]} {selectedFilters.length > 0 && <span className="font-semibold text-sm">{selectedFilters.join().split(", ").join()}</span>}
                </h2>
                <Lottie animationData={lottieAnimation} />
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex justify-center items-center p-2">
        <Pagination
          shape="rounded" 
          variant="outlined"
          color="primary"
          showLastButton
          showFirstButton
          count={pagesAmount}
          renderItem={(item) => (<PaginationItem sx={{
            backgroundColor: "#4267B5", color: 'white', ":active": {
              backgroundColor: "#1a2339",
           color: "#4267B5"
          }}} {...item}/>)}
          onChange={handlePagesChange}
        />
      </div>
    </div>
  );
}

export default Books;
