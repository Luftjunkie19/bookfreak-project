import "./Club.css";

import React from "react";

import { Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { BsChatTextFill } from "react-icons/bs";
import { FaPencilAlt, FaTrashAlt, FaUserPlus } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { warningActions } from "../context/WarningContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useDocument } from "../hooks/useDocument";
import { useFirestore } from "../hooks/useFirestore";
import useSendJoinRequest from "../hooks/useSendJoinRequest";
import Members from "./Members";
import Ranking from "./Ranking";

function Club() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { document } = useDocument("clubs", id);
  const { user } = useAuthContext();
  const { deleteDocument, updateDocument } = useFirestore("clubs");
  const navigate = useNavigate();

  const { sendMembershipRequest } = useSendJoinRequest();

  const deleteClub = async (id) => {
    await deleteDocument(id);
    navigate("/");
    toast.success("Club has been deleted successfully 😄");
  };

  const leaveClub = async () => {
    const arrayWithoutYou = document.users.filter(
      (doc) => doc.value.id !== user.uid
    );

    if (arrayWithoutYou && document.createdBy.id === user.uid) {
      dispatch(
        warningActions.openWarning({
          referedTo: document.id,
          typeOf: "club",
          collection: "clubs",
        })
      );
      return;
    }

    navigate("/");
    toast.success("Competition left successfully !");

    await updateDocument(document.id, {
      users: arrayWithoutYou,
    });
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
      {document ? (
        <>
          <motion.div
            className="club-detailed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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
              {document.users.filter((member) => {
                return member.value.id === user.uid;
              }).length !== 0 && (
                <>
                  <Link to="chat" className="move-to">
                    Chat
                    <BsChatTextFill />
                  </Link>

                  <button className="btn close" onClick={leaveClub}>
                    Leave <ImExit />
                  </button>
                </>
              )}
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
          </motion.div>
        </>
      ) : (
        <>
          <h2>Loading...</h2>
        </>
      )}
      {document && (
        <>
          <div className="club-info">
            <h2>Members:</h2>
            <Members members={document && document.users} />
          </div>
          <div className="club-info">
            <h2>Ranking</h2>
            <Ranking users={document && document.users} />
          </div>
        </>
      )}
    </div>
  );
}

export default Club;
