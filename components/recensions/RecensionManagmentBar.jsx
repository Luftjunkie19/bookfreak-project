import '../stylings/mui-stylings.css';

import React from 'react';

function RecensionManagmentBar({ applyFilters,removeFromFilters, applySort, filters, sortings, filtersSelected, sortSelected }) {


  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

      applyFilters(value);
  
  };

  const handleSortChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value);
    applySort(value);
  };

  return (
    <div>
 
    </div>
  );
}

export default RecensionManagmentBar;
