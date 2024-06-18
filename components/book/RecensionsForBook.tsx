import '../../pages/stylings/backgrounds.css';

import {
  useEffect,
  useState,
} from 'react';

import { formatDistanceToNow } from 'date-fns';
import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';


import guyAnimation
  from '../../assets/lottieAnimations/NoRecensions.json';
import translations from '../../assets/translations/BookPageTranslations.json';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';
import RecensionManagmentBar from '../recensions/RecensionManagmentBar';

function RecensionsForBook({
  bookPages,
  readPages,
  title,
  hasReadBook,
  hasRecension,
  recensions,
  setRecensions,
  publishRecension,
}) {
  const [bookRate, setBookRate] = useState(0);
  const [resension, setRecension] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const { getDocuments, loadingDocs } = useRealtimeDocuments();
  const [showMore, setShowMore] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recensionsNumber, setRecensionsNumber] = useState(10);
  const handlePublish = (e) => {
    e.preventDefault();
    publishRecension(resension, bookRate);
  };
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadUsers = async () => {
    const documents = await getDocuments("users");

    if (Array.isArray(documents)) {
      setUsers(documents);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const toggleContent = (id) => {
    setShowMore(id);
  };

const [selectedFilters, setFilters] = useState([]);
  const [selectedSorting, setSorting] = useState("");
  const filterOptions = [
    {
      label: "⭐ 10.0",
      filterArray: (array) => {
        return array.filter((item) => item.bookRate === 10);
      },
    },
    {
      label: "⭐ 9.0",
      filterArray: (array) => {
        return array.filter((item) => item.bookRate === 9);
      },
    },
    {
      label: "⭐ 8.0",
      filterArray: (array) => {
        return array.filter((item) => item.bookRate === 8);
      },
    },
    {
      label: "⭐ 7.0",
      filterArray: (array) => {
        return array.filter((item) => item.bookRate === 7);
      },
    },
    {
      label: "⭐ 6.0",
      filterArray: (array) => {
        return array.filter((item) => item.bookRate === 6);
      },
    },
    {
      label: "⭐ 5.0",
      filterArray: (array) => {
        return array.filter((item) => item.bookRate === 5);
      },
    },
    {
      label: "⭐ 4.0",
      filterArray: (array) => {
        return array.filter((item) => item.bookRate === 4);
      },
    },
    {
      label: "⭐ 3.0",
      filterArray: (array) => {
        return array.filter((item) => item.bookRate === 3);
      },
    },
    {
      label: "⭐ 2.0",
      filterArray: (array) => {
        return array.filter((item) => item.bookRate === 2);
      },
    },
    {
      label: "⭐ 1.0",
      filterArray: (array) => {
        return array.filter((item) => item.bookRate === 1);
      },
    },
  ];

  const sortOptions = [
    {
      label: "Highest Rating",
      sortArray: (array) => {
        return array.slice().sort((a, b) => b.bookRate - a.bookRate);
      },
    },
    {
      label: "Lowest Rating",
      sortArray: (array) => {
        return array.slice().sort((a, b) => a.bookRate - b.bookRate);
      },
    },
    {
      label: "Earliest Recensions",
      sortArray: (array) => {
        return array.slice().sort((a, b) => a.dateOfFinish - b.dateOfFinish);
      },
    },
    {
      label: "Latest Recensions",
      sortArray: (array) => {
        return array.slice().sort((a, b) => b.dateOfFinish - a.dateOfFinish);
      },
    },
  ];

  const addToFilters = (labels) => {


    setFilters((prev) => 
 labels.flat()
    );
  }
  
  const removeFromFilters = (label) => {
    setFilters((prev) => (
       [...prev].filter((item) => item !== label)
    ));
  }

  const selectSorting = (label) => {
    setSorting(label);
    console.log(selectedSorting);
  }

  const filteredArray = () => {
    let array: any[] = []
    if (selectedFilters.length > 0) {
      // eslint-disable-next-line array-callback-return
      selectedFilters.map((filter) => {
        const option = filterOptions.find((filterOption) => filterOption.label === filter);
  
        array.push(...(option as  {
    label: string;
    filterArray: (array: any) => any;
}).filterArray(recensions))

      });
     return  array;
    } else {
      return recensions;
    }
  }

  const sortedArray = () => {
    if (selectedSorting !== "") {
      const selectedSortingOption = sortOptions.find((sort) => sort.label === selectedSorting);
    return (selectedSortingOption as  {
    label: string;
    sortArray: (array: any) => any;
}).sortArray(filteredArray());
    } else {
      return filteredArray();
    }
  }


  return (
    <div className="sm:w-full xl:w-11/12 mt-4">
      {readPages === bookPages && hasReadBook && !hasRecension && (
        <div></div>
        // <form
        //   className="sm:w-full lg:w-1/2 py-2 sm:px-4 lg:px-0 lg:ml-5"
        //   onSubmit={handlePublish}
        // >
        //   <label className="flex flex-col">
        //     <span className="font-bold text-lg">{translations.buttonsTexts.rateBook[selectedLanguage]}:</span>
        //     <Rating
        //       name="customized-10"
        //       className="sm:text-2xl md:text-[2.5rem] xl:text-5xl"
        //       value={bookRate}
        //       onChange={(event, newValue) => {
        //         setBookRate(newValue);
        //       }}
        //       defaultValue={0.5}
        //       precision={1}
        //       max={10}
        //     />
        //   </label>

        //   <label className="flex flex-col gap-2">
        //     <span className={`font-bold text-lg ${isDarkModed ? "text-white" :"text-black"}`}>{translations.recensionLabel[selectedLanguage]}:</span>
        //     <textarea
        //       type="text"
        //       className="textarea text-lg textarea-bordered border-accColor resize-none w-full textarea-lg"
        //       onChange={(e) => setRecension(e.target.value)}
        //       placeholder={`${translations.recensionPlaceholder[selectedLanguage]}`}
        //     ></textarea>
        //   </label>

        //   <button className="btn bg-accColor hover:bg-blue-400 my-4 border-none text-white">
        //     {translations.buttonsTexts.publishBtn[selectedLanguage]}
        //   </button>
        // </form>
      )}

      <p className={`lg:text-xl font-medium ${isDarkModed ? "text-white" :"text-black"}`}>
        {translations.averageRateText[selectedLanguage]}:{" "}
        <span className="font-bold text-3xl text-amber-300">
          {!isNaN(
            recensions.reduce((prev, cur) => prev + cur.bookRate, 0) /
              recensions.length
          )
            ? (
                recensions.reduce((prev, cur) => prev + cur.bookRate, 0) /
                recensions.length
              ).toFixed(1)
            : 0.0}
        </span>
      </p>

    


      {/* <div className="">
        <RecensionManagmentBar
          recensions={recensions}
          applySort={selectSorting}
          applyFilters={addToFilters}
          removeFromFilters={removeFromFilters}
          sortings={sortOptions}
          filters={filterOptions}
          filtersSelected={selectedFilters}
          sortSelected={selectedSorting}
        />
      </div> */}

      {sortedArray().slice(currentIndex, recensionsNumber).length > 0 ? (
        <div className="flex flex-col gap-3">
    
        </div>
      ) : (
        <div className="flex flex-col">
          <p className="text-white font-bold sm:text-lg lg:text-2xl">
            {translations.noRecensionYet[selectedLanguage]}
          </p>
          <Lottie className=" max-w-md" animationData={guyAnimation} />
        </div>
      )}


      {/* <div className="flex gap-4">
      {currentIndex > 0 && sortedArray().slice(currentIndex - 10, recensionsNumber - 10).length > 0 && <button className="btn bg-accColor border-none" onClick={() => {
        setCurrentIndex(prev => prev - 10);
        setRecensionsNumber(prev => prev - 10);
      }}>Back</button>}
      {sortedArray().slice(currentIndex + 10, recensionsNumber + 10).length > 0 && <button className="btn bg-accColor border-none" onClick={() => {
        setCurrentIndex(prev => prev + 10);
        setRecensionsNumber(prev => prev + 10);
      }}>Next</button>}
      </div> */}
      
    </div>
  );
}

export default RecensionsForBook;
