import { Select, SelectItem } from '@nextui-org/react';

import React from 'react';

type Props = {
  applyFilters: (filterLabel: any) => void,
  applySort: (filterLabel: any) => void,
  filters: {
    label: string;
    filterArray: (array: any[]) => any[];
  }[],
  sortings: {
    label: string;
    sortArray: (array: any[]) => any[];
  }[],
  filtersSelected: any[],
  sortSelected: any
}

function RecensionManagmentBar({ applyFilters, applySort, filters, sortings, filtersSelected, sortSelected }:Props) {

  return (
    <div className='flex gap-4 items-center overflow-x-auto'>
      <Select
        label="Filters"
        selectionMode="multiple"
        placeholder="Select filters"
        selectedKeys={new Set(filtersSelected)}
        className="max-w-xs w-full"
        onSelectionChange={(keys) => {
          applyFilters(keys);
           console.log(keys)
        }}
      >
        {filters.map((filter:{
    label: string;
    filterArray: (array: any[]) => any[];
}, i:number) => (
          <SelectItem key={i}>
            {filter.label}
          </SelectItem>
        ))}
      </Select>

       <Select
        label="Sorting"
        selectionMode='single'
        placeholder="Select Sorting"
        selectedKeys={new Set(sortSelected)}
className="max-w-xs w-full"
        onSelectionChange={(keys) => {
        
          applySort(keys);
          
           console.log(keys)
        }}
      >
        {sortings.map((animal, i ) => (
          <SelectItem key={i}>
            {animal.label}
          </SelectItem>
        ))}
      </Select>
     

    </div>
  );
}

export default RecensionManagmentBar;
