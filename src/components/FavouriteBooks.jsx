import React from 'react';

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { useCollection } from '../hooks/useCollection';

function FavouriteBooks({ id }) {
  const { documents } = useCollection("favourite", ["starredBy.id", "==", id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2>Favourite Books:</h2>
      <motion.div
        className={documents && documents.length > 0 ? "books-holder" : "links"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {documents && documents.length > 0 ? (
          documents.map((doc, i) => (
            <Link to={`/book/${doc.bookId}`} key={doc.id}>
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
      </motion.div>
    </motion.div>
  );
}

export default FavouriteBooks;
