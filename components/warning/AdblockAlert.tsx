import { useDetectAdBlock } from 'adblock-detect-react';
import { GoAlertFill } from 'react-icons/go';
import { useSelector } from 'react-redux';

import AlertTranslations from '../../assets/translations/AlertMessages.json';

function AdblockAlert() {
  const isAdblockOn = useDetectAdBlock();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  return (
    <>
      {isAdblockOn &&
    <div className="fixed z-[99999999] top-0 left-0 w-full h-full bg-imgCover flex flex-col justify-center items-center group">
      <div className="flex flex-col gap-2 justify-center items-center bg-white rounded-xl py-8 px-4 mx-3 sm:w-4/5 lg:w-3/5 xl:w-1/4 group-active:scale-105 group-active:rotate-12 transition-all duration-500">
        <GoAlertFill className=" text-red-500 text-7xl" />
        <h2 className=" text-xl text-red-500 font-bold text-center">
          {AlertTranslations.adBlocker.topText[selectedLanguage]}
        </h2>
        <p className="text-center text-black">
          {AlertTranslations.adBlocker.requestToUser[selectedLanguage]}
        </p>
      </div>
    </div>
  }  
    </>
  );
}

export default AdblockAlert;
