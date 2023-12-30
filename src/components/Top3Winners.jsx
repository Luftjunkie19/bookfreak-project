import React from 'react';

import { FaCrown } from 'react-icons/fa6';
import { useSelector } from 'react-redux';

import defaultImg
  from '../assets/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg';
import competitionTranslations
  from '../assets/translations/CompetitionsTranslations.json';

function Top3Winners({ topWinners }) {
  // Create an artificial second place if there is only one person
  const secondPlace = { photoURL: defaultImg, nickname: "Second Place" };
  // Check if there is a third winner
  const hasThirdPlace = topWinners.length >= 2;
  // Use default values for the third place if not present
  const thirdPlace = hasThirdPlace
    ? topWinners[1]
    : { photoURL: defaultImg, nickname: "Third Place" };
    const isDarkModed = useSelector((state) => state.mode.isDarkMode);
    const selectedLanguage = useSelector(
      (state) => state.languageSelection.selectedLangugage
    );
  return (
    <div className="sm:w-full md:w-1/2 xl:w-1/2">
      <div className="flex flex-col justify-center items-center w-full">
        <div className="flex sm:flex-col md:flex-row gap-5 justify-center items-center w-full min-h-[24rem]">
          {topWinners.map((winner, i) => (
            <div
              key={i}
              className={`${
                i === 0
                  ? `md:self-start md:order-2 md:justify-self-start`
                  : `md:self-center md:justify-self-center`
              } gap-2 flex flex-col ${
                i === 1 ? "md:order-1" : "md:order-3"
              } sm:w-full `}
            >
              <div className="">
                {i === 0 && (
                  <FaCrown className="mx-auto text-yellow-400 text-2xl" />
                )}
                <img
                  src={winner?.photoURL}
                  alt=""
                  className={`w-16 h-16 md:h-20 md:w-20 ${
                    i === 0 && "md:h-24 md:w-24"
                  } rounded-full object-cover mx-auto`}
                />
              </div>
              <p
                className={`text-center text-white text-lg font-semibold ${
                  i === 0
                    ? "text-yellow-500"
                    : i === 1
                      ? "text-gray-400"
                      : " text-amber-800"
                }`}
              >
                {winner?.nickname}
              </p>
            </div>
          ))}
          {/* Display artificial second place if there is only one person */}
          {topWinners.length < 2 && (
            <div className="flex flex-col items-center md:order-1">
              <img
                src={secondPlace.photoURL}
                alt=""
                className="w-auto h-auto max-w-16 max-h-16 md:max-w-20 md:max-h-20 rounded-full object-cover"
              />
              <p className="text-center font-semibold text-gray-400 text-lg">
              {competitionTranslations.competitionObject.expiration.rankingWinner.secondPlace[selectedLanguage]}
              </p>
            </div>
          )}
          {/* Display default third place if not present */}
          {!hasThirdPlace && (
            <div className="flex flex-col items-center md:order-3">
              <img
                src={thirdPlace.photoURL}
                alt=""
                className="w-auto h-auto max-w-16 max-h-16 md:max-w-20 md:max-h-20 rounded-full object-cover"
              />
              <p className="text-center text-amber-800 font-semibold text-lg">
                {competitionTranslations.competitionObject.expiration.rankingWinner.thirtPlace[selectedLanguage]}
              </p>
            </div>
          )}
        </div>
        <p className="text-center text-xl text-orange-400 font-semibold py-2">
       {competitionTranslations.competitionObject.expiration.rankingWinner.winnerMsg[selectedLanguage]}    {topWinners[0]?.nickname}
        </p>
      </div>
    </div>
  );
}

export default Top3Winners;
