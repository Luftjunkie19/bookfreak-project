import "./Home.css";

import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useOrderedCollection } from "../hooks/useOrderedCollection";
import HomeClubs from "./HomeClubs";
import HomeCompetitions from "./HomeCompetitions";

function Home() {
  const { orderedDocuments } = useOrderedCollection("books");

  const getNumber = () => {
    if (document.body.offsetWidth <= 425) {
      return 5;
    } else if (
      425 < document.body.offsetWidth &&
      document.body.offsetWidth <= 767
    ) {
      return 5;
    } else if (
      document.body.offsetWidth >= 768 &&
      document.body.offsetWidth <= 1023
    ) {
      return 5;
    } else if (
      document.body.offsetWidth >= 1024 &&
      document.body.offsetWidth <= 1440
    ) {
      return 3;
    } else {
      return 4;
    }
  };

  return (
    <>
      <motion.div
        className="home-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {orderedDocuments && (
          <h2>
            {orderedDocuments.length > 0
              ? `We read already ${orderedDocuments.length} books together!`
              : "Empty YET!"}
          </h2>
        )}
        <div
          className={
            orderedDocuments.length > 0 ? "books-holder" : "sort-section"
          }
        >
          {orderedDocuments &&
            orderedDocuments.slice(0, getNumber()).map((doc, i) => (
              <Link to={`/book/${doc.id}`} key={i}>
                <div key={i} className="book">
                  <div className="prev-cover">
                    <img src={doc.photoURL && doc.photoURL} alt="cover" />
                  </div>

                  <h4> {doc.title}</h4>
                  <p>Author: {doc.author}</p>
                  <small>
                    Added by: {doc.createdBy.displayName}, at:
                    <br />
                    {doc.createdBy.createdAt.toDate().toDateString()}
                  </small>
                </div>
              </Link>
            ))}

          <Link to="/books">
            <div className="book">
              <FaBookOpen style={{ fontSize: 42 }} />
              <p>To view more</p>
              <p>Visit here</p>
            </div>
          </Link>
        </div>

        <h2>Competitions:</h2>
        <HomeCompetitions />
        <h2>Clubs:</h2>
        <HomeClubs />
      </motion.div>
    </>
  );
}

export default Home;
