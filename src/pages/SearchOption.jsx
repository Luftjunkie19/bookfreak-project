import './SearchOption.css';

import React from 'react';

import {
  FaBookOpen,
  FaUserAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function SearchOption() {
  return (
    <div className="searched-option-container">
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
    </div>
  );
}

export default SearchOption;
