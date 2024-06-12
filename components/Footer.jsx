import React from 'react';

import {
  FaDiscord,
  FaTiktok,
  FaXTwitter,
} from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Footer() {
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);

  return (
    <footer className={`footer p-10 ${isDarkModed ? "bg-accColor" : "bg-primeColor"} text-white`}>
      <nav>
        <header className={`footer-title ${isDarkModed ? "text-primeColor" : "text-accColor"}`}>Services</header>
        <Link className="link link-hover">Advertisement</Link>
      </nav>
      <nav>
        <header className={`footer-title ${isDarkModed ? "text-primeColor" : "text-accColor"}`}>Company</header>
        <Link className="link link-hover" to="/about-us">
          About us
        </Link>
        <Link to="/contact" className="link link-hover">
          Contact
        </Link>
        <Link className="link link-hover">Jobs</Link>
      </nav>
      <nav>
        <header className={`footer-title ${isDarkModed ? "text-primeColor" : "text-accColor"}`}>Social</header>
        <div className="grid grid-flow-col gap-4">
          <Link
            to="https://twitter.com/BookFreak_ofc"
            target="_blank"
            className="text-2xl hover:text-black transition-all duration-500"
          >
            <FaXTwitter />
          </Link>
          <Link
            to="https://www.youtube.com/channel/UCSrXE9USUSfnz9kjIfSzBYg"
            target="_blank"
            className="hover:text-youtube transition-all duration-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
            </svg>
          </Link>
          <Link
            to="https://discord.gg/QDfwaJAKZK"
            target="_blank"
            className="text-2xl"
          >
            <FaDiscord />
          </Link>
          <Link
            to="https://www.tiktok.com/@bookfreak_official"
            target="_blank"
            className="text-2xl"
          >
            <FaTiktok />
          </Link>
        </div>
      </nav>
    </footer>
  );
}

export default Footer;
