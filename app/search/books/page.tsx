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
import { useRouter, useSearchParams } from 'next/navigation';


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
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { FaSearch } from 'react-icons/fa';

function Books() {
  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);
  const searchParams = useSearchParams();
  const [userSearchParams, setUserSearchParams] = useState<{ skip: number, take: number, where?: any, include?: any, orderBy?: any }>({ skip: 0, take: 25, where: undefined, include: { recensions: true }, orderBy: undefined });
  const router = useRouter();

  const selectedLanguage = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );
  
  const { data: orderedDocuments, error, isFetching, isLoading } = useQuery({
    queryKey: ['books'],
    'queryFn': async () => {
      const fetchBooks = await fetch('/api/supabase/book/getAll', {
        method: 'POST',
        headers: {
        },
        body: JSON.stringify(userSearchParams)
      });

      const fetchedBooks = await fetchBooks.json();

      return fetchedBooks;
    }
  })
 

  const categoryTypes = [
    {
      filter: { genre: 'fiction' },
      label: typesTranslation.bookFilter.fiction[selectedLanguage],
    },
    {
      filter: { genre: 'non-fiction' },
      label: typesTranslation.bookFilter["non-fiction"][selectedLanguage],
    },
    {
      filter: { genre: 'crime' },
      label: typesTranslation.bookFilter.crime[selectedLanguage],
    },
    {
      filter: { genre: 'Science fiction and fantasy' },
      label: typesTranslation.bookFilter.scienceFF[selectedLanguage],
    },
    {
      filter: {genre: `Children's and young adult literature`},
      label: typesTranslation.bookFilter.cayal[selectedLanguage],
    },
    {
      filter: {genre:'Travel and adventure literature'},
      label: typesTranslation.bookFilter.travelaal[selectedLanguage],
    },
    {
      filter: {genre:'Popular science and popular history'},
      label: typesTranslation.bookFilter.popularScience[selectedLanguage],
    },
    {
      filter:{genre:'Self-help and personal development'},
      label: typesTranslation.bookFilter.selfHelp[selectedLanguage],
    },
    {
      filter: {genre:'History and culture'},
      label: typesTranslation.bookFilter.history[selectedLanguage],
    },
    {
      filter: {genre:'Art and design'},
      label: typesTranslation.bookFilter.artDesign[selectedLanguage],
    },
    {
      filter: {genre:'Business and economics'},
      label: typesTranslation.bookFilter.Business[selectedLanguage],
    },
    {
      filter: { genre:'Psychology and philosophy'},
      label: typesTranslation.bookFilter.Psychology[selectedLanguage],
    },
    {
      filter: {genre:"Health and medicine"},
      label: typesTranslation.bookFilter.Health[selectedLanguage],
    },
    {
      filter: {genre:'Erotic literature'},
      label: typesTranslation.bookFilter.Erotic[selectedLanguage],
    },
  ];

  const sortTypes = [
    {
      label: typesTranslation.bookSort.Default[selectedLanguage],
      sort:{title:'desc'},
    },
    {
      label: typesTranslation.bookSort.pagesDescending[selectedLanguage],
      sort:{pages:'asc'},
    },
    {
      label: typesTranslation.bookSort.pagesAscending[selectedLanguage],
      sort: {pages:'desc'},
    },

  ];

  const queryClient = useQueryClient();


    const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
 
      return params.toString()
    },
    [searchParams]
  )


  return (
    <div className='w-full flex'>
    <div className={`flex w-full flex-col gap-6 p-2`}>
      <div className="grid mx-auto p-2 gap-4 w-full sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {orderedDocuments && orderedDocuments.data && orderedDocuments.data.map((item)=>( <Book recensions={item.recensions.length} bookId={item.id} bookCover={item.bookCover} pages={item.pages} author={item.bookAuthor} title={item.title} bookCategory={item.genre} key={item.id} type={'transparent'} />))}
      </div>

        <Pagination onChange={async (page) => {
          console.log(page);
          await queryClient.cancelQueries()

// Remove all inactive queries that begin with `posts` in the key
queryClient.removeQueries({ queryKey: ['books'], type: 'inactive' })

// Refetch all active queries
await queryClient.refetchQueries({ type: 'active' })

// Refetch all active queries that begin with `posts` in the key
await queryClient.refetchQueries({ queryKey: ['books'], type: 'active' })
          setUserSearchParams({ ...userSearchParams, skip:page, });
        }} onRateChange={(e) => {
          console.log(e)
}} classNames={{
  'wrapper':' self-center mx-auto w-full p-2',
  'cursor':"bg-primary-color",
}} total={10} showControls loop color='primary' initialPage={1}  />
    </div>
      <FilterBar searchBarContent={<div className="flex justify-between items-center gap-2">
        <LabeledInput onChange={async (e) => {
          if (e.target.value.trim() === '') {
            searchParams.delete();
            setUserSearchParams({ ...userSearchParams, where: { title: undefined } });
            return;
          }

          setUserSearchParams({ ...userSearchParams, where: { title: e.target.value } });
// Cancel all queries
await queryClient.cancelQueries()

// Remove all inactive queries that begin with `posts` in the key
queryClient.removeQueries({ queryKey: ['books'], type: 'inactive' })

// Refetch all active queries
await queryClient.refetchQueries({ type: 'active' })

// Refetch all active queries that begin with `posts` in the key
await queryClient.refetchQueries({ queryKey: ['books'], type: 'active' })

          router.replace(`/search/books?${createQueryString('title', e.target.value)}`);
      }} additionalClasses='text-base' placeholder='Search....' type='transparent' />
        <FaSearch  className='text-white cursor-pointer hover:text-primary-color hover:rotate-[360deg] transition-all text-xl'/>
      </div>} filterBarContent={<div>
         <CheckboxGroup
          onValueChange={async (value: string[]) => {
            let arrayOfFilters: { genre: string }[] = [];

            if (value.length === 0) {
                setUserSearchParams({ ...userSearchParams, where: {...userSearchParams.where, 'OR':undefined}  });
            }

            console.log(value);
            value.map((item) => {
              const foundItem = categoryTypes.find((catObj) => catObj.label === item);
              console.log(foundItem);
              if (foundItem) {
                arrayOfFilters.push(foundItem.filter);
              }
            })

            setUserSearchParams({ ...userSearchParams, where: { OR: arrayOfFilters } });

            // Cancel all queries
await queryClient.cancelQueries()

// Remove all inactive queries that begin with `posts` in the key
queryClient.removeQueries({ queryKey: ['books'], type: 'inactive' })

// Refetch all active queries
await queryClient.refetchQueries({ type: 'active' })

// Refetch all active queries that begin with `posts` in the key
await queryClient.refetchQueries({ queryKey: ['books'], type: 'active' })

              }}
              orientation="horizontal"
              classNames={{wrapper:'max-h-96 overflow-y-auto h-full flex gap-2 flex-wrap', label:"text-white text-2xl"}}
            >
              {categoryTypes.map((filter) => (
                <Checkbox key={filter.label} value={filter.label} classNames={{label:'text-xs text-white'}}>{filter.label}</Checkbox>
              ))}
    </CheckboxGroup>

        </div>} sortingBarContent={<div>
            <RadioGroup
            onValueChange={async (value) => {
              
              setUserSearchParams({ ...userSearchParams, orderBy: sortTypes.find((item) => item.label === value)!.sort || undefined })
            // Cancel all queries
await queryClient.cancelQueries()

// Remove all inactive queries that begin with `posts` in the key
queryClient.removeQueries({ queryKey: ['books'], type: 'inactive' })

// Refetch all active queries
await queryClient.refetchQueries({ type: 'active' })

// Refetch all active queries that begin with `posts` in the key
await queryClient.refetchQueries({ queryKey: ['books'], type: 'active' })
            }
           
            }
              orientation="horizontal"
              classNames={{wrapper:'max-h-96 overflow-y-auto h-full flex gap-2 flex-wrap', label:"text-white text-2xl"}}
            >
              {sortTypes.map((sort) => (
                <Radio key={sort.label} value={sort.label} classNames={{label:'text-xs text-white'}}>{sort.label}</Radio>
              ))}
    </RadioGroup>
      </div  >} />
    </div>
  );
}

export default Books;
