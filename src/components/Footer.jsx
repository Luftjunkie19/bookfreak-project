import React from "react";

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer grid-rows-2 p-10 bg-primeColor text-white">
      <div>
        <span className="footer-title">Services</span>
        <Link className="link link-hover">Branding</Link>
        <Link className="link link-hover">Design</Link>
        <Link className="link link-hover">Marketing</Link>
        <Link className="link link-hover">Advertisement</Link>
      </div>
      <div>
        <span className="footer-title">Company</span>
        <Link className="link link-hover">About us</Link>
        <Link className="link link-hover">Contact</Link>
        <Link className="link link-hover">Jobs</Link>
        <Link className="link link-hover">Press kit</Link>
      </div>
      <div>
        <span className="footer-title">Legal</span>
        <Link className="link link-hover">Terms of use</Link>
        <Link className="link link-hover">Privacy policy</Link>
        <Link className="link link-hover">Cookie policy</Link>
      </div>
      <div>
        <span className="footer-title">Social</span>
        <Link className="link link-hover">Twitter</Link>
        <Link className="link link-hover">Instagram</Link>
        <Link className="link link-hover">Facebook</Link>
        <Link className="link link-hover">Github</Link>
      </div>
      <div>
        <span className="footer-title">Explore</span>
        <Link className="link link-hover">Features</Link>
        <Link className="link link-hover">Enterprise</Link>
        <Link className="link link-hover">Security</Link>
        <Link className="link link-hover">Pricing</Link>
      </div>
      <div>
        <span className="footer-title">Apps</span>
        <Link className="link link-hover">Mac</Link>
        <Link className="link link-hover">Windows</Link>
        <Link className="link link-hover">iPhone</Link>
        <Link className="link link-hover">Android</Link>
      </div>
    </footer>
  );
}

export default Footer;
