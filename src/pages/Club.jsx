import './Club.css';

import React from 'react';

import { Timestamp } from 'firebase/firestore';
import {
  FaPencilAlt,
  FaTrashAlt,
  FaUserPlus,
} from 'react-icons/fa';
import {
  Link,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuthContext } from '../hooks/useAuthContext';
import { useDocument } from '../hooks/useDocument';
import { useFirestore } from '../hooks/useFirestore';
import useSendJoinRequest from '../hooks/useSendJoinRequest';
import CompetitionChat from './CompetitionChat';
import Members from './Members';
import Ranking from './Ranking';

function Club() {
  const { id } = useParams();

  const { document } = useDocument("clubs", id);
  const { user } = useAuthContext();
  const { deleteDocument } = useFirestore("clubs");
  const navigate = useNavigate();

  const { sendMembershipRequest } = useSendJoinRequest();

  console.log(document);

  const deleteClub = async (id) => {
    await deleteDocument(id);
    navigate("/");
    toast.success("Club has been deleted successfully 😄");
  };

  const sendJoiningRequest = async () => {
    await sendMembershipRequest({
      requestContent: `${user.displayName} sent a request to join ${document.clubsName}`,
      directedTo: `${document.createdBy.id}`,
      clubToJoin: `${document.id}`,
      isRead: false,
      requestTo: "clubs",
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
    <div className="club-container">
      {document && (
        <>
          <div className="club-detailed">
            {document.createdBy.id === user.uid && (
              <div>
                <button
                  className="btn delete"
                  onClick={() => deleteClub(document.id)}
                >
                  Delete <FaTrashAlt />
                </button>

                <button
                  className="btn edit-book"
                  onClick={() => navigate(`/edit-club/${document.id}`)}
                >
                  Edit <FaPencilAlt />
                </button>
              </div>
            )}
            <div className="club-img">
              <img src={document.clubLogo} alt="" />
            </div>

            <div className="club-info">
              <h1>{document.clubsName}</h1>
              <p>
                Created by:{" "}
                <Link
                  to={`/user/profile/${document.createdBy.id}`}
                  className="creator-linked"
                >
                  {document.createdBy.displayName}
                </Link>
              </p>
            </div>
            <div className="club-nav">
              <Link to="members">Members</Link>
              <Link to="ranking">Ranking</Link>
              {document.users.filter((member) => {
                return member.value.id === user.uid;
              }).length !== 0 && <Link to="chat">Chat</Link>}
            </div>

            {document.users.filter((member) => {
              return member.value.id === user.uid;
            }).length === 0 && (
              <div className="club-nav">
                <button className="join-btn" onClick={sendJoiningRequest}>
                  Join Club <FaUserPlus />
                </button>
              </div>
            )}

            <h2>Description</h2>
            <div className="club-description">
              <p>{document.description}</p>
            </div>
          </div>
        </>
      )}
      {document && (
        <Routes>
          <Route
            path="members"
            element={<Members members={document && document.users} />}
          />
          <Route
            path="ranking"
            element={<Ranking users={document && document.users} />}
          />

          {document.users.filter((member) => {
            return member.value.id === user.uid;
          }).length !== 0 && (
            <Route
              path="chat"
              element={<CompetitionChat collectionName="clubs" />}
            />
          )}
        </Routes>
      )}
    </div>
  );
}

export default Club;
