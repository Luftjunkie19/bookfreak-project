import React from "react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { useCollection } from "../hooks/useCollection";

function HomeClubs() {
  const { documents } = useCollection("clubs");

  const slicedDocuments = documents.slice(
    0,
    documents.length >= 4 ? documents.length : 4
  );

  return (
    <motion.div
      className="books-holder"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {slicedDocuments.map((doc) => (
        <Link to={`/readers-clubs/${doc.id}`} key={doc.id}>
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

      {slicedDocuments.length <= 4 && (
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
    </motion.div>
  );
}

export default HomeClubs;
