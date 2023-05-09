import "./Clubs.css";

import React from "react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { useCollection } from "../hooks/useCollection";

function Clubs() {
  const { documents } = useCollection("clubs");

  return (
    <div className="side">
      <div className="books-holder">
        {documents &&
          documents.map((book) => (
            <Link to={`/readers-clubs/${book.id}`} key={book.id}>
              <motion.div
                className="club"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="club-details">
                  <div className="club-cover">
                    <img src={book.clubLogo} alt="" />
                  </div>
                  <p>{book.clubsName}</p>
                </div>

                <p className="join-mes">Look into the club</p>
              </motion.div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Clubs;
