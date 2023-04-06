import './Competition.css';

import React from 'react';

import { Timestamp } from 'firebase/firestore';
import {
  FaPencilAlt,
  FaPeopleCarry,
  FaTrashAlt,
  FaUserPlus,
  FaUserTie,
} from 'react-icons/fa';
import { useParams } from 'react-router';
import {
  Link,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuthContext } from '../hooks/useAuthContext';
import { useDocument } from '../hooks/useDocument';
import { useFirestore } from '../hooks/useFirestore';
import useSendJoinRequest from '../hooks/useSendJoinRequest';
import CompetitionChat from './CompetitionChat';
import CreatedBy from './CreatedBy';
import Members from './Members';
import Ranking from './Ranking';

function Competition() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { document } = useDocument("competitions", id);
  const navigate = useNavigate();
  const { deleteDocument } = useFirestore("competitions");
  const deleteCompetition = async (id) => {
    await deleteDocument(id);
    navigate("/");
    toast.success("Competition removed successfully");
  };
  const { sendMembershipRequest } = useSendJoinRequest();

  console.log(document && document.expiresAt.toDate());

  const expirationTime =
    document && new Date(document.expiresAt.toDate()).getTime();

  let timesDifference = expirationTime - new Date().getTime();

  const sendJoiningRequest = async () => {
    await sendMembershipRequest({
      requestContent: `${user.displayName} sent a request to join ${document.competitionTitle}`,
      directedTo: `${document.createdBy.id}`,
      clubToJoin: `${document.id}`,
      isRead: false,
      requestTo: "competitions",
      notificationTime: Timestamp.fromDate(new Date()),
      joinerData: {
        label: `${user.displayName}`,
        value: {
          id: `${user.uid}`,
          nickname: `${user.displayName}`,
          photoURL: `${user.photoURL}`,
        },
      },
    });
    toast.success("Request sent successfully");
  };

  return (
    <div className="comp-holder">
      <div className="competition">
        {document && document.createdBy.id === user.uid && (
          <div>
            <button
              className="btn delete"
              onClick={() => deleteCompetition(document.id)}
            >
              Delete <FaTrashAlt />
            </button>
            {Math.round(timesDifference / (1000 * 60 * 60 * 24)) > 0 && (
              <button
                className="btn edit-book"
                onClick={() => navigate(`/edit-competition/${document.id}`)}
              >
                Edit <FaPencilAlt />
              </button>
            )}
          </div>
        )}

        {document && (
          <>
            <div
              className={`competition-details ${
                Math.round(timesDifference / (1000 * 60 * 60 * 24)) <= 0
                  ? "expired-comp"
                  : ""
              }`}
            >
              <h2>{document.competitionTitle}</h2>
              <p>
                {Math.round(timesDifference / (1000 * 60 * 60 * 24)) > 0
                  ? "The competition expires in"
                  : "has expired"}{" "}
                {Math.round(timesDifference / (1000 * 60 * 60 * 24)) > 0 ? (
                  <span className="wrong bolded">
                    {Math.round(timesDifference / (1000 * 60 * 60 * 24))}{" "}
                    {Math.round(timesDifference / (1000 * 60 * 60 * 24)) === 1
                      ? "day"
                      : "days"}
                  </span>
                ) : (
                  <span className="wrong bolded">
                    {" "}
                    {Math.round(timesDifference / (1000 * 60 * 60 * 24)) === 0
                      ? "today"
                      : `${
                          Math.round(timesDifference / (1000 * 60 * 60 * 24)) *
                          -1
                        } days ago`}
                  </span>
                )}
              </p>

              <p>{document.competitionsName}</p>
              <h4>Description:</h4>
              <p>{document.description}</p>

              {document.competitionsName === "Lift others, rise" ||
              document.competitionsName === "Teach to fish" ? (
                <>
                  <div
                    className={`motivational-phrase ${
                      Math.round(timesDifference / (1000 * 60 * 60 * 24)) <= 0
                        ? "expired-phrase"
                        : ""
                    }`}
                  >
                    <FaPeopleCarry />
                    <q>
                      The purpose of life is not to be happy. It is to be
                      useful, to be honorable, to be compassionate, to have it
                      make some difference that you have lived and lived well. -
                      Ralph Waldo Emerson
                    </q>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`motivational-phrase ${
                      Math.round(timesDifference / (1000 * 60 * 60 * 24)) <= 0
                        ? "expired-phrase"
                        : ""
                    }`}
                  >
                    <FaUserTie />
                    <q>
                      Winning isn't everything, but wanting to win is. - Vince
                      Lombardi
                    </q>
                  </div>
                </>
              )}

              {document.users.filter((member) => {
                return member.value.id === user.uid;
              }).length === 0 && (
                <div className="club-nav">
                  <button className="join-btn" onClick={sendJoiningRequest}>
                    Join Competition <FaUserPlus />
                  </button>
                </div>
              )}

              <div className="options">
                <Link to="created-by">Show creator</Link>
                <Link to="members">Show Members</Link>
                {document &&
                  document.users.filter((member) => {
                    return member.value.id === user.uid;
                  }).length !== 0 && (
                    <>
                      <Link to="competition-chat">Show chat</Link>
                      <Link to="ranking">Show Ranking</Link>
                    </>
                  )}
              </div>
            </div>
          </>
        )}
      </div>
      <Routes>
        {document && (
          <>
            <Route
              path="created-by"
              element={
                <CreatedBy
                  creatorName={document && document.createdBy.displayName}
                  createdDate={document && document.createdBy.createdAt}
                  creatorImg={document && document.createdBy.photoURL}
                  creatorProfileId={document && document.createdBy.id}
                />
              }
            />
            <Route
              path="members"
              element={<Members members={document && document.users} />}
            />

            <Route
              path="ranking"
              element={<Ranking users={document && document.users} />}
            />

            {document &&
              document.users.filter((member) => {
                return member.value.id === user.uid;
              }).length !== 0 && (
                <Route
                  path="competition-chat"
                  element={<CompetitionChat collectionName="competitions" />}
                />
              )}
          </>
        )}
      </Routes>
    </div>
  );
}

export default Competition;
