import "./NotificationsHolder.css";

import { useEffect, useState } from "react";

import { formatDistanceToNow } from "date-fns";
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { FaCheck, FaWindowClose } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { modalActions } from "../context/ModalContext";
import { notificationActions } from "../context/NotificationReducer";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";
import { useOrderedCollection } from "../hooks/useOrderedCollection";

function NotificationViewer() {
  const { user } = useAuthContext();
  const { orderedDocuments } = useOrderedCollection("notifications");
  const { documents } = useCollection("join-request");
  const openedModal = useSelector((state) => state.modal.isOpened);
  const dispatch = useDispatch();
  const secDispatch = useDispatch();
  const [requestId, setRequestId] = useState("");

  const directedToNotifications = orderedDocuments
    .filter((doc) => doc.directedTo === user.uid)
    .sort((a, b) => b.notificationTime - a.notificationTime);
  const directedToRequests = documents
    .filter((doc) => doc.directedTo === user.uid)
    .sort((a, b) => b.notificationTime - a.notificationTime);

  const notReadN = orderedDocuments.filter(
    (doc) => doc.directedTo === user.uid && doc.isRead === false
  ).length;

  const notReadR = documents.filter(
    (doc) => doc.directedTo === user.uid && doc.isRead === false
  ).length;

  useEffect(() => {
    dispatch(
      notificationActions.updateNotifications({
        notifications: notReadN,
        requests: notReadR,
      })
    );
  });

  const markAsRead = async (id) => {
    try {
      const notficiation = doc(getFirestore(), "notifications", id);

      const notificationElement = await getDoc(notficiation);
      if (!notificationElement.data().isRead) {
        await updateDoc(notficiation, {
          isRead: true,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getDocument =
    requestId.trim() !== "" &&
    documents.filter((doc) => {
      return doc.id === requestId;
    });

  const addToClub = async () => {
    if (getDocument.length > 0) {
      const document = getDocument[0];

      const club = doc(getFirestore(), document.requestTo, document.clubToJoin);
      const clubDocument = await getDoc(club);

      let clubsMembers = clubDocument.data().users;
      clubsMembers.push(document.joinerData);

      const requestToRemove = doc(getFirestore(), "join-request", document.id);

      const indexOfRequest = documents.indexOf(document);

      await deleteDoc(requestToRemove);

      await updateDoc(club, { users: clubsMembers });

      documents.splice(indexOfRequest, 1);

      toast.success("User successfully added.");
      dispatch(modalActions.closeModal());
    }
  };

  const declineRequest = async () => {
    const document = getDocument[0];
    const requestToRemove = doc(getFirestore(), "join-request", document.id);

    const indexOfRequest = documents.indexOf(document);

    await deleteDoc(requestToRemove);

    documents.splice(indexOfRequest, 1);

    secDispatch(modalActions.closeModal());
  };

  const closeModal = async () => {
    const document = getDocument[0];
    const updatedDocument = doc(getFirestore(), "join-request", document.id);

    await updateDoc(updatedDocument, {
      isRead: true,
    });

    secDispatch(modalActions.closeModal());
    setRequestId("");
  };

  return (
    <>
      <div className="notifications-holder">
        {directedToNotifications.map((doc) => (
          <Link key={doc.id} to={doc.linkTo} onClick={() => markAsRead(doc.id)}>
            <p className={doc.isRead ? "notification" : "new-notification"}>
              {doc.notificationContent}
            </p>
          </Link>
        ))}

        {directedToRequests.map((doc) => (
          <button
            key={doc.id}
            onClick={() => {
              dispatch(modalActions.openModal());
              setRequestId(doc.id);
            }}
            className={doc.isRead ? "notification" : "new-notification"}
          >
            <p>{doc.requestContent}</p>
          </button>
        ))}
      </div>

      {openedModal && (
        <div className="loader-container">
          <button className="btn delete" onClick={() => closeModal()}>
            Close <FaWindowClose />
          </button>

          <div>
            {getDocument.length > 0 &&
              getDocument.map((doc) => (
                <div className="buttons">
                  <div className="profile-img">
                    <img src={doc.joinerData.value.photoURL} alt="user" />
                  </div>

                  <h2>
                    {doc.requestContent},{" "}
                    {formatDistanceToNow(doc.notificationTime.toDate())}
                  </h2>

                  <div className="pages-buttons">
                    <button className="btn yes" onClick={() => addToClub()}>
                      Accept <FaCheck />{" "}
                    </button>
                    <button className="btn no" onClick={() => declineRequest()}>
                      Decline <FaWindowClose />{" "}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export default NotificationViewer;
