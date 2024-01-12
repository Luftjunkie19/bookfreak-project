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

import {
  Autocomplete,
  Pagination,
  TextField,
} from '@mui/material';

import itemReward from '../../assets/ItemReward.webp';
import lottieAnimation
  from '../../assets/lottieAnimations/Animation - 1700320134586.json';
import moneyPrize from '../../assets/MoneyPrize.webp';
import competitionsTranslations
  from '../../assets/translations/CompetitionsTranslations.json';
import formTranslations from '../../assets/translations/FormsTranslations.json';
import CompetitionManagmentBar
  from '../../components/RecensionsComponents/CompetitionManagmentBar';
import useGetDocuments from '../../hooks/useGetDocuments';

function Competitions() {
  const { documents } = useGetDocuments("competitions");
  const [elements, setElements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterQuery, setFilterQuery] = useSearchParams({ filters: "" });

  const filterOptions = [{
    label:"prize (Money)", filter:(array)=>{
        return array.filter((doc)=>doc.prize.moneyPrize.amount > 0);
    }
}, 
{
    label:"prize (Item)", filter:(array)=>{
        return array.filter((doc)=>doc.prize.itemPrize.typeOfPrize !== undefined || doc.prize.itemPrize.typeOfPrize !== null);
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
      setElements(pageObjects);
      return;
    }

    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const pageObjects = fetchObjects(currentPage - 1);
      setElements(pageObjects);
      return;
    }
    setCurrentPage(value);
  };

 

  useEffect(() => {
    if (documents.length > 0) {
      const fetchedObjects = fetchObjects(currentPage);
      setElements(fetchedObjects);
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
    if (selectedSort.trim("") !== "") {
      return sortOptions
        .find((option) => option.label === selectedSort)
        .sort(filteredItems())
    } else {
      return filteredItems();
    }
  };

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const pagesAmount = Math.ceil(sortedClubs().length / objectsOnPage());
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  return (
    <div className={`min-h-screen h-full overflow-x-hidden w-full ${!isDarkModed && "pattern-bg"}`}>
     <div className="flex gap-2 flex-wrap items-center justify-center py-4">
<CompetitionManagmentBar applyFilters={applyFilters} applySort={applySort}/>
<Autocomplete
          className="sm:w-3/4 md:max-w-lg"
          onChange={(e, value) => {
            if (value === null) {
              setFilterQuery(
                (prev) => {
                  prev.set("filters", "");
                  return prev;
                },
                { replace: true }
              );
              return;
            }
            setFilterQuery(
              (prev) => {
                prev.set("filters", value);
                return prev;
              },
              { replace: true }
            );
          }}
          sx={{
            ".MuiAutocomplete-input": {
              color: "white",
            },
            ".MuiAutocomplete-inputRoot": {
              background: "#4267B5",
            },

            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              border: "0",
            },
          }}
          id="free-solo-demo"
          freeSolo
          options={documents.map((option) => option.competitionTitle)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={formTranslations.placeHoldersCollections.competitionsName[selectedLanguage]}
              onChange={(e, value) => {
                setFilterQuery(
                  (prev) => {
                    prev.set("filters", e.target.value);
                    return prev;
                  },
                  { replace: true }
                );
              }}
            />
          )}
        />
     </div>

      <div className="flex w-full flex-wrap justify-center gap-4 m-2">
        {sortedClubs() && sortedClubs().length > 0 ? (
          sortedClubs().filter((doc) =>
          doc.competitionTitle
            .toLowerCase()
            .includes(filterQuery.get("filters").toLowerCase())
        ).map((doc) => (
            <Link
              to={`/competition/${doc.id}`}
              key={doc.id}
              className={`flex ${
                (doc.expiresAt - new Date().getTime()) / 86400000 <= 0 ?
                "bg-gray-500 text-black hover:bg-gray-800" : `${isDarkModed ? "bg-accColor" : "bg-primeColor"} ${isDarkModed ? "hover:bg-lightModeCol hover:text-primeColor" : "hover:bg-accColor hover:text-white"}`
              } sm:w-4/5 md:w-[45%] max-w-xs  border-2 border-white justify-between items-center flex-row py-4 rounded-lg text-white   shadow-md hover:shadow-lg  hover:shadow-black transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex flex-col justify-around px-2">
                <h3 className=" font-semibold">{doc.competitionTitle}</h3>
                <p>{doc.competitionsName}</p>
                <p>
                  {competitionsTranslations.competitionObject.prize[selectedLanguage]}:{" "}
                  {doc.prize.moneyPrize.amount > 0
                    ? `${(doc.prize.moneyPrize.amount / 100).toFixed(
                        2
                      )} ${doc.prize.moneyPrize.currency.toUpperCase()}`
                    : doc.prize.itemPrize.typeOfPrize}
                </p>
                <p>Est. {formatDistanceToNow(doc.createdBy.createdAt)} ago</p>
              </div>
              <div>
                {doc.prize.moneyPrize.amount > 0 ? (
                  <img src={moneyPrize} className="w-12 h-12" alt="" />
                ) : (
                  <img src={itemReward} className="w-12 h-12" alt="" />
                )}
              </div>
            </Link>
          ))
        ) : (
          <div>
            <Lottie animationData={lottieAnimation} />
            <p className={`text-4xl font-bold ${isDarkModed ? "text-white" : "text-black"} text-center`}>
              No competitions added yet
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-center items-center p-2">
        <Pagination
          variant="outlined"
          color="primary"
          showLastButton
          showFirstButton
          count={pagesAmount}
          onChange={handlePagesChange}
        />
      </div>
    </div>
  );
}

export default Competitions;
