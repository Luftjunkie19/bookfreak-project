import React from 'react';

import { useSelector } from 'react-redux';

import defaultImg
  from '../assets/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg';

function Top3Winners({ topWinners }) {
  // Create an artificial second place if there is only one person
  const secondPlace = { photoURL: defaultImg, nickname: "Second Place" };
  // Check if there is a third winner
  const hasThirdPlace = topWinners.length > 2;
  // Use default values for the third place if not present
  const thirdPlace = hasThirdPlace
    ? topWinners[2]
    : { photoURL: defaultImg, nickname: "Third Place" };
    const isDarkModed = useSelector((state) => state.mode.isDarkMode);
    const selectedLanguage = useSelector(
      (state) => state.languageSelection.selectedLangugage
    );
  return (
<>
      <div className="flex w-full sm:flex-col items-center justify-center md:flex-row gap-12 py-3">
        {topWinners.length < 2 && <div className='flex md:order-1 h-fit  rounded-lg bg-discord  p-4 flex-col gap-3 justify-center items-center'>
          <div className="flex  w-full gap-2 sm:flex-row justify-around items-center md:flex-col">
          <img src={secondPlace.photoURL} className='w-16 h-16 rounded-full' alt="" />
          <p className='text-white text-center'>{secondPlace.nickname}</p>
          </div>
            <p>#{2}</p>
          <p>{0} points</p>
        </div>}

        {topWinners.map((contender, i) => (<div className={`flex sm:w-full max-w-xs rounded-lg bg-discord py-4 px-8 flex-col gap-3 justify-center items-center ${i === 0 ? 'md:mb-8 md:order-2' : ''}`}>
           <div className="flex gap-2 justify-around w-full  sm:flex-row items-center md:flex-col">
          <img className={`${i === 0 ? 'w-24 h-24 rounded-full' : 'w-16 h-16 rounded-full'}`} src={contender.photoURL} alt='' />
            <p className={`${i === 0 ? 'text-yellow-400 text-lg' : 'text-white'}`}>{contender.nickname}</p>
            </div>
          <p className={`${i === 0 ? 'text-yellow-400 text-lg' : 'text-white'}`}>#{i + 1}</p>
          <p>{contender.gainedPoints} points</p>
</div>))}
        
        {thirdPlace && <div className='flex sm:w-full max-w-xs md:order-3 h-fit  rounded-lg bg-discord  p-4 flex-col gap-3 justify-center items-center'>
               <div className="flex gap-2 justify-around w-full sm:flex-row items-center md:flex-col">
          <img src={thirdPlace.photoURL} className='w-16 h-16 rounded-full' alt="" />
            <p className='text-white text-center'>{thirdPlace.nickname}</p>
            </div>
          <p className='text-white'>#{3}</p>
          <p>{0} points</p>
        </div>}
        

        </div>
</>

  );
}

export default Top3Winners;
