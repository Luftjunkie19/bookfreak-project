import React from "react";

import { FaInstagram, FaMailBulk } from "react-icons/fa";
import { FaDiscord, FaPhone, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

function ContactPage() {
  return (
    <div className="w-full min-h-screen h-full">
      <p className="sm:text-2xl lg:text-5xl font-bold text-white flex gap-3 m-2">
        <FaPhone className="text-green-400" /> Contact
      </p>
      <p className="sm:text-lg lg:text-3xl text-white font-medium p-2">
        If you want to take a contact with us you can do it via:
      </p>
      <div className="flex flex-wrap sm:justify-center sm:items-center md:justify-start md:items-start w-full gap-3 p-3">
        <Link
          to="https://discord.gg/CtPSTnRwv9"
          className=" bg-discord text-white p-8 rounded-lg cursor-pointer group"
        >
          <FaDiscord className="w-16 h-16 group-hover:rotate-180 group-hover:scale-95 transition-all duration-500" />
        </Link>
        <Link className="bg-blue-400 p-8 rounded-lg cursor-pointer group">
          <FaMailBulk className="w-16 h-16 group-hover:rotate-180 group-hover:scale-95 transition-all duration-500 text-white" />
        </Link>
        <Link
          className="bg-white p-8 rounded-lg cursor-pointer group"
          to="https://www.instagram.com/bookfreak_officiall"
        >
          <FaInstagram className="w-16 h-16 group-hover:rotate-180 group-hover:scale-95 transition-all duration-500 text-purple-400" />
        </Link>
        <Link className="bg-green-300 p-8 rounded-lg cursor-pointer group">
          <FaPhone className="w-16 h-16 group-hover:rotate-180 group-hover:scale-95 transition-all duration-500 text-white" />
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
