
'use client';
import React from 'react';
import Link from 'next/link';
import { FaDiscord, FaTiktok, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';



import { useSelector } from 'react-redux';
import { useClipboard } from 'use-clipboard-copy';

import aboutUsTranslations
  from '../../assets/translations/aboutUsTranslations.json';

function ContactPage() {
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const clipboard= useClipboard();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
    <div className="max-w-3xl w-full text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
      <p className="text-lg text-gray-600 mb-6">
        We would love to hear from you! Whether you have a question about our services, pricing, or anything else,
        our team is ready to answer all your questions. Feel free to reach out to us through our social media channels
        or send us a message directly. Stay connected with us for the latest updates and exclusive content.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Connect with us on Social Media</h2>
      <div className="flex justify-center space-x-6 mb-8">
        <Link  target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-500 transition-colors" href="https://discord.com" passHref>
        
            <FaDiscord size={30} />
       
        </Link>
        <Link target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-pink-500 transition-colors" href="https://www.tiktok.com" passHref>
        
            <FaTiktok size={30} />
          
        </Link>
        <Link target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-700 transition-colors" href="https://www.facebook.com" passHref>
         
            <FaFacebook size={30} />
          
        </Link>
        <Link target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-400 transition-colors" href="https://twitter.com" passHref>
       
            <FaTwitter size={30} />
          
        </Link>
        <Link  target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-pink-400 transition-colors" href="https://www.instagram.com" passHref>
       
            <FaInstagram size={30} />
          
        </Link>
        <Link  target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-red-600 transition-colors" href="https://www.youtube.com" passHref>
         
            <FaYoutube size={30} />
          
        </Link>
      </div>

      <p className="text-sm text-gray-500">
        © 2024 Your Company. All rights reserved.
      </p>
    </div>
  </div>
  );
}

export default ContactPage;
