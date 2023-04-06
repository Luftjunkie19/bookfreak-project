import './UnderNav.css';

import React from 'react';

import { Link } from 'react-router-dom';

function UnderNav() {
  return (
    <div className="under-nav">
      <div className="under-links">
        <p className="visit-p">Visit also:</p>
        <Link to="/competitions">Competitions</Link>
        <Link to="/recensions">Recensions</Link>
        <Link to="/readers-clubs">Clubs</Link>
      </div>
    </div>
  );
}

export default UnderNav;
