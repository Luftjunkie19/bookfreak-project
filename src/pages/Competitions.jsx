import "./Competitions.css";

import React from "react";

import { formatDistanceToNow } from "date-fns";
import { FaPeopleCarry, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useCollection } from "../hooks/useCollection";

function Competitions() {
  const { documents } = useCollection("competitions");

  console.log(
    documents &&
      documents.map((doc) => {
        return Math.round(
          Math.round(doc.expiresAt.toDate().getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );
      })
  );

  return (
    <div className="books-holder">
      {documents &&
        documents.map((doc) => (
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
    </div>
  );
}

export default Competitions;
