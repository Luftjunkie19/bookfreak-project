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
import { useSearchParams } from 'next/navigation';
import { Autocomplete, AutocompleteItem, Checkbox, CheckboxGroup, Pagination, Radio, RadioGroup } from '@nextui-org/react';
import FilterBar from '../../../components/Sidebars/right/FilterBar';
import Club from 'components/elements/Club';
import { useQuery } from '@tanstack/react-query';

function Clubs() {

    const { data, isLoading, isFetching } = useQuery({
    queryKey: ["clubs"],
       'queryFn': () => fetch('/api/supabase/club/getAll', {
            method: 'POST',
            headers: {
            },
           body: JSON.stringify({
             where: undefined,
             take: undefined,
             skip: undefined,
             orderBy: undefined,
             include: {members:true, requirements:true},
           })
         }).then((item)=>item.json())
  })

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

  



  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );


  
  // const pagesAmount = Math.ceil(sortedClubs.length / objectsOnPage());
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  
  return (
    <div className={`w-full flex`}>
   
      <div className="w-full h-full flex flex-col gap-6">
            {/* <Autocomplete
          defaultItems={sortedClubs}
          onValueChange={(value)=>setSearchInputValue(value)}
  label={<p className='text-white'>Club Name</p>}
          labelPlacement='outside'
      placeholder="Search a Club"
      className="max-w-sm w-full self-center p-2"
    >
      {(book:any) => <AutocompleteItem key={book.id}>{book.clubsName}</AutocompleteItem>}
        </Autocomplete> */}
        <div className="grid sm:grid-cols-2 p-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {data && data.data && data.data.map((club, i)=>(<Club key={club.id} clubLogo={club.clubLogo} clubName={club.clubsName} membersAmount={club.members.length} clubData={club} hasRequirements={club.hasRequirements} type={'dark'}  />))}
        </div>
        <Pagination classNames={{
  'wrapper':' self-center mx-auto w-full p-2',
  'cursor':"bg-primary-color",
}} total={10} showControls loop color='primary' initialPage={1}  />
      </div>
         <FilterBar sortingBarContent={   <div className="flex flex-col gap-2">
            {/* <RadioGroup
              onValueChange={(value)=>applySort(value)}
      label="Sorting"
              orientation="horizontal"
              classNames={{wrapper:'max-h-96 overflow-y-auto h-full flex gap-2 flex-wrap', label:"text-white text-2xl"}}
            >
              {sortOptions.map((sort) => (
                <Radio key={sort.label} value={sort.label} classNames={{label:'text-xs text-white'}}>{sort.label}</Radio>
              ))}
    </RadioGroup> */}
        </div>} filterBarContent={
          <div className="flex flex-col gap-2">
             {/* <CheckboxGroup
              onValueChange={(value:string[]) => {
                applyFilters(value);
              }}
              orientation="horizontal"
              classNames={{wrapper:'max-h-96 overflow-y-auto h-full flex gap-2 flex-wrap', label:"text-white text-2xl"}}
            >
              {filterOptions.map((filter) => (
                <Checkbox key={filter.label} value={filter.label} classNames={{label:'text-xs text-white'}}>{filter.label}</Checkbox>
              ))}
    </CheckboxGroup> */}
          </div>
          
   } />
    </div>
  );
}

export default Clubs;