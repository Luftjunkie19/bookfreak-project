import './HomeCompetitions.css';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {
  FaPeopleCarry,
  FaSearch,
  FaStar,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { useCollection } from '../hooks/useCollection';

function HomeCompetitions() {
  const { documents } = useCollection("competitions");

  const slicedDocuments = documents.slice(
    0,
    documents.length < 3 ? documents.length : 3
  );

  console.log(slicedDocuments);

  return (
    <div className="books-holder">
      {slicedDocuments.map((doc) => (
        <>
          <Link to={`/competition/${doc.id}`}>
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
              <p className="wrong">
                {Math.round(
                  Math.round(
                    doc.expiresAt.toDate().getTime() - new Date().getTime()
                  ) /
                    (1000 * 60 * 60 * 24)
                ) > 0
                  ? ""
                  : "Expired"}
              </p>
            </div>
          </Link>
        </>
      ))}

      {slicedDocuments.length >= 4 && (
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
    </div>
  );
}

export default HomeCompetitions;
