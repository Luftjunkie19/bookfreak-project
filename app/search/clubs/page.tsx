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
import { useRouter, useSearchParams } from 'next/navigation';
import { Autocomplete, AutocompleteItem, Checkbox, CheckboxGroup, Pagination, Radio, RadioGroup } from '@nextui-org/react';
import FilterBar from '../../../components/Sidebars/right/FilterBar';
import Club from 'components/elements/Club';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LabeledInput from 'components/input/LabeledInput';
import { FaSearch } from 'react-icons/fa';

function Clubs() {
  
  const searchParams = useSearchParams();
  const [userSearchParams, setUserSearchParams] = useState<{ skip: number, take: number, where?: any, include?: any, orderBy?: any }>({ skip: 0, take: 25, where: undefined, include: { members:true, requirements:true }, orderBy: undefined });
  const router = useRouter();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["clubs"],
    'queryFn': () => fetch('/api/supabase/club/getAll', {
      method: 'POST',
      headers: {
      },
      body: JSON.stringify(userSearchParams)
    }).then((item) => item.json())
  });

  const queryClient = useQueryClient();

  

  const filterOptions = [{
    label: "<= 100 read pages", filter: {
      requirements: {
        some: {
          requiredPagesRead: {
            lte: 100
          },
          },
      },
    }
}, 
{
    label:">= 100 read pages", filter:{
      requirements: {
        some: {
          requiredPagesRead: {
            gte: 100
          },
                },
      },
    }
}, 

    
  ];

  const sortOptions = [
    {
        label:"Time (Ascending)", 
        sort:{
                creationDate:'asc'
            }
    },
    {
        label:"Time (Descending)", 
        sort:{
                creationDate:'desc'
            }
    }
  ];

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
 
      return params.toString()
    },
    [searchParams]
  )
  



  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );


  
  // const pagesAmount = Math.ceil(sortedClubs.length / objectsOnPage());
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  
  return (
    <div className={`w-full flex`}>
   
      <div className="w-full h-full flex flex-col gap-6">

        <div className="grid sm:grid-cols-2 p-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {data && data.data && data.data.map((club, i)=>(<Club key={club.id} clubLogo={club.clubLogo} clubName={club.clubsName} membersAmount={club.members.length} clubData={club} hasRequirements={club.hasRequirements} type={'dark'}  />))}
        </div>
        <Pagination onChange={async (page) => {
              setUserSearchParams({ ...userSearchParams, skip:page, });
          console.log(page);
          await queryClient.cancelQueries()

// Remove all inactive queries that begin with `posts` in the key
queryClient.removeQueries({ queryKey: ['clubs'], type: 'inactive' })

// Refetch all active queries
await queryClient.refetchQueries({ type: 'active' })

// Refetch all active queries that begin with `posts` in the key
await queryClient.refetchQueries({ queryKey: ['clubs'], type: 'active' })
      
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
            setUserSearchParams({ ...userSearchParams, where: { clubName: undefined } });
            return;
          }

          setUserSearchParams({ ...userSearchParams, where: { clubName: e.target.value } });
// Cancel all queries
await queryClient.cancelQueries()

// Remove all inactive queries that begin with `posts` in the key
queryClient.removeQueries({ queryKey: ['clubs'], type: 'inactive' })

// Refetch all active queries
await queryClient.refetchQueries({ type: 'active' })

// Refetch all active queries that begin with `posts` in the key
await queryClient.refetchQueries({ queryKey: ['clubs'], type: 'active' })

          router.replace(`/search/clubs?${createQueryString('clubName', e.target.value)}`);
      }} additionalClasses='text-base' placeholder='Search....' type='transparent' />
        <FaSearch  className='text-white cursor-pointer hover:text-primary-color hover:rotate-[360deg] transition-all text-xl'/>
      </div>} sortingBarContent={<div className="flex flex-col gap-2">
            <RadioGroup
              onValueChange={async (value) => {
              
              setUserSearchParams({ ...userSearchParams, orderBy: sortOptions.find((item) => item.label === value)!.sort || undefined })
            // Cancel all queries
await queryClient.cancelQueries()

// Remove all inactive queries that begin with `posts` in the key
queryClient.removeQueries({ queryKey: ['clubs'], type: 'inactive' })

// Refetch all active queries
await queryClient.refetchQueries({ type: 'active' })

// Refetch all active queries that begin with `posts` in the key
await queryClient.refetchQueries({ queryKey: ['clubs'], type: 'active' })
            }
           }
              orientation="horizontal"
              classNames={{wrapper:'max-h-96 overflow-y-auto h-full flex gap-2 flex-wrap', label:"text-white text-2xl"}}
            >
              {sortOptions.map((sort) => (
                <Radio key={sort.label} value={sort.label} classNames={{label:'text-xs text-white'}}>{sort.label}</Radio>
              ))}
    </RadioGroup>
        </div>} filterBarContent={
          <div className="flex flex-col gap-2">
             <CheckboxGroup
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
queryClient.removeQueries({ queryKey: ['clubs'], type: 'inactive' })

// Refetch all active queries
await queryClient.refetchQueries({ type: 'active' })

// Refetch all active queries that begin with `posts` in the key
await queryClient.refetchQueries({ queryKey: ['clubs'], type: 'active' })
              }}
              orientation="horizontal"
              classNames={{wrapper:'max-h-96 overflow-y-auto h-full flex gap-2 flex-wrap', label:"text-white text-2xl"}}
            >
              {filterOptions.map((filter) => (
                <Checkbox key={filter.label} value={filter.label} classNames={{label:'text-xs text-white'}}>{filter.label}</Checkbox>
              ))}
    </CheckboxGroup>
          </div>
          
   } />
    </div>
  );
}

export default Clubs;