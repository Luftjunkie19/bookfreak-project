import "./SearchOption.css";

import React from "react";

import { motion } from "framer-motion";
import { FaBookOpen, FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function SearchOption() {
  return (
    <div className="side">
      <motion.div
        className="searched-option-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h2>What are you searching for?</h2>

        <Link className="search-option-btn" to="/search/users">
          <div className="search-option">
            <FaUserAlt />
            Users
          </div>
        </Link>
        <Link className="search-option-btn" to="/search/books">
          <div className="search-option">
            <FaBookOpen />
            Books
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

export default SearchOption;
