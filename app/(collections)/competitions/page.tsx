import React, {
  useCallback,
  useEffect,
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
import ManagementBar from '../../../components/recensions/ManagementBar';
import useGetDocuments from '../../../hooks/useGetDocuments';

function Competitions() {
  const { documents } = useGetDocuments("competitions");
  const [elements, setElements] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterQuery, setFilterQuery] = useSearchParams({ filters: "" });

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



  const objectsOnPage = () => {
    if (document.body.clientWidth > 0 && document.body.clientWidth < 1024) {
      return 15;
    } else {
      return 45;
    }
  };
  const fetchObjects = useCallback(
    (page) => {
      const start = (page - 1) * objectsOnPage();
      const end = start + objectsOnPage();
      const pageObjects = documents.slice(start, end);
      return pageObjects;
    },
    [documents]
  );

  const handlePagesChange = (e, value) => {
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

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");

  const applyFilters = (filters) => {
    setSelectedFilters(filters);
    console.log(filters);
  };

  const applySort = (sort) => {
    setSelectedSort(sort);
  };

  const filteredItems = () => {
    if (selectedFilters.length > 0) {
      const filteredDocuments = selectedFilters.reduce((result, selectedFilter) => {
        const filterOption = filterOptions.find(option => option.label === selectedFilter);
  
        if (filterOption) {
          const temp = filterOption.filter(result);
          return temp;
        }
  
        return result;
      }, documents);
  
      return filteredDocuments;
    } else {
      // If no filters selected, return all documents
      return elements;
    }
  };

  const sortedClubs = () => {
    if (selectedSort.trim() !== "" && sortOptions.find((option) => option.label === selectedSort)) {
      return (sortOptions
        .find((option) => option.label === selectedSort) as {
    label: string;
    sort: (array: any) => any;
} )
        .sort(filteredItems())
    } else {
      return filteredItems();
    }
  };

  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const pagesAmount = Math.ceil(sortedClubs().length / objectsOnPage());
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  return (
    <div className={`min-h-screen h-full overflow-x-hidden w-full ${!isDarkModed && "pattern-bg"}`}>
     <div className="flex gap-2 flex-wrap items-center justify-center py-4">
<ManagementBar filterText={reuseableTranslations.categoryText[selectedLanguage]} sortText={reuseableTranslations.sortTexts[selectedLanguage]} sortOptions={selectedSort} filterOptions={filterOptions} sortSelected={selectedSort} filtersSelected={selectedFilters} applyFilters={applyFilters} applySort={applySort} />
     </div>

      
    </div>
  );
}

export default Competitions;
