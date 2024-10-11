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
          <p className='mx-4 text-white text-2xl'>Results for {searchInputValue}</p>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mx-4 my-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6">
            {/* {sortedTests && sortedTests.length > 0 && sortedTests.map((test: any) => (<Test key={test.testName} testData={test} type={'white'} />))} */}
        </div>
        </div>
        <Pagination classNames={{
  'wrapper':' self-center mx-auto w-full p-2',
  'cursor':"bg-primary-color",
}} total={10} showControls loop color='primary' initialPage={1}  />
      </div>

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
              {filterOptions.map((filter) => (
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
              {sortOptions.map((sort) => (
                <Radio key={sort.label} value={sort.label} classNames={{label:'text-xs text-white'}}>{sort.label}</Radio>
              ))}
    </RadioGroup>
        </div>
          
</div>} />
    </div>
  );
}

export default Tests;
