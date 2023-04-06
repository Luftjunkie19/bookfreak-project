import './NotificationsHolder.css';

import {
  useMemo,
  useState,
} from 'react';

import { formatDistanceToNow } from 'date-fns';
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';
import {
  FaCheck,
  FaWindowClose,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuthContext } from '../hooks/useAuthContext';
import { useCollection } from '../hooks/useCollection';
import { useOrderedCollection } from '../hooks/useOrderedCollection';
import { usePushNotifications } from '../hooks/usePushNotifications';

function NotificationViewer({ openModal, closeModal, isOpened }) {
  const { user } = useAuthContext();
  const { markAsRead } = usePushNotifications();
  const { orderedDocuments } = useOrderedCollection(
    "notifications",
    ["notificationTime", "desc"],
    ["directedTo", "==", user.uid]
  );
  const { documents } = useCollection(
    "join-request",
    ["directedTo", "==", user.uid],
    ["notificationTime", "desc"]
  );

  const notifications = useMemo(() => {
    return orderedDocuments;
  }, [orderedDocuments]);

  const joinRequests = useMemo(() => {
    return documents;
  }, [documents]);

  console.log(joinRequests, notifications);

  const [requestId, setRequestId] = useState("");
  console.log(isOpened);

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
      console.log(clubsMembers);

      const requestToRemove = doc(getFirestore(), "join-request", document.id);

      const indexOfRequest = joinRequests.indexOf(document);

      await deleteDoc(requestToRemove);

      console.log(joinRequests);

      await updateDoc(club, { users: clubsMembers });

      joinRequests.splice(indexOfRequest, 1);

      toast.success("User successfully added.");
      closeModal();
    }
  };

  const declineRequest = async () => {
    const document = getDocument[0];
    const requestToRemove = doc(getFirestore(), "join-request", document.id);

    const indexOfRequest = joinRequests.indexOf(document);

    await deleteDoc(requestToRemove);

    joinRequests.splice(indexOfRequest, 1);

    closeModal();
  };

  return (
    <>
      <div className="notifications-holder">
        {notifications &&
          notifications.length > 0 &&
          notifications.map((doc) => (
            <Link
              key={doc.id}
              to={doc.linkTo}
              onClick={async () => await markAsRead(doc.id)}
            >
              <p className={doc.isRead ? "notification" : "new-notification"}>
                {doc.notificationContent}
              </p>
            </Link>
          ))}

        {joinRequests &&
          joinRequests.map((doc) => (
            <button
              onClick={() => {
                openModal();
                setRequestId(doc.id);
                console.log(isOpened);
              }}
              className={doc.isRead ? "notification" : "new-notification"}
            >
              <p>{doc.requestContent}</p>
            </button>
          ))}

        {notifications.length === 0 && <p>No notifications yet.</p>}
      </div>

      {isOpened && (
        <div className="loader-container">
          <button
            className="btn delete"
            onClick={() => {
              closeModal();
              setRequestId("");
              console.log(isOpened);
            }}
          >
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
                    <button className="btn yes" onClick={addToClub}>
                      Accept <FaCheck />{" "}
                    </button>
                    <button className="btn no" onClick={declineRequest}>
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
