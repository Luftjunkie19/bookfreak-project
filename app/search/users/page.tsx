'use client';
import { CheckboxGroup, Pagination, RadioGroup } from '@nextui-org/react'
import FilterBar from 'components/Sidebars/right/FilterBar';
import React from 'react'

type Props = {}

function Page({ }: Props) {
  return (
    <div className='w-full flex'>

      <div className="flex flex-col gap-6 w-full h-full">

        <div className="grid h-full 2xl:grid-cols-6 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-1"></div>

<Pagination classNames={{
  'wrapper':' self-center mx-auto w-full p-2',
  'cursor':"bg-primary-color",
}} total={10}   showControls loop color='primary' initialPage={1}  />
      </div>


              <FilterBar filterBarContent={
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
             <CheckboxGroup
              label="Filters"
              onValueChange={(value:string[]) => {
                console.log(value);
              }}
              orientation="horizontal"
              classNames={{wrapper:'max-h-96 overflow-y-auto h-full flex gap-2 flex-wrap', label:"text-white text-2xl"}}
            >
              {/* {filterOptions.map((filter) => (
                <Checkbox key={filter.label} value={filter.label} classNames={{label:'text-xs text-white'}}>{filter.label}</Checkbox>
              ))} */}
    </CheckboxGroup>
          </div>
          
      <div className="flex flex-col gap-2">
            <RadioGroup
              onValueChange={(value)=>console.log(value)}
      label="Sorting"
              orientation="horizontal"
              classNames={{wrapper:'max-h-96 overflow-y-auto h-full flex gap-2 flex-wrap', label:"text-white text-2xl"}}
            >
              {/* {sortOptions.map((sort) => (
                <Radio key={sort.label} value={sort.label} classNames={{label:'text-xs text-white'}}>{sort.label}</Radio>
              ))} */}
    </RadioGroup>
        </div>
          
</div>} />
    </div>
  )
}

export default Page