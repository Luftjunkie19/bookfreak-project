import './stylings/backgrounds.css';

import Lottie from 'lottie-react';
import {
  FaBook,
  FaUserFriends,
} from 'react-icons/fa';
import { GiPodiumWinner } from 'react-icons/gi';
import { PiExamFill } from 'react-icons/pi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import animationLottie2
  from '../assets/lottieAnimations/Animation - 1699176767867.json';
import animationLottie from '../assets/lottieAnimations/mwUkFOkeLv.json';
import translations from '../assets/translations/homePageTranslations.json';
import HomeBooks from '../components/HomeComponents/HomeBooks';
import HomeClubs from '../components/HomeComponents/HomeClubs';
import HomeCompetitions from '../components/HomeComponents/HomeCompetitions';

function Home() {
  const selectedLangugage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
 
  return (
    <>
      <div className={`min-h-screen h-full ${!isDarkModed && "pattern-bg"}`}>
        <div className="flex justify-around items-center my-0 mx-auto gap-6 sm:flex-col-reverse md:flex-row">
          <div className="flex flex-col justify-center max-w-3xl w-full pt-8 px-3 z-10">
            <h2 className="text-4xl font-extrabold my-4 text-white">
              {translations.heroSection.title[selectedLangugage]}
            </h2>
            <p className=" text-white text-lg">
              {translations.heroSection.description[selectedLangugage]}
            </p>

            <Link
              to="/about-us"
              className="btn bg-accColor text-white transition-all duration-500 hover:bg-lightModeCol hover:text-primeColor lg:w-1/2 my-2"
            >
              {translations.heroSection.button[selectedLangugage]}
            </Link>
          </div>

          <div className="flex w-full max-w-2xl sm:flex-row sm:justify-around sm:items-center p-4 md:flex-col z-10">
            <Lottie
              className="sm:hidden lg:block  md:max-w-[16rem] md:max-h-[16rem] sm:self-end sm:h-full "
              animationData={animationLottie}
            />

            <Lottie
              className="w-full sm:w-5/6 md:max-w-[12rem] md:max-h-[12rem] lg:max-w-[16rem] lg:max-h-[16rem] md:self-start sm:h-full"
              animationData={animationLottie2}
            />
          </div>
        </div>

        <div className="w-full p-3">
          <p className={`text-3xl text-center ${isDarkModed ? "text-white" : "text-black"} font-bold p-2`}>
            {translations.homePage.explorationOptions.title[selectedLangugage]}
          </p>
          <div className="flex justify-around items-center w-full flex-wrap gap-4 p-2">
            <Link
              to="/books"
              className={`bg-accColor h-48 text-white sm:w-full md:w-2/5 xl:w-1/5 2xl:w-1/6 p-4 rounded-md flex flex-col justify-around items-center group hover:-translate-y-2 transition-all duration-500 ${isDarkModed ? "hover:bg-lightModeCol hover:text-primeColor" : "hover:bg-primeColor hover:text-white"} `}
        
           >
              <FaBook className="text-5xl" />
              <p className={`text-white ${isDarkModed ? "group-hover:text-primeColor" : "group-hover:text-white"}`}>
                {
                  translations.homePage.explorationOptions.option1[
                    selectedLangugage
                  ]
                }
              </p>
            </Link>

            <Link
              to="/tests"
              className={`bg-accColor h-48 text-white sm:w-full md:w-2/5 xl:w-1/5 2xl:w-1/6 p-4 rounded-md flex flex-col justify-around items-center group hover:-translate-y-2 transition-all duration-500 ${isDarkModed ? "hover:bg-lightModeCol hover:text-primeColor" : "hover:bg-primeColor hover:text-white"} `}
            >
              <PiExamFill className="text-5xl" />
              <p className={`text-white ${isDarkModed ? "group-hover:text-primeColor" : "group-hover:text-white"}`}>
                {
                  translations.homePage.explorationOptions.option2[
                    selectedLangugage
                  ]
                }
              </p>
            </Link>

            <Link
              to="/competitions"
              className={`bg-accColor h-48 text-white sm:w-full md:w-2/5 xl:w-1/5 2xl:w-1/6 p-4 rounded-md flex flex-col justify-around items-center group hover:-translate-y-2 transition-all duration-500 ${isDarkModed ? "hover:bg-lightModeCol hover:text-primeColor" : "hover:bg-primeColor hover:text-white"} `}
            >
              <GiPodiumWinner className="text-5xl" />
              <p className={`text-white ${isDarkModed ? "group-hover:text-primeColor" : "group-hover:text-white"}`}>
                {
                  translations.homePage.explorationOptions.option3[
                    selectedLangugage
                  ]
                }
              </p>
            </Link>

            <Link
              to="/readers-clubs"
              className={`bg-accColor h-48 text-white sm:w-full md:w-2/5 xl:w-1/5 2xl:w-1/6 p-4 rounded-md flex flex-col justify-around items-center group hover:-translate-y-2 transition-all duration-500 ${isDarkModed ? "hover:bg-lightModeCol hover:text-primeColor" : "hover:bg-primeColor hover:text-white"} `}
            >
              <FaUserFriends className="text-5xl" />
              <p className={`text-white ${isDarkModed ? "group-hover:text-primeColor" : "group-hover:text-white"}`}>
                {
                  translations.homePage.explorationOptions.option4[
                    selectedLangugage
                  ]
                }
              </p>
            </Link>
          </div>
        </div>

        <HomeBooks />

        <h2 className={`text-4xl ${isDarkModed ? "text-white" : "text-black"} font-bold p-2`}>
          {translations.homePage.recentTexts.competitions[selectedLangugage]}
        </h2>
        <HomeCompetitions />

        <h2 className={`text-4xl ${isDarkModed ? "text-white" : "text-black"} font-bold p-2`}>
          {translations.homePage.recentTexts.clubs[selectedLangugage]}
        </h2>
        <HomeClubs />
      </div>
    </>
  );
}

export default Home;
