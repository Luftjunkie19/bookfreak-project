import '../stylings/backgrounds.css';

import React from 'react';

import {
  FaInstagram,
  FaMailBulk,
} from 'react-icons/fa';
import {
  FaDiscord,
  FaPhone,
  FaXTwitter,
} from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useClipboard } from 'use-clipboard-copy';

import aboutUsTranslations
  from '../../assets/translations/aboutUsTranslations.json';

function ContactPage() {
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const clipboard= useClipboard();

  return (
    <div className={`w-full min-h-screen h-full ${!isDarkModed && 'pattern-bg'}`}>
      <p className={`sm:text-2xl lg:text-5xl font-bold ${isDarkModed ? 'text-white' : "text-black"} flex gap-3 m-2`}>
        <FaPhone className="text-green-400" /> {aboutUsTranslations.contactPage.contact[selectedLanguage]}
      </p>
      <p className={`sm:text-lg lg:text-3xl ${isDarkModed ? 'text-white' : "text-black"} font-medium p-2`}>
      {aboutUsTranslations.contactPage.description[selectedLanguage]}
      </p>
      <div className="flex flex-wrap sm:justify-center sm:items-center md:justify-start md:items-start w-full gap-3 p-3">
        <Link
          to="https://discord.gg/CtPSTnRwv9"
          className=" bg-discord text-white p-8 rounded-lg cursor-pointer group"
        >
          <FaDiscord className="w-16 h-16 group-hover:rotate-180 group-hover:scale-95 transition-all duration-500" />
        </Link>
        <Link className="bg-blue-400 p-8 rounded-lg cursor-pointer group" onClick={()=>{
          clipboard.copy(process.env.REACT_APP_GMAIL);
        }}>
          <FaMailBulk className="w-16 h-16 group-hover:rotate-180 group-hover:scale-95 transition-all duration-500 text-white" />
        </Link>
        <Link
          className={`bg-white ${!isDarkModed && 'border-2 border-black'} p-8 rounded-lg cursor-pointer group`}
          to="https://www.instagram.com/bookfreak_officiall"
        >
          <FaInstagram className="w-16 h-16 group-hover:rotate-180 group-hover:scale-95 transition-all duration-500 text-purple-400" />
        </Link>
        <Link
          className="bg-black text-white p-8 rounded-lg cursor-pointer group"
          to="https://twitter.com/BookFreak_ofc"
        >
          <FaXTwitter className="w-16 h-16 group-hover:rotate-180 group-hover:scale-95 transition-all duration-500" />
        </Link>
      </div>
    </div>
  );
}

export default ContactPage;
