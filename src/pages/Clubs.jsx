import './Clubs.css';

import React from 'react';

import { Link } from 'react-router-dom';

import { useCollection } from '../hooks/useCollection';

function Clubs() {
  const { documents } = useCollection("clubs");

  console.log(documents);

  return (
    <div className="books-holder">
      {documents &&
        documents.map((book) => (
          <Link to={`/readers-clubs/${book.id}`}>
            <div className="club">
              <div className="club-details">
                <div className="club-cover">
                  <img src={book.clubLogo} alt="" />
                </div>
                <p>{book.clubsName}</p>
              </div>

              <p className="join-mes">Look into the club</p>
            </div>
          </Link>
        ))}
    </div>
  );
}

export default Clubs;
