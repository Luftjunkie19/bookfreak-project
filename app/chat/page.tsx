
import React from 'react';

import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';
import { IoChatbubbles } from 'react-icons/io5';
import LabeledInput from 'components/input/LabeledInput';
import ChatBar from 'components/Sidebars/left/ChatBar';

// import chatAnimation
//   from '../../assets/lottieAnimations/';
// import MessagesBar from '../../components/ChatComponents/MessagesBar';

function YourChats() {


  
  return (
    <div className="flex">

<ChatBar/>
<div className="w-full sm:hidden lg:flex justify-center items-center">
  <div className="flex flex-col gap-2 items-center justify-center">
    <IoChatbubbles className='text-primary-color text-8xl'/>
    <p className='text-white text-2xl'>Start A Conversation Now!</p>
    <p className='text-sm text-white'>Type with someone and explore new possibilities to grow !</p>

  </div>
</div>
      
    </div>
  );
}

export default YourChats;
