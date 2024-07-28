/* eslint-disable react-hooks/exhaustive-deps */
import { AiOutlineReload } from "react-icons/ai";

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { formatDistanceToNow } from 'date-fns';
import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';


import guyAnimation
  from '../../assets/lottieAnimations/NoRecensions.json';
import translations from '../../assets/translations/BookPageTranslations.json';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';
import RecensionManagmentBar from '../managment-bar/RecensionManagmentBar';
import Recension from 'components/elements/recension/Recension';
import { DataView } from 'primereact/dataview';

type Props = {
   bookPages:number,
  readPages:number,
  title:string,
  hasReadBook: boolean,
  hasRecension:boolean,
  recensions:any[],
  publishRecension:(recension:string, rate:number)=>void,
}

function RecensionsForBook({
  bookPages,
  readPages,
  title,
  hasReadBook,
  hasRecension,
  recensions,
  publishRecension,
}: Props) {
  const [bookRate, setBookRate] = useState(0);
  const [resension, setRecension] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const { getDocuments, loadingDocs } = useRealtimeDocuments();
  const [showMore, setShowMore] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recensionsNumber, setRecensionsNumber] = useState(10);
  const handlePublish = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    publishRecension(resension, bookRate);
  };
  const selectedLanguage = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);
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

  const toggleContent = (id: string) => {
    setShowMore(id);
  };

  const [selectedFilters, setFilters] = useState<any[]>([]);
  const [selectedSorting, setSorting] = useState <any | null>(null);
  const filterOptions = [
    {
      label: "⭐ 10.0",
      filterArray: (array: any[]) => {
        return array.filter((item: { bookRate: number; }) => item.bookRate === 10);
      },
    },
    {
      label: "⭐ 9.0",
      filterArray: (array: any[]) => {
        return array.filter((item: { bookRate: number; }) => item.bookRate === 9);
      },
    },
    {
      label: "⭐ 8.0",
      filterArray: (array: any[]) => {
        return array.filter((item: { bookRate: number; }) => item.bookRate === 8);
      },
    },
    {
      label: "⭐ 7.0",
      filterArray: (array: any[]) => {
        return array.filter((item: { bookRate: number; }) => item.bookRate === 7);
      },
    },
    {
      label: "⭐ 6.0",
      filterArray: (array: any[]) => {
        return array.filter((item: { bookRate: number; }) => item.bookRate === 6);
      },
    },
    {
      label: "⭐ 5.0",
      filterArray: (array: any[]) => {
        return array.filter((item: { bookRate: number; }) => item.bookRate === 5);
      },
    },
    {
      label: "⭐ 4.0",
      filterArray: (array: any[]) => {
        return array.filter((item: { bookRate: number; }) => item.bookRate === 4);
      },
    },
    {
      label: "⭐ 3.0",
      filterArray: (array: any[]) => {
        return array.filter((item: { bookRate: number; }) => item.bookRate === 3);
      },
    },
    {
      label: "⭐ 2.0",
      filterArray: (array: any[]) => {
        return array.filter((item: { bookRate: number; }) => item.bookRate === 2);
      },
    },
    {
      label: "⭐ 1.0",
      filterArray: (array: any[]) => {
        return array.filter((item: { bookRate: number; }) => item.bookRate === 1);
      },
    },
  ];

  const sortOptions = [
    {
      label: "Highest Rating",
      sortArray: (array: any[]) => {
        return array.slice().sort((a: { bookRate: number; }, b: { bookRate: number; }) => b.bookRate - a.bookRate);
      },
    },
    {
      label: "Lowest Rating",
      sortArray: (array: any[]) => {
        return array.slice().sort((a: { bookRate: number; }, b: { bookRate: number; }) => a.bookRate - b.bookRate);
      },
    },
    {
      label: "Earliest Recensions",
      sortArray: (array: any[]) => {
        return array.slice().sort((a: { dateOfFinish: number; }, b: { dateOfFinish: number; }) => a.dateOfFinish - b.dateOfFinish);
      },
    },
    {
      label: "Latest Recensions",
      sortArray: (array: any[]) => {
        return array.slice().sort((a: { dateOfFinish: number; }, b: { dateOfFinish: number; }) => b.dateOfFinish - a.dateOfFinish);
      },
    },
  ];

  const addToFilters = (label: any) => {
    const items = [...selectedFilters, label];
    console.log(items);
  setFilters(items);
  }

    const selectSorting = (label: any) => {
    setSorting(label);
    console.log(selectedSorting);
  }


  const selectFilter = useMemo(() => {
    if (selectedFilters.length > 0) {
      return selectedFilters.map((item) => {
      const filterIndex = Array.from(item)[0] as string;
  
      const filterItem = filterOptions[+filterIndex].label;
  
      return filterItem;
    })
    }
  },[selectedFilters]);

  const sortingSelected = useMemo(() => {
    if (selectedSorting) {
      const sortIndex = Array.from(selectedSorting)[0] as string;

      const selectedOption = sortOptions[+sortIndex].label;

      return selectedOption;
    }
  },[selectedSorting]);
 


  const filteredArray = useMemo(() => {
    let array: any[] = [];
    if (selectFilter && selectFilter.length > 0) {
      // eslint-disable-next-line array-callback-return
      selectFilter.map((filter) => {
        const option = filterOptions.find((filterOption) => filterOption.label === filter);
  
        array.push(...(option as  {
    label: string;
    filterArray: (array: any) => any;
}).filterArray(recensions))

      });
     return array;
    } else {
      return recensions;
    }
  },[filterOptions, recensions, selectFilter])

  const sortedArray = useMemo(() => {
    if (sortingSelected !== "") {
      const selectedSortingOption = sortOptions.find((sort) => sort.label === sortingSelected);
      if (selectedSortingOption) {
            return selectedSortingOption.sortArray(filteredArray);
      } else {
      return filteredArray;
    }
    } else {
      return filteredArray;
    }
  },[filteredArray, sortingSelected, sortOptions])


  return (
    <div className="p-2 flex flex-col gap-6">
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

      <p>{JSON.stringify(selectedFilters)} {JSON.stringify(selectedSorting)}</p>
  
        <RecensionManagmentBar
          applySort={selectSorting}
          applyFilters={addToFilters}
          sortings={sortOptions}
          filters={filterOptions}
          filtersSelected={selectedFilters}
          sortSelected={selectedSorting}
      />
      




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
