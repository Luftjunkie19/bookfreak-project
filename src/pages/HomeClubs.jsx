import React from 'react';

import { Link } from 'react-router-dom';

import { useCollection } from '../hooks/useCollection';

function HomeClubs() {
  const { documents } = useCollection("clubs");

  const slicedDocuments = documents.slice(
    0,
    documents.length < 3 ? documents.length : 3
  );

  return (
    <div className="books-holder">
      {slicedDocuments.map((doc) => (
        <Link to={`/readers-clubs/${doc.id}`}>
          <div className="club">
            <div className="club-details">
              <div className="club-cover">
                <img src={doc.clubLogo} alt="" />
              </div>
              <p>{doc.clubsName}</p>
            </div>

            <p className="join-mes">Look into the club</p>
          </div>
        </Link>
      ))}

      {slicedDocuments.length >= 3 && (
        <>
          <Link to="/readers-clubs">
            <div className="club">
              <p>Click here to View</p>
              <p>All</p>
              <p>Clubs</p>
            </div>
          </Link>
        </>
      )}
    </div>
  );
}

export default HomeClubs;
