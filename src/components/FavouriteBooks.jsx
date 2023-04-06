import React from 'react';

import { Link } from 'react-router-dom';

import { useCollection } from '../hooks/useCollection';

function FavouriteBooks({ id }) {
  const { documents } = useCollection("favourite", ["starredBy.id", "==", id]);

  return (
    <>
      <h2>Favourite Books:</h2>
      <div
        className={documents && documents.length > 0 ? "books-holder" : "links"}
      >
        {documents && documents.length > 0 ? (
          documents.map((doc, i) => (
            <Link to={`/book/${doc.bookId}`}>
              <div className="owned-book" key={i}>
                <div className="owned-cover">
                  <img src={doc.bookCover} alt="" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No Favourite Books yet.</p>
        )}
      </div>
    </>
  );
}

export default FavouriteBooks;
