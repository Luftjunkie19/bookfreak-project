import React from 'react';

function ManagmentBar({applyFilters, applySort, sortText, filterText, sortOptions, filterOptions, sortSelected, filtersSelected}) {


  const handleChange = (event) => {
      const {
        target: { value },
      } = event;
      applyFilters(value); // Apply selected filters to recensions
    };
  
    const handleSortChange = (event) => {
      const {
        target: { value },
      } = event;
      applySort(value); // Apply selected sort to recensions
    };



  return (
    <div>
</div>
  )
}

export default ManagmentBar