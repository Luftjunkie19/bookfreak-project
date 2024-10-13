/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, {
  useCallback,
  useEffect,useMemo,
  useState,
} from 'react';

import { formatDistanceToNow } from 'date-fns';
import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';
import {
  Link,
  useSearchParams,
} from 'react-router-dom';


import itemReward from '../../assets/ItemReward.webp';
import lottieAnimation
  from '../../../assets/lottieAnimations/No-Data-Found.json';
import moneyPrize from '../../assets/MoneyPrize.webp';
import competitionsTranslations
  from '../../../assets/translations/CompetitionsTranslations.json';
import formTranslations from '../../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import ManagementBar from '../../../components/managment-bar/ManagementBar';
import FilterBar from '../../../components/Sidebars/right/FilterBar';
import { Autocomplete, AutocompleteItem, Checkbox, CheckboxGroup, Pagination, Radio, RadioGroup } from '@nextui-org/react';
import Competition from 'components/elements/Competition';
import { useQuery } from '@tanstack/react-query';

function Competitions() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInputValue, setSearchInputValue] = useState('');

  const filterOptions = [{
    label:"prize (Money)", filter:(array)=>{
        return array.filter((doc)=>doc.prize.moneyPrize.amount > 0);
    }
}, 
{
    label:"prize (Item)", filter:(array)=>{
        return array.filter((doc)=>doc.prize.moneyPrize.amount === 0);
    }
}, 
{
    label:"Type (Teach to fish)", filter:(array)=>{
        return array.filter((doc)=>doc.competitionsName === "Teach to fish");
    }
}, 
{
    label:"Type (Lift others, rise)", filter:(array)=>{
        return array.filter((doc)=>doc.competitionsName ==="Lift others, rise");
    }
}, 
{
    label:"Type (First Come, First Booked)",
    filter: (array) =>{
        return array.filter((doc)=>doc.competitionsName ==="First read, first served");
    },
},
{label:"Expired",filter:(array)=>{
  return array.filter((doc)=>doc.expiresAt < new Date().getTime());
}},{
  label:"Not Expired",filter:(array)=>{
    return array.filter((doc)=> doc.expiresAt >= new Date().getTime())
  }
}
  ];

  const sortOptions = [
    {
        label:"Time (Ascending)", 
        sort:(array)=>{
            return array.sort((a,b)=>b.createdBy.createdAt - a.createdBy.createdAt);
        }
    },
    {
        label:"Time (Descending)", 
        sort:(array)=>{
            return array.sort((a,b)=>a.createdBy.createdAt - b.createdBy.createdAt);
        }
    }
  ];

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");

  const applyFilters = (filters) => {
    setSelectedFilters(filters);
    console.log(filters);
  };

  const applySort = (sort) => {
    setSelectedSort(sort);
  };



  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);
  
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["competitions"],
       'queryFn': () => fetch('/api/supabase/competition/getAll', {
            method: 'POST',
            headers: {
            },
           body: JSON.stringify({
             where: undefined,
             take: undefined,
             skip: undefined,
             orderBy: undefined,
             include: {members:true, rules:true},
           })
         }).then((item)=>item.json())
  })



  return (
    <div className={`w-full flex`}>


      
      <div className="w-full flex flex-col gap-6">
             {/* <Autocomplete
          defaultItems={sortedClubs}
          onValueChange={(value)=>setSearchInputValue(value)}
           label={<p className='text-white'>Competition's Name</p>}
          labelPlacement='outside'
      placeholder="Search a Club"
      className="max-w-sm w-full self-center p-2"
    >
      {(book:any) => (<AutocompleteItem key={book.id}>{book.competitionTitle}</AutocompleteItem>)}
        </Autocomplete> */}

        <div className="grid sm:grid-cols-2 p-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">  
        {data && data.data && data.data.map((item:any)=>(<Competition competitionId={item.id} key={item.id} competitionLogo={item.competitionLogo} competitionName={item.competitionName} membersAmount={item.members.length} comeptitionRemainingTime={new Date(item.endDate)} type={'dark'}/>))}
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

export default Competitions;
