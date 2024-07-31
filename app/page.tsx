import classes from '../stylings/gradient.module.css'
import BookSwiper from 'components/home/swipers/BookSwiper';
import CompetitionSwiper from 'components/home/swipers/CompetitionSwiper';
import ClubSwiper from 'components/home/swipers/ClubSwiper';
import Editor from 'components/imageEditor/Editor';
import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import LeftBar from 'components/Sidebars/left/LeftBar';
import Button from 'components/buttons/Button';
import Book from 'components/elements/Book';
import Competition from 'components/elements/Competition';
import Club from 'components/elements/Club';
import Test from 'components/elements/Test';
import Post from 'components/elements/activity/Post';
import Recension from 'components/elements/recension/Recension';
import LabeledInput from 'components/input/LabeledInput';
import AcitivityManager from 'components/home/AcitivityManager';


//error.tsx - Handles all errors from try catch
//not-found.tsx - It defines itself
//useActionState- (what should perform, initial state). Kind of like the useReducer does.


export default function Home() {

  return (
    <div className={`min-h-screen p-2`}>
      <AcitivityManager/>

       
    </div>
  );
}
