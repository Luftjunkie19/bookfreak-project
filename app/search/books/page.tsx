'use client';

import '../../../stylings/primereact-custom/dataview.css'

import React, {
  useCallback,
  useEffect,
  useMemo,
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
import ManagementBar from '../../../components/managment-bar/ManagementBar';
import useGetDocuments from '../../../hooks/useGetDocuments';
import FilterBar from '../../../components/left-bar/FilterBar';
import { Autocomplete, AutocompleteItem, Checkbox, CheckboxGroup, Pagination, Radio, RadioGroup } from '@nextui-org/react';
import { bookCategories } from 'assets/CreateVariables';
import { DataView } from 'primereact/dataview';

function Books() {
  const { documents: orderedDocuments } = useGetDocuments('books');
  // const [filterQuery, setFilterQuery] = useSearchParams({ filters: "" });

  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);

  const selectedLanguage = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );
  const setBooks = useCallback((pagesObjects: any) => {
    return pagesObjects;
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const categoryTypes = [
    {
      filter: (array:any[]) => {
        return array.filter((book) => book.category === "Fiction");
      },
      label: typesTranslation.bookFilter.fiction[selectedLanguage],
    },
    {
      filter: (array:any[]) => {
        return array.filter((book) => book.category === "Non-fiction");
      },
      label: typesTranslation.bookFilter["non-fiction"][selectedLanguage],
    },
    {
      filter: (array: any[]) => {
        return array.filter((book: { category: string; }) => book.category === "Crime");
      },
      label: typesTranslation.bookFilter.crime[selectedLanguage],
    },
    {
      filter: (array: any[]) => {
        return array.filter((book: { category: string; }) => book.category === "Science fiction and fantasy");
      },
      label: typesTranslation.bookFilter.scienceFF[selectedLanguage],
    },
    {
      filter: (array: any[]) => {
        return array.filter((book: { category: string; }) => book.category === "Children's and young adult literature");
      },
      label: typesTranslation.bookFilter.cayal[selectedLanguage],
    },
    {
      filter: (array: any[]) => {
        return array.filter((book: { category: string; }) => book.category === "Travel and adventure literature");
      },
      label: typesTranslation.bookFilter.travelaal[selectedLanguage],
    },
    {
      filter: (array: any[]) => {
        return array.filter((book: { category: string; }) => book.category === "Popular science and popular history");
      },
      label: typesTranslation.bookFilter.popularScience[selectedLanguage],
    },
    {
      filter: (array: any[]) => {
        return array.filter((book: { category: string; }) => book.category === "Self-help and personal development");
      },
      label: typesTranslation.bookFilter.selfHelp[selectedLanguage],
    },
    {
      filter: (array: any[]) => {
        return array.filter((book: { category: string; }) => book.category === "History and culture");
      },
      label: typesTranslation.bookFilter.history[selectedLanguage],
    },
    {
      filter: (array: any[]) => {
        return array.filter((book: { category: string; }) => book.category === "Art and design");
      },
      label: typesTranslation.bookFilter.artDesign[selectedLanguage],
    },
    {
      filter: (array: any[]) => {
        return array.filter((book: { category: string; }) => book.category === "Business and economics");
      },
      label: typesTranslation.bookFilter.Business[selectedLanguage],
    },
    {
      filter: (array: any[]) => {
        return array.filter((book: { category: string; }) => book.category === "Psychology and philosophy");
      },
      label: typesTranslation.bookFilter.Psychology[selectedLanguage],
    },
    {
      filter: (array: any[]) => {
        return array.filter((book: { category: string; }) => book.category === "Health and medicine");
      },
      label: typesTranslation.bookFilter.Health[selectedLanguage],
    },
    {
      filter: (array: any[]) => {
        return array.filter((book: { category: string; }) => book.category === "Erotic literature");
      },
      label: typesTranslation.bookFilter.Erotic[selectedLanguage],
    },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    (page: number) => {
      const start = (page - 1) * objectsOnPage();
      const end = start + objectsOnPage();
      const pageObjects = orderedDocuments.slice(start, end);
      return pageObjects;
    },
    [orderedDocuments]
  );

  const handlePagesChange = (e: any, value: React.SetStateAction<number>) => {
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

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState("");
  const [searchInputValue, setSearchInputValue] = useState('');

  const applyFilters = (filters: string[]) => {
    setSelectedFilters(filters);
    console.log(filters);
  };

  const applySort = (sort: string) => {
    setSelectedSort(sort);
  };

  const filteredArray =  useMemo(() => {
    if (selectedFilters.length > 0) {
      const filteredDocuments = selectedFilters.reduce((result, selectedFilter) => {
        const filterOption = categoryTypes.find(option => option.label === selectedFilter);

        if (filterOption) {
          const temp = filterOption.filter(result);
          return temp;
        }

        return result;
      }, books);

      return filteredDocuments.filter((item)=> item.title.includes(searchInputValue) || item.author.includes(searchInputValue));
    } else {
      return books.filter((item)=> item.title.toLowerCase().includes(searchInputValue.toLowerCase()) || item.author.toLowerCase().includes(searchInputValue.toLowerCase()));
    }
  },[books, categoryTypes, searchInputValue, selectedFilters]);

  const sortedArray = useMemo(() => {
    if (selectedSort.trim() !== "" && sortTypes
        .find((option) => option.label === selectedSort)) {
      return (sortTypes
        .find((option) => option.label === selectedSort) as {
        label: string,
        sort: (array: Array<any>) => any[];
        })
        .sort(filteredArray).filter((item)=> item.title.toLowerCase().includes(searchInputValue.toLowerCase()) || item.author.toLowerCase().includes(searchInputValue.toLowerCase()));
    } else {
      return filteredArray.filter((item)=> item.title.toLowerCase().includes(searchInputValue.toLowerCase()) || item.author.toLowerCase().includes(searchInputValue.toLowerCase()));;
    }
  }, [filteredArray, searchInputValue, selectedSort, sortTypes]);
  



  return (
    <div className={`min-h-screen h-full w-full flex`}>
      <FilterBar filterBarContent={
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
             <CheckboxGroup
              label="Filters"
              onValueChange={(value:string[]) => {
                applyFilters(value);
              }}
              orientation="horizontal"
              classNames={{wrapper:'max-h-96 overflow-y-auto h-full flex gap-2 flex-wrap', label:"text-white text-2xl"}}
            >
              {categoryTypes.map((filter) => (
                <Checkbox key={filter.label} value={filter.label} classNames={{label:'text-xs text-white'}}>{filter.label}</Checkbox>
              ))}
    </CheckboxGroup>
          </div>
          
      <div className="flex flex-col gap-2">
            <RadioGroup
              onValueChange={(value)=>applySort(value)}
      label="Sorting"
              orientation="horizontal"
              classNames={{wrapper:'max-h-96 overflow-y-auto h-full flex gap-2 flex-wrap', label:"text-white text-2xl"}}
            >
              {sortTypes.map((sort) => (
                <Radio key={sort.label} value={sort.label} classNames={{label:'text-xs text-white'}}>{sort.label}</Radio>
              ))}
    </RadioGroup>
        </div>
          
</div>} />
      

      <div className="w-full h-full flex flex-col gap-6">
    <Autocomplete
          defaultItems={books}
          onValueChange={(value)=>setSearchInputValue(value)}
          label="Book Title"
          labelPlacement='outside'
      placeholder="Search a Book"
      className="max-w-sm w-full self-center p-2"
    >
      {(book:any) => <AutocompleteItem key={book.id}>{book.title}</AutocompleteItem>}
        </Autocomplete>
        <div className="flex flex-col gap-2">
          <p className='mx-4 text-white text-2xl'>Results for {searchInputValue}</p>
        <div className="grid sm:grid-cols-1 gap-2 mx-4 my-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-7">
      {sortedArray.map((book:any)=>(<Book bookCover={book.photoURL} pages={book.pagesNumber} author={book.author} bookId={book.id} title={book.title} bookCategory={book.category} key={book.id}/>))}
        </div>
        </div>
   
      </div>
    </div>
  );
}

export default Books;
