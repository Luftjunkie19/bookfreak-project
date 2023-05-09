import "./HomeCompetitions.css";

import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { motion } from "framer-motion";
import { FaPeopleCarry, FaSearch, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useCollection } from "../hooks/useCollection";

function HomeCompetitions() {
  const { documents } = useCollection("competitions");

  const getNumber = () => {
    if (document.body.offsetWidth <= 425) {
      return 3;
    } else if (
      (425 < document.body.offsetWidth && document.body.offsetWidth <= 767) ||
      (document.body.offsetWidth > 1024 && document.body.offsetWidth <= 1440)
    ) {
      return 3;
    } else if (
      document.body.offsetWidth > 768 &&
      document.body.offsetWidth <= 1023
    ) {
      return 2;
    } else {
      return 4;
    }
  };

  const slicedDocuments = documents.slice(0, getNumber());

  return (
    <motion.div
      className="books-holder"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {slicedDocuments.map((doc) => (
        <>
          <Link to={`/competition/${doc.id}`} key={doc.id}>
            <div
              className={`competitions-container ${
                Math.round(
                  Math.round(
                    doc.expiresAt.toDate().getTime() - new Date().getTime()
                  ) /
                    (1000 * 60 * 60 * 24)
                ) > 0
                  ? ""
                  : "expired"
              }`}
              key={doc.id}
            >
              {doc.competitionsName === "First read, first served" ? (
                <FaStar />
              ) : (
                <FaPeopleCarry />
              )}

              <h3>{doc.competitionTitle}</h3>

              <p>{doc.competitionsName}</p>

              <p>Created by: {doc.createdBy.displayName}</p>

              <p>
                {formatDistanceToNow(doc.createdBy.createdAt.toDate())} {``}
                ago
              </p>

              <div className="attended-users">
                <p>{doc.users.length} users:</p>

                {doc.users &&
                  doc.users.slice(0, 3).map((user) => (
                    <>
                      <div className="small-avatar">
                        <img src={user.value.photoURL} alt="" />
                      </div>
                    </>
                  ))}
              </div>
            </div>
          </Link>
        </>
      ))}

      {slicedDocuments.length <= getNumber() && (
        <Link to="/competitions">
          <div className="competitions-container">
            <FaSearch />
            <h2>Click here to:</h2>
            <h3>View</h3>
            <p>All</p>
            <h3>Competitions</h3>
          </div>
        </Link>
      )}
    </motion.div>
  );
}

export default HomeCompetitions;
