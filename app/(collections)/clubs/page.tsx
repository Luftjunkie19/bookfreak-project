import '../../components/stylings/mui-stylings.css';

import React, {
  useCallback,
  useEffect,
  useState,
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
import ManagementBar from '../../../components/recensions/ManagementBar';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useSearchParams } from 'next/navigation';

function Clubs() {
  const {documents:clubs}=useGetDocuments('readersClubs');
  const [documents, setElements] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  

  const filterOptions = [{
    label:"<= 100 read pages", filter:(array)=>{
        return array.filter((doc)=>doc.requiredPagesRead <= 100);
    }
}, 
{
    label:">= 100 read pages", filter:(array)=>{
        return array.filter((doc)=>doc.requiredPagesRead >= 100);
    }
}, 
{
    label:">= 500 read pages", filter:(array)=>{
        return array.filter((doc)=>doc.requiredPagesRead >= 500);
    }
}, 
{
    label:">= 1000 read pages", filter:(array)=>{
        return array.filter((doc)=>doc.requiredPagesRead >= 1000);
    }
}, 
    
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
      return 10;
    } else {
      return 45;
    }
  };
  const fetchObjects = useCallback(
    (page) => {
      const start = (page - 1) * objectsOnPage();
      const end = start + objectsOnPage();
      const pageObjects = clubs.slice(start, end);
      return pageObjects;
    },
    [clubs]
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

  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

  const filterQuery = useSearchParams();

  
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
      return clubs;
    }
  };

  const sortedClubs = () => {
    if (selectedSort.trim() !== "") {
      return (sortOptions
        .find((option) => option.label === selectedSort) as { label: string; sort: (array: any) => any })
        .sort(filteredItems())
    } else {
      return filteredItems();
    }
  };

  const pagesAmount = Math.ceil(sortedClubs().length / objectsOnPage());
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  
  return (
    <div className={`min-h-screen h-full `}>
      
    </div>
  );
}

export default Clubs;