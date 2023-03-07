import "./Footer.css";

import React from "react";

import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer">
      <ul>
        <li>
          <h4>Wanna contact us in other way?</h4>
        </li>

        <li>
          <Link
            to="https://www.facebook.com/Lukas.Borkowski.1566/"
            target="_blank"
            className="footer-link fb"
          >
            <FaFacebookF /> Facebook
          </Link>
        </li>
        <li>
          <Link
            to="https://twitter.com/luftjunkie"
            target="_blank"
            className="footer-link twitter"
          >
            <FaTwitter /> Twitter
          </Link>
        </li>
        <li>
          <Link
            to="https://www.instagram.com/luftjunkie_19/?hl=de"
            target="_blank"
            className="footer-link instagram"
          >
            <FaInstagram /> Instagram
          </Link>
        </li>
      </ul>

      <ul>
        <li>
          <h4>Looking for entertainment?</h4>
        </li>
        <li>
          <Link
            to="https://www.youtube.com/@luftjunkie1573/featured"
            target="_blank"
            className="footer-link yt"
          >
            <FaYoutube /> Youtube
          </Link>
        </li>

        <li>
          <Link
            to="https://www.twitch.tv/luftjunkie_19"
            target="_blank"
            className="footer-link twitch"
          >
            <FaTwitch /> Twitch
          </Link>
        </li>
        <li>
          <Link
            to="https://www.tiktok.com/@luftjunkie_19"
            target="_blank"
            className="footer-link tiktok"
          >
            <FaTiktok /> Tiktok
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Footer;
