import '../stylings/backgrounds.css';

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
import ManagementBar from '../../components/RecensionsComponents/ManagementBar';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

function Tests() {
  const selectedLanguage = useSelector((state) => state.languageSelection.selectedLangugage);
  const [tests, setTests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const sortOptions = [
    { label: "Test's name (Z-A)", sort: (tests) => tests.sort((a, b) => b.testName.localeCompare(a.testName)) },
    { label: "Test's name (A-Z)", sort: (tests) => tests.sort((a, b) => a.testName.localeCompare(b.testName)) },
  ];

  const filterOptions = [
    { label: "Queries <= 10", filter: (array) => array.filter(test => Object.values(test.queries).length <= 10) },
    { label: "Queries >= 10", filter: (array) => array.filter(test => Object.values(test.queries).length >= 10) },
  ];

  const { getDocuments } = useRealtimeDocuments();

  const loadTests = useCallback(async () => {
    try {
      const testsEls = await getDocuments("tests");
      if (testsEls) {
        setTests(testsEls);
      }
    } catch (error) {
      console.error('Error loading tests:', error);
      // Handle the error appropriately, e.g., show a user-friendly message
    }
  }, [getDocuments]);

  useEffect(() => {
    loadTests();
  }, [loadTests]);

  const objectsOnPage = () => {
    return document.body.clientWidth > 0 && document.body.clientWidth < 1024 ? 10 : 45;
  };

  const fetchObjects = useCallback(
    (page) => {
      const start = (page - 1) * objectsOnPage();
      const end = start + objectsOnPage();
      const pageObjects = tests.slice(start, end);
      return pageObjects;
    },
    [tests]
  );

  const handlePagesChange = (e, value) => {
    let newPage;
    if (currentPage < pagesAmount) {
      newPage = currentPage + 1;
    } else if (currentPage > 1) {
      newPage = currentPage - 1;
    } else {
      newPage = value;
    }

    setCurrentPage(newPage);
    const pageObjects = fetchObjects(newPage);
    setTests(pageObjects);
  };

  const pagesAmount = Math.ceil(tests.length / objectsOnPage());

  useEffect(() => {
    if (tests.length > 0) {
      const fetchedObjects = fetchObjects(currentPage);
      setTests(fetchedObjects);
    }
  }, [currentPage, tests, fetchObjects]);

  const [filterQuery, setFilterQuery] = useSearchParams({ filters: "" });
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");

  const applyFilters = (filters) => {
    setSelectedFilters(filters);
  };

  const applySort = (sort) => {
    setSelectedSort(sort);
  };

  const filteredItems = () => {
    if (selectedFilters.length > 0) {
      return selectedFilters.reduce((result, selectedFilter) => {
        const filterOption = filterOptions.find(option => option.label === selectedFilter);

        if (filterOption) {
          return filterOption.filter(result);
        }

        return result;
      }, tests);
    } else {
      return tests;
    }
  };

  const sortedTests = () => {
    if (selectedSort.trim("") !== "") {
      return sortOptions.find((option) => option.label === selectedSort).sort(filteredItems());
    } else {
      return filteredItems();
    }
  };

  return (
    <div className={`min-h-screen h-full overflow-x-hidden ${!isDarkModed && "pattern-bg"}`}>
      <div className="w-full flex flex-wrap justify-center items-center">
        <ManagementBar filterText={reuseableTranslations.categoryText[selectedLanguage]} sortText={reuseableTranslations.sortTexts[selectedLanguage]} sortOptions={selectedSort} filterOptions={filterOptions} sortSelected={selectedSort} filtersSelected={selectedFilters} applyFilters={applyFilters} applySort={applySort} />
        <Autocomplete
          className="sm:w-3/4 md:max-w-lg"
          onChange={(e, value) => {
            if (value === null) {
              setFilterQuery((prev) => {
                prev.set("filters", "");
                return prev;
              }, { replace: true });
              return;
            }
            setFilterQuery((prev) => {
              prev.set("filters", value);
              return prev;
            }, { replace: true });
          }}
          id="free-solo-demo"
          freeSolo
             renderOption={(props, option) => (<Box {...props} sx={{ color: 'white'}}>{option}</Box>)}
          options={tests.map((option) => option.testName)}
          renderInput={(params) => (
            <TextField
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
              {...params}
              label={formTranslations.placeHoldersCollections.testName[selectedLanguage]}
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

      <div className="flex w-full  md:justify-start md:items-start flex-wrap gap-4 m-6">
        {sortedTests().filter((doc)=>doc.testName.toLowerCase().includes(filterQuery.get("filters").toLowerCase())).length > 0 &&
          sortedTests().filter((doc)=>doc.testName.toLowerCase().includes(filterQuery.get("filters").toLowerCase())).map((test) => (
            <Link
              className={`sm:w-[43%] rounded-md 2xl:w-[13%] xl:w-[15%] lg:w-[23%] flex flex-col group duration-500 transition-all hover:-translate-y-1 ${isDarkModed ? "hover:bg-lightModeCol hover:text-accColor" : "hover:bg-primeColor hover:text-white"} items-center bg-accColor text-white`}
              to={`/test/${test.testId}`}
              key={test.testId}
            >
              {test.refersToBook.photoURL ? (
                <div className="w-full h-36 group-hover:border-b-accColor border-b-white border-b-2">
                  <img
                    src={test.refersToBook.photoURL}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-36 p-2 group-hover:border-b-accColor border-b-white border-b-2">
                  <img
                    src="https://m.media-amazon.com/images/I/51qwdm+hKgL.png"
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 p-4 self-start">
                <p className="font-bold">{test.testName}</p>
                {test.refersToBook.title ? (
                  <p className="font-semibold">{test.refersToBook.title}</p>
                ) : (
                  <>
                    <p className="font-semibold">{test.refersToBook}</p>
                  </>
                )}
                <p>{Object.values(test.queries).length} {formTranslations.queries[selectedLanguage]}</p>
              </div>
            </Link>
          ))}

        {sortedTests().filter((doc)=>doc.testName.toLowerCase().includes(filterQuery.get("filters").toLowerCase())).length === 0 && (
          <div className="flex justify-center items-center flex-col w-full">
            <Lottie animationData={lottieAnimation} />
          </div>
        )}
      </div>

      <div className="flex justify-center items-center p-2">
        <Pagination
 shape="rounded" 
          variant="outlined"
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

export default Tests;
