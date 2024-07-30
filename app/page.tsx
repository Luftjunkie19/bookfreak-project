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
import ActivityManager from 'components/home/ActivityManager';




export default function Home() {

  return (
    <div className={`min-h-screen flex flex-col p-2`}>
      <ActivityManager/>

       
    </div>
  );
}
