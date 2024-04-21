import '../stylings/backgrounds.css';

import React from 'react';

import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';

import chatAnimation
  from '../../assets/lottieAnimations/Animation - 1703453392997.json';
import MessagesBar from '../../components/ChatComponents/MessagesBar';

function YourChats() {

  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  
  return (
    <div className="min-h-screen h-full pattern-bg flex items-center sm:flex-col lg:flex-row">
      <div className="sm:w-full md:max-w-4xl sm:order-2 lg:order-1 self-start justify-self-start">
        <MessagesBar />
      </div>

      <div className="gap-3 sm:order-1 xl:order-2 p-2">
        <p className={`sm:text-xl xl:text-3xl font-bold ${isDarkModed ? "text-white" : "text-black"} text-center`}>
          Find a spirit, chatting with other freaks
        </p>
        <Lottie className="max-w-md p-2" animationData={chatAnimation} />
      </div>
    </div>
  );
}

export default YourChats;
