'use client';

import 'node_modules/font-awesome/css/font-awesome.min.css'; 

import { AiOutlineReload } from "react-icons/ai";
import ReactStars from "react-rating-stars-component";
import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { formatDistanceToNow } from 'date-fns';
import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from 'react-icons/ti';


import guyAnimation
  from '../../assets/lottieAnimations/NoRecensions.json';
import translations from '../../assets/translations/BookPageTranslations.json';
import RecensionManagmentBar from '../managment-bar/RecensionManagmentBar';
import Recension from 'components/elements/recension/Recension';
import { DataView } from 'primereact/dataview';
import { useAuthContext } from "hooks/useAuthContext";
import { Rating } from "primereact/rating";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";
import Button from "components/buttons/Button";

type Props = {
  hasReadBook: boolean,
  hasRecension:boolean,
  recensions:any[],
  publishRecension:(recension:string, rate:number)=>void,
}

function RecensionsForBook({
  hasReadBook,
  hasRecension,
  recensions,
  publishRecension,
}: Props) {
  const { user } = useAuthContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recensionsNumber, setRecensionsNumber] = useState(10);
  const handlePublish = () => {
    // e.preventDefault();
    // publishRecension(resension, bookRate);
  };
  const selectedLanguage = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);
  // eslint-disable-next-line react-hooks/exhaustive-deps



  // const toggleContent = (id: string) => {
  //   setShowMore(id);
  // };

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
    <div className="flex flex-col gap-3">
        <form
          className="max-w-xl flex flex-col gap-2 w-full p-1"
          onSubmit={handlePublish}
        >
          <label className="flex flex-col">
            <span className="font-bold text-xl text-white">{translations.buttonsTexts.rateBook[selectedLanguage]}:</span>
          <ReactStars 
            classNames='h-fit p-0 m-0'
    count={10}
            onChange={(rating) => {
      console.log(rating)
    }}
    size={36}
    isHalf={true}
emptyIcon={<i className="far fa-star"></i>}
    halfIcon={<i className="fa fa-star-half-alt"></i>}
    fullIcon={<i className="fa fa-star"></i>}
    activeColor="#4777ff"
  />,
          </label>

          <label className="flex flex-col gap-1 w-full">
            <span className={`font-bold text-lg text-white`}>{translations.recensionLabel[selectedLanguage]}:</span>
            <textarea
              className="textarea text-white max-w-xl w-full max-h-36 min-h-28 h-full text-lg outline-none border-2 rounded-lg bg-dark-gray border-primary-color resize-none"
              placeholder={`${translations.recensionPlaceholder[selectedLanguage]}`}
            ></textarea>
          </label>

        <Button type="blue" additionalClasses="w-fit px-2">
            {translations.buttonsTexts.publishBtn[selectedLanguage]}
        </Button>
        
         
        </form>
      
        <RecensionManagmentBar
          applySort={selectSorting}
          applyFilters={addToFilters}
          sortings={sortOptions}
          filters={filterOptions}
          filtersSelected={selectedFilters}
          sortSelected={selectedSorting}
          />
      

        <div className="flex flex-col">
          <p className='text-white text-2xl font-semibold'>Recensions</p>
          <p className='text-white'>For now this book has been reviewed by {recensions.length} readers.</p>
          </div>
      
      <div className=" flex flex-col gap-3 max-h-[36rem] overflow-y-auto h-full">
        {recensions.map((item)=>( <Recension userImg={item.user.photoURL} username={item.user.nickname} rate={item.rating} isOwner={item.user.id === user?.id} content={item.comment} type={'white'} />))}
          </div>




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
