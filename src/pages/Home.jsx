import "./Home.css";

import { FaBookOpen } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useOrderedCollection } from "../hooks/useOrderedCollection";
import HomeClubs from "./HomeClubs";
import HomeCompetitions from "./HomeCompetitions";

function Home() {
  const { orderedDocuments } = useOrderedCollection("books");

  return (
    <>
      <div className="home-container">
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
            orderedDocuments.slice(0, 4).map((doc, i) => (
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
      </div>
    </>
  );
}

export default Home;
