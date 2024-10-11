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
import { Autocomplete, AutocompleteItem, Checkbox, CheckboxGroup, Pagination, PaginationItemType, Radio, RadioGroup } from '@nextui-org/react';
import { bookCategories } from 'assets/CreateVariables';
import { DataView } from 'primereact/dataview';
import LabeledInput from 'components/input/LabeledInput';
import FilterBar from 'components/Sidebars/right/FilterBar';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

function Books() {
   const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);

  const selectedLanguage = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );
  
   const { data:orderedDocuments, error, isFetching, isLoading } = useQuery({
      queryKey: ['books'],
      'queryFn': async () => {
         const fetchBooks = await fetch('/api/supabase/book/getAll', {
            method: 'POST',
            headers: {
            },
            body: JSON.stringify({ skip: 0, take: 6, where: undefined, include: undefined })
         });

         const fetchedBooks = await fetchBooks.json();

         return fetchedBooks;
      }
})
  // const [filterQuery, setFilterQuery] = useSearchParams({ filters: "" });

 

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

  // const filteredArray =  useMemo(() => {
  //   if (selectedFilters.length > 0) {
  //     const filteredDocuments = selectedFilters.reduce((result, selectedFilter) => {
  //       const filterOption = categoryTypes.find(option => option.label === selectedFilter);

  //       if (filterOption) {
  //         const temp = filterOption.filter(result);
  //         return temp;
  //       }

  //       return result;
  //     }, books);

  //     return filteredDocuments.filter((item)=> item.title.includes(searchInputValue) || item.author.includes(searchInputValue));
  //   } else {
  //     return books.filter((item)=> item.title.toLowerCase().includes(searchInputValue.toLowerCase()) || item.author.toLowerCase().includes(searchInputValue.toLowerCase()));
  //   }
  // },[books, categoryTypes, searchInputValue, selectedFilters]);

  // const sortedArray = useMemo(() => {
  //   if (selectedSort.trim() !== "" && sortTypes
  //       .find((option) => option.label === selectedSort)) {
  //     return (sortTypes
  //       .find((option) => option.label === selectedSort) as {
  //       label: string,
  //       sort: (array: Array<any>) => any[];
  //       })
  //       .sort(filteredArray).filter((item)=> item.title.toLowerCase().includes(searchInputValue.toLowerCase()) || item.author.toLowerCase().includes(searchInputValue.toLowerCase()));
  //   } else {
  //     return filteredArray.filter((item)=> item.title.toLowerCase().includes(searchInputValue.toLowerCase()) || item.author.toLowerCase().includes(searchInputValue.toLowerCase()));;
  //   }
  // }, [filteredArray, searchInputValue, selectedSort, sortTypes]);
  
 


  return (
    <div className='w-full flex'>
    <div className={`flex w-full flex-col gap-6 p-2`}>
      <LabeledInput placeholder='' type={'dark'} additionalClasses='max-w-sm mx-auto w-full p-2' onChange={(e)=> {
        console.log(e.target.value);
      } } />
      <div className="grid mx-auto p-2 gap-4 w-full sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {/* {sortedArray && sortedArray.map((item)=>(<Book key={item.id} bookCover={item.photoURL} pages={item.pagesNumber} author={item.author} bookId={item.id} title={item.title} bookCategory={item.category} type={'transparent'}/>))} */}
      </div>

<Pagination classNames={{
  'wrapper':' self-center mx-auto w-full p-2',
  'cursor':"bg-primary-color",
}} total={10} showControls loop color='primary' initialPage={1}  />
    </div>
        <FilterBar/>
    </div>
  );
}

export default Books;
