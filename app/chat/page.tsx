import '../stylings/backgrounds.css';

import React from 'react';

import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';

// import chatAnimation
//   from '../../assets/lottieAnimations/';
// import MessagesBar from '../../components/ChatComponents/MessagesBar';

function YourChats() {

  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  
  return (
    <div className="min-h-screen h-full">
    

      
    </div>
  );
}

export default YourChats;
