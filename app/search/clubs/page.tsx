/* eslint-disable react-hooks/exhaustive-deps */
'use client';


import React, {
  useCallback,
  useEffect,
  useState,useMemo
} from 'react';

import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';
import 
  Link
 from 'next/link';

import lottieAnimation
  from '../../../assets/lottieAnimations/No-Data-Found.json';
import clubsTranslations
  from '../../../assets/translations/ClubsTranslations.json';
import formTranslations from '../../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import ManagementBar from '../../../components/managment-bar/ManagementBar';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useSearchParams } from 'next/navigation';
import { Autocomplete, AutocompleteItem, Checkbox, CheckboxGroup, Radio, RadioGroup } from '@nextui-org/react';
import FilterBar from '../../../components/left-bar/FilterBar';
import Club from 'components/elements/Club';

function Clubs() {
  const {documents:clubs}=useGetDocuments('readersClubs');
  const [documents, setElements] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInputValue, setSearchInputValue] = useState('');
  

  const filterOptions = [{
    label:"<= 100 read pages", filter:(array: any[])=>{
        return array.filter((doc:any)=>doc.requiredPagesRead <= 100);
    }
}, 
{
    label:">= 100 read pages", filter:(array: any[])=>{
        return array.filter((doc:any)=>doc.requiredPagesRead >= 100);
    }
}, 
{
    label:">= 500 read pages", filter:(array: any[])=>{
        return array.filter((doc:any)=>doc.requiredPagesRead >= 500);
    }
}, 
{
    label:">= 1000 read pages", filter:(array: any[])=>{
        return array.filter((doc:any)=>doc.requiredPagesRead >= 1000);
    }
}, 
    
  ];


  const sortOptions = [
    {
        label:"Time (Ascending)", 
        sort:(array: any[])=>{
            return array.sort((a:any,b:any)=>b.createdBy.createdAt - a.createdBy.createdAt);
        }
    },
    {
        label:"Time (Descending)", 
        sort:(array: any[])=>{
            return array.sort((a:any,b:any)=>a.createdBy.createdAt - b.createdBy.createdAt);
        }
    }
  ];



  const objectsOnPage = () => {
    if (document.body.clientWidth > 0 && document.body.clientWidth < 1024) {
      return 10;
    } else {
      return 45;
    }
  };
  const fetchObjects = useCallback(
    (page: number) => {
      const start = (page - 1) * objectsOnPage();
      const end = start + objectsOnPage();
      const pageObjects = clubs.slice(start, end);
      return pageObjects;
    },
    [clubs]
  );

  const handlePagesChange = (e: any, value: React.SetStateAction<number>) => {
    if (currentPage < pagesAmount) {
      setCurrentPage(currentPage + 1);
      const pageObjects = fetchObjects(currentPage + 1);
      setElements(pageObjects as any[]);
      return;
    }

    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const pageObjects = fetchObjects(currentPage - 1);
      setElements(pageObjects as any[]);
      return;
    }
    setCurrentPage(value);
  };

  


  useEffect(() => {
    if (documents.length > 0) {
      const fetchedObjects = fetchObjects(currentPage);
      setElements(fetchedObjects as any[]);
    }
  }, [currentPage, documents, fetchObjects]);

  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );


  
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState("");

  const applyFilters = (filters: string[]) => {
    setSelectedFilters(filters);
    console.log(filters);
  };

  const applySort = (sort: string) => {
    setSelectedSort(sort);
  };

  const filteredItems = useMemo(() => {
    if (selectedFilters.length > 0) {
      const filteredDocuments = selectedFilters.reduce((result, selectedFilter) => {
        const filterOption = filterOptions.find(option => option.label === selectedFilter);
  
        if (filterOption) {
          const temp = filterOption.filter(result);
          return temp;
        }
  
        return result;
      }, documents);
  
      return filteredDocuments.filter((item)=> item.clubsName.toLowerCase().includes(searchInputValue.toLowerCase()));
    } else {
      // If no filters selected, return all documents
      return clubs.filter((item)=> item.clubsName.toLowerCase().includes(searchInputValue.toLowerCase()));;
    }
  },[clubs, documents, filterOptions, searchInputValue, selectedFilters]);

  const sortedClubs = useMemo(() => {
    if (selectedSort.trim() !== "") {
      return (sortOptions
        .find((option) => option.label === selectedSort) as { label: string; sort: (array: any) => any })
        .sort(filteredItems).filter((item)=> item.clubsName.toLowerCase().includes(searchInputValue.toLowerCase()));
    } else {
      return filteredItems.filter((item)=> item.clubsName.toLowerCase().includes(searchInputValue.toLowerCase()));;
    }
  },[filteredItems, searchInputValue, selectedSort, sortOptions]);

  const pagesAmount = Math.ceil(sortedClubs.length / objectsOnPage());
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  
  return (
    <div className={`min-h-screen h-full flex`}>
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
      <div className="w-full h-full flex flex-col gap-6">
            <Autocomplete
          defaultItems={sortedClubs}
          onValueChange={(value)=>setSearchInputValue(value)}
          label="Club Name"
          labelPlacement='outside'
      placeholder="Search a Club"
      className="max-w-sm w-full self-center p-2"
    >
      {(book:any) => <AutocompleteItem key={book.id}>{book.clubsName}</AutocompleteItem>}
        </Autocomplete>
        <div className="grid sm:grid-cols-1 p-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {sortedClubs.map((club, i)=>(<Club key={club.id} clubLogo={club.clubLogo} clubName={club.clubsName} membersAmount={0} clubData={club}  />))}
        </div>
      </div>
    </div>
  );
}

export default Clubs;