import '../stylings/backgrounds.css';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';
import 
  Link
 from 'next/link';


import lottieAnimation
  from '../../../assets/lottieAnimations/NotFound-Animation-Search.json';
import formTranslations from '../../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import ManagementBar from '../../../components/recensions/ManagementBar';
import useRealtimeDocuments from '../../../hooks/useRealtimeDocuments';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

function Tests() {
  const selectedLanguage = useSelector((state:any) => state.languageSelection.selectedLangugage);
  const [tests, setTests] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
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
        setTests(testsEls as any[]);
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

  const filterQuery = useSearchParams();
  filterQuery.set()
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
    if (selectedSort.trim() !== "") {
      return (sortOptions.find((option:any) => option.label === (selectedSort as string)) as {
    label: string;
    sort: (tests: any) => any;
}).sort(filteredItems());
    } else {
      return filteredItems();
    }
  };

  return (
    <div className={`min-h-screen h-full overflow-x-hidden ${!isDarkModed && "pattern-bg"}`}>
      <div className="w-full flex flex-wrap justify-center items-center">
        <ManagementBar filterText={reuseableTranslations.categoryText[selectedLanguage]} sortText={reuseableTranslations.sortTexts[selectedLanguage]} sortOptions={selectedSort} filterOptions={filterOptions} sortSelected={selectedSort} filtersSelected={selectedFilters} applyFilters={applyFilters} applySort={applySort} />
      
      </div>

   
  
    </div>
  );
}

export default Tests;
