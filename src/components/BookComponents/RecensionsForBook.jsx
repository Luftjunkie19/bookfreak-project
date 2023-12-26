import React, {
  useEffect,
  useState,
} from 'react';

import { formatDistanceToNow } from 'date-fns';
import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';

import { Rating } from '@mui/material';

import guyAnimation
  from '../../assets/lottieAnimations/Animation - 1700233510410.json';
import translations from '../../assets/translations/BookPageTranslations.json';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';
import RecensionManagmentBar
  from '../RecensionsComponents/RecensionManagmentBar';

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
  const [users, setUsers] = useState([]);
  const { getDocuments, loadingDocs } = useRealtimeDocuments();
  const [showMore, setShowMore] = useState(false);
  const handlePublish = (e) => {
    e.preventDefault();
    console.log(recensions);
    publishRecension(resension, bookRate);
  };
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

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

  const toggleContent = () => {
    setShowMore(!showMore);
  };

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");

  const applyFilters = (filters) => {
    setSelectedFilters(filters);
    console.log(filters);
  };

  const applySort = (sort) => {
    setSelectedSort(sort);
  };
  const sortOptions = [
    {
      label: "Highest Rating",
      sort: (array) => {
        return array.slice().sort((a, b) => b.bookRate - a.bookRate);
      },
    },
    {
      label: "Lowest Rating",
      sort: (array) => {
        return array.slice().sort((a, b) => a.bookRate - b.bookRate);
      },
    },
    {
      label: "Earliest Recensions",
      sort: (array) => {
        return array.slice().sort((a, b) => a.dateOfFinish - b.dateOfFinish);
      },
    },
    {
      label: "Latest Recensions",
      sort: (array) => {
        return array.slice().sort((a, b) => b.dateOfFinish - a.dateOfFinish);
      },
    },
  ];

  const filteredItems = () => {
    if (selectedFilters.length > 0) {
      const temps = selectedFilters.map((selectedFilter) => {
        const temp = recensions.filter(
          (recension) => recension.bookRate === +selectedFilter
        );
        return temp;
      });

      return temps.flat();
    } else {
      return recensions;
    }
  };

  const sortedRecensions = () => {
    if (selectedSort.trim("") !== "") {
      return sortOptions
        .find((option) => option.label === selectedSort)
        .sort(filteredItems());
    } else {
      return filteredItems();
    }
  };

  return (
    <div className="sm:w-full xl:w-11/12 mt-4">
      {bookPages === readPages && hasReadBook && !hasRecension && (
        <form
          className="sm:w-full lg:w-1/2 py-2 sm:px-4 lg:px-0 lg:ml-5"
          onSubmit={handlePublish}
        >
          <label className="flex flex-col">
            <span>{translations.buttonsTexts.rateBook[selectedLanguage]}:</span>
            <Rating
              name="customized-10"
              className="sm:text-2xl xl:text-4xl"
              value={bookRate}
              onChange={(event, newValue) => {
                setBookRate(newValue);
              }}
              defaultValue={0.5}
              precision={1}
              max={10}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span>{translations.recensionLabel[selectedLanguage]}:</span>
            <textarea
              type="text"
              className="textarea textarea-bordered border-accColor resize-none w-full textarea-lg"
              onChange={(e) => setRecension(e.target.value)}
              placeholder={`${translations.recensionPlaceholder[selectedLanguage]}`}
            ></textarea>
          </label>

          <button className="btn bg-accColor hover:bg-blue-400 my-4 border-none text-white">
            {translations.buttonsTexts.publishBtn[selectedLanguage]}
          </button>
        </form>
      )}

      <p className="lg:text-xl font-medium text-white">
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

      <Rating
        name="customized-10"
        className="sm:text-2xl xl:text-4xl"
        value={
          !isNaN(
            recensions.reduce((prev, cur) => prev + cur.bookRate, 0) /
              recensions.length
          )
            ? Math.round(
                recensions.reduce((prev, cur) => prev + cur.bookRate, 0) /
                  recensions.length
              ).toFixed(1)
            : 0.0
        }
        readOnly
        defaultValue={0.0}
        precision={1}
        max={10}
      />

      <p className="sm:text-base lg:text-xl py-2 text-white">
        {translations.recensionsTo[selectedLanguage]}{" "}
        <span className="text-amber-300 not-italic font-bold">{title}</span>:
      </p>

      <div className="">
        <RecensionManagmentBar
          recensions={recensions}
          applySort={applySort}
          applyFilters={applyFilters}
        />
      </div>

      {sortedRecensions().length > 0 ? (
        <div className="flex flex-col sm:justify-center lg:justify-start w-full sm:items-center lg:items-start gap-4 sm:p-3 xl:p-1">
          {sortedRecensions().map((recensioner) => (
            <div
              key={recensioner.id}
              className="flex sm:w-full flex-col lg:w-3/4 justify-between xl:w-1/2 bg-accColor py-2 relative top-0 left-0"
            >
              {" "}
              {users.find((member) => member.id === recensioner.id) && (
                <img
                  className="sm:w-6 sm:h-4 md:w-12 md:h-8 absolute top-0 right-0"
                  src={
                    users.find((member) => member.id === recensioner.id)
                      .nationality.nationalityFlag
                  }
                  alt=""
                />
              )}
              <div className="px-4">
                <Rating
                  name="customized-10"
                  precision={1}
                  readOnly
                  defaultValue={recensioner.bookRate}
                  max={recensioner.bookRate}
                />
                <div>
                  <p className=" text-white italic font-light">
                    {showMore
                      ? recensioner.recension
                      : `${
                          recensioner.recension.length <= 100
                            ? recensioner.recension
                            : `${recensioner.recension.slice(0, 100)}...`
                        }`}
                  </p>
                  {recensioner.recension.trim(" ").length >= 100 && (
                    <button
                      className="text-white hover:text-primeColor transition-all duration-500"
                      onClick={toggleContent}
                    >
                      {showMore ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center gap-3 w-full px-2 pt-2">
                <div className="flex items-center gap-2">
                  <div className="sm:w-12 sm:h-12 2xl:w-16 2xl:h-16">
                    <img
                      className="w-full h-full rounded-full"
                      src={recensioner.photoURL}
                      alt=""
                    />
                  </div>
                  <p className="font-bold text-sm text-white">
                    {recensioner.displayName}
                  </p>
                </div>

                <p className=" text-white text-sm font-medium">
                  {formatDistanceToNow(recensioner.dateOfFinish)} ago
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col sm:justify-center lg:justify-start w-full sm:items-center lg:items-start gap-4 sm:p-3 xl:px-2">
          <p className="text-white font-bold sm:text-lg  lg:text-2xl">
            {translations.noRecensionYet[selectedLanguage]}
          </p>
          <Lottie className=" max-w-md" animationData={guyAnimation} />
        </div>
      )}
    </div>
  );
}

export default RecensionsForBook;
