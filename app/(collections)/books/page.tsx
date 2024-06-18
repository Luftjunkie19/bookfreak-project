import '../stylings/backgrounds.css';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';


import lottieAnimation
  from '../../../assets/lottieAnimations/No-Data-Found.json';
import formTranslations from '../../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import translations from '../../../assets/translations/SearchTranslations.json';
import typesTranslation from '../../../assets/translations/TypesTranslations.json';
import Book from '../../../components/elements/Book';
import ManagementBar from '../../../components/recensions/ManagementBar';
import useGetDocuments from '../../../hooks/useGetDocuments';

function Books() {
  const { documents: orderedDocuments } = useGetDocuments('books');
  const [filterQuery, setFilterQuery] = useSearchParams({ filters: "" });

  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);

  const selectedLanguage = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );
  const setBooks = useCallback((pagesObjects) => {
    return pagesObjects;
  }, []);

  const categoryTypes = [
    {
      filter: (array) => {
        return array.filter((book) => book.category === "Fiction");
      },
      label: typesTranslation.bookFilter.fiction[selectedLanguage],
    },
    {
      filter: (array) => {
        return array.filter((book) => book.category === "Non-fiction");
      },
      label: typesTranslation.bookFilter["non-fiction"][selectedLanguage],
    },
    {
      filter: (array) => {
        return array.filter((book) => book.category === "Crime");
      },
      label: typesTranslation.bookFilter.crime[selectedLanguage],
    },
    {
      filter: (array) => {
        return array.filter((book) => book.category === "Science fiction and fantasy");
      },
      label: typesTranslation.bookFilter.scienceFF[selectedLanguage],
    },
    {
      filter: (array) => {
        return array.filter((book) => book.category === "Children's and young adult literature");
      },
      label: typesTranslation.bookFilter.cayal[selectedLanguage],
    },
    {
      filter: (array) => {
        return array.filter((book) => book.category === "Travel and adventure literature");
      },
      label: typesTranslation.bookFilter.travelaal[selectedLanguage],
    },
    {
      filter: (array) => {
        return array.filter((book) => book.category === "Popular science and popular history");
      },
      label: typesTranslation.bookFilter.popularScience[selectedLanguage],
    },
    {
      filter: (array) => {
        return array.filter((book) => book.category === "Self-help and personal development");
      },
      label: typesTranslation.bookFilter.selfHelp[selectedLanguage],
    },
    {
      filter: (array) => {
        return array.filter((book) => book.category === "History and culture");
      },
      label: typesTranslation.bookFilter.history[selectedLanguage],
    },
    {
      filter: (array) => {
        return array.filter((book) => book.category === "Art and design");
      },
      label: typesTranslation.bookFilter.artDesign[selectedLanguage],
    },
    {
      filter: (array) => {
        return array.filter((book) => book.category === "Business and economics");
      },
      label: typesTranslation.bookFilter.Business[selectedLanguage],
    },
    {
      filter: (array) => {
        return array.filter((book) => book.category === "Psychology and philosophy");
      },
      label: typesTranslation.bookFilter.Psychology[selectedLanguage],
    },
    {
      filter: (array) => {
        return array.filter((book) => book.category === "Health and medicine");
      },
      label: typesTranslation.bookFilter.Health[selectedLanguage],
    },
    {
      filter: (array) => {
        return array.filter((book) => book.category === "Erotic literature");
      },
      label: typesTranslation.bookFilter.Erotic[selectedLanguage],
    },
  ];

  const sortTypes = [
    {
      label: typesTranslation.bookSort.Default[selectedLanguage],
      sort: (array: Array<any>) => array.slice().sort((a, b) => a.title - b.title),
    },
    {
      label: typesTranslation.bookSort.pagesDescending[selectedLanguage],
      sort: (array: Array<any>) => array.slice().sort((a, b) => b.pagesNumber - a.pagesNumber),
    },
    {
      label: typesTranslation.bookSort.pagesAscending[selectedLanguage],
      sort: (array: Array<any>) => array.slice().sort((a, b) => a.pagesNumber - b.pagesNumber),
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

  const filteredArray = () => {
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

  const sortedArray = () => {
    if (selectedSort.trim() !== "" && sortTypes
        .find((option) => option.label === selectedSort)) {
      return (sortTypes
        .find((option) => option.label === selectedSort) as {
        label: string,
        sort: (array: Array<any>) => any[];
        })
        .sort(filteredArray())
    } else {
      return filteredArray();
    }
  };
  return (
    <div className={`min-h-screen h-full`}>
      <div className="flex flex-wrap gap-6 items-center p-3 w-full">
        <ManagementBar sortSelected={selectedSort} filtersSelected={selectedFilters} sortOptions={sortTypes} filterOptions={categoryTypes} applyFilters={applyFilters} applySort={applySort} filterText={reuseableTranslations.categoryText[selectedLanguage]} sortText={reuseableTranslations.sortTexts[selectedLanguage]} />

      </div>

 
    </div>
  );
}

export default Books;
