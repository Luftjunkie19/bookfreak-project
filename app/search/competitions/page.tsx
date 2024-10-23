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
  useSearchParams,
} from 'next/navigation';


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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LabeledInput from 'components/input/LabeledInput';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

function Competitions() {
  const [userSearchParams, setUserSearchParams] = useState<{ skip: number, take: number, where?: any, include?: any, orderBy?: any }>({ skip: 0, take: 25, where: undefined, include: { rules:true, members:true }, orderBy: undefined });
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
 
      return params.toString()
    },
    [searchParams]
  );
  const filterOptions = [{
    label:"prize (Money)", filter:{chargeId:true}
}, 
{
    label:"prize (Item)", filter:{
chargeId:null
    }
}, 
{
    label:"Type (Teach to fish)", filter:{competitionsType:'Teach to Fish'}
}, 
{
    label:"Type (Lift others, rise)", filter:{competitionsType:'Lift others, rise'}
}, 
{
    label:"Type (First Come, First Booked)",
    filter: {competitionType:'First Come, First Booked'}
},
{label:"Expired",filter:{expiresAt:{
  lt: new Date()
}}
},{
  label:"Not Expired",filter:{
  expiresAt:{
    gt: new Date(),
  }
  }
}
  ];
  const sortOptions = [
    {
        label:"Time (Ascending)", 
        sort:{creationDate:'asc'}
    },
    {
        label:"Time (Descending)", 
        sort:{creationDate:'desc'}
    }
  ];



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
           body: JSON.stringify(userSearchParams)
         }).then((item)=>item.json())
  })



  return (
    <div className={`w-full flex`}>


      
      <div className="w-full flex flex-col gap-6">

        <div className="grid sm:grid-cols-2 p-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">  
        {data && data.data && data.data.map((item:any)=>(<Competition competitionId={item.id} key={item.id} competitionLogo={item.competitionLogo} competitionName={item.competitionName} membersAmount={item.members.length} comeptitionRemainingTime={new Date(item.endDate)} type={'dark'}/>))}
         </div>
         <Pagination  onChange={async (page) => {
              setUserSearchParams({ ...userSearchParams, skip:page, });
          console.log(page);
          await queryClient.cancelQueries()

// Remove all inactive queries that begin with `posts` in the key
queryClient.removeQueries({ queryKey: ['clubs'], type: 'inactive' })

// Refetch all active queries
await queryClient.refetchQueries({ type: 'active' })

// Refetch all active queries that begin with `posts` in the key
await queryClient.refetchQueries({ queryKey: ['clubs'], type: 'active' })
      
        }}  classNames={{
  'wrapper':' self-center mx-auto w-full p-2',
  'cursor':"bg-primary-color",
}} total={10} showControls loop color='primary' initialPage={1}  />
      </div>
         <FilterBar searchBarContent={<div className="flex justify-between items-center gap-2">
        <LabeledInput onChange={async (e) => {
          if (e.target.value.trim() === '') {
            searchParams.delete();
            setUserSearchParams({ ...userSearchParams, where: { competitionName: undefined } });
            return;
          }

          setUserSearchParams({ ...userSearchParams, where: { competitionName: e.target.value } });
// Cancel all queries
await queryClient.cancelQueries()

// Remove all inactive queries that begin with `posts` in the key
queryClient.removeQueries({ queryKey: ['competitions'], type: 'inactive' })

// Refetch all active queries
await queryClient.refetchQueries({ type: 'active' })

// Refetch all active queries that begin with `posts` in the key
await queryClient.refetchQueries({ queryKey: ['competitions'], type: 'active' })

          router.replace(`/search/competitions?${createQueryString('clubName', e.target.value)}`);
      }} additionalClasses='text-base' placeholder='Search....' type='transparent' />
        <FaSearch  className='text-white cursor-pointer hover:text-primary-color hover:rotate-[360deg] transition-all text-xl'/>
      </div>} filterBarContent={
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
             <CheckboxGroup
              label="Filters"
              onValueChange={async (value:string[]) => {
                let arrayOfFilters: any[] = [];
  
              if (value.length === 0) {
                  setUserSearchParams({ ...userSearchParams, where: {...userSearchParams.where, 'OR':undefined}  });
              }
  
              console.log(value);
              value.map((item) => {
                const foundItem = filterOptions.find((catObj) => catObj.label === item);
                console.log(foundItem);
                if (foundItem) {
                  arrayOfFilters.push(foundItem.filter);
                }
              })
  
              setUserSearchParams({ ...userSearchParams, where: { OR: arrayOfFilters } });
  
              // Cancel all queries
  await queryClient.cancelQueries()
  
  // Remove all inactive queries that begin with `posts` in the key
  queryClient.removeQueries({ queryKey: ['competitions'], type: 'inactive' })
  
  // Refetch all active queries
  await queryClient.refetchQueries({ type: 'active' })
  
  // Refetch all active queries that begin with `posts` in the key
  await queryClient.refetchQueries({ queryKey: ['competitions'], type: 'active' })
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
             onValueChange={async (value) => {
              
              setUserSearchParams({ ...userSearchParams, orderBy: sortOptions.find((item) => item.label === value)!.sort || undefined })
            // Cancel all queries
await queryClient.cancelQueries()

// Remove all inactive queries that begin with `posts` in the key
queryClient.removeQueries({ queryKey: ['competitions'], type: 'inactive' })

// Refetch all active queries
await queryClient.refetchQueries({ type: 'active' })

// Refetch all active queries that begin with `posts` in the key
await queryClient.refetchQueries({ queryKey: ['competitions'], type: 'active' })
            }
           }
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
