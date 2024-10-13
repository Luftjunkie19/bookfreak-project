/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
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
import ManagementBar from '../../../components/managment-bar/ManagementBar';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import FilterBar from 'components/Sidebars/right/FilterBar';
import { Autocomplete, AutocompleteItem, Checkbox, CheckboxGroup, Pagination, Radio, RadioGroup } from '@nextui-org/react';
import Test from 'components/elements/Test';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


function Tests() {
  const selectedLanguage = useSelector((state:any) => state.languageSelection.selectedLangugage);
  const [currentPage, setCurrentPage] = useState(1);
  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);
    const [searchInputValue, setSearchInputValue] = useState('');
  const sortOptions = [
    { label: "Test's name (Z-A)", sort: (tests) => tests.sort((a, b) => b.testName.localeCompare(a.testName)) },
    { label: "Test's name (A-Z)", sort: (tests) => tests.sort((a, b) => a.testName.localeCompare(b.testName)) },
  ];

  const filterOptions = [
    { label: "Queries <= 10", filter: (array) => array.filter(test => Object.values(test.queries).length <= 10) },
    { label: "Queries >= 10", filter: (array) => array.filter(test => Object.values(test.queries).length >= 10) },
  ];




  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");

  const applyFilters = (filters) => {
    setSelectedFilters(filters);
  };

  const applySort = (sort) => {
    setSelectedSort(sort);
  };

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["tests", {questions:1}],
    'queryFn': ({queryKey}) => fetch('/api/supabase/test/getAll', {
      method: 'POST',
      headers: {
      },
      body: JSON.stringify({
        where: undefined,
        take: undefined,
        skip: undefined,
        orderBy: undefined,
        include: { questions: true, results: true },
      })
    }).then((item) => item.json()),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    retry:0,
  });

  const { mutate, isError, isPending } = useMutation({
    mutationFn: async () => { },
    onMutate:(variables)=>{},
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["tests"],
      })
    },
  });



  return (
    <div className={`w-full flex`}>
   
      

      <div className="w-full h-full flex flex-col gap-6">
       
    {/* <Autocomplete
          defaultItems={sortedTests}
          onValueChange={(value)=>setSearchInputValue(value)}
          label={<p className='text-white'>Test's Name</p>}
          labelPlacement='outside'
      placeholder="Search a Book"
      className="max-w-sm w-full self-center p-2"
    >
      {(book:any) => <AutocompleteItem key={book.testName}>{book.testName}</AutocompleteItem>}
        </Autocomplete>
         */}
        <div className="flex flex-col gap-2">

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mx-4 my-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6">
      
            {data && data.data && data.data.map((test: any) => (<Test key={test.name} testData={test} type={'white'} />))}
        </div>
        </div>
        <Pagination classNames={{
  'wrapper':' self-center mx-auto w-full p-2',
  'cursor':"bg-primary-color",
}} total={10} showControls loop color='primary' initialPage={1}  />
      </div>

         <FilterBar sortingBarContent={         
      <div className="flex flex-col gap-2">
            <RadioGroup
              onValueChange={(value)=>applySort(value)}
              orientation="horizontal"
              classNames={{wrapper:'max-h-96 overflow-y-auto h-full flex gap-2 flex-wrap', label:"text-white text-2xl"}}
            >
              {sortOptions.map((sort) => (
                <Radio key={sort.label} value={sort.label} classNames={{label:'text-xs text-white'}}>{sort.label}</Radio>
              ))}
    </RadioGroup>
        </div>} filterBarContent={
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
             <CheckboxGroup
            
              onValueChange={(value:string[]) => {
                applyFilters(value);
              }}
              orientation="horizontal"
              classNames={{wrapper:'max-h-96 overflow-y-auto h-full flex gap-2 flex-wrap', label:"text-white text-2xl"}}
            >
              {filterOptions.map((filter) => (
                <Checkbox key={filter.label} value={filter.label} classNames={{label:'text-xs text-white'}}>{filter.label}</Checkbox>
              ))}
    </CheckboxGroup>
          </div>
          
</div>} />
    </div>
  );
}

export default Tests;
