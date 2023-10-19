import { useState } from "react";

import { arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import { FaInfoCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import translations from "../../assets/translations/NotificationsTranslations.json";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";

function NotificationViewer() {
  const { user } = useAuthContext();
  const { updateDocument } = useFirestore("users");
  const { document } = useDocument("users", user.uid);
  const openedModal = useSelector((state) => state.modal.isOpened);
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const dispatch = useDispatch();
  const secDispatch = useDispatch();
  const [requestId, setRequestId] = useState("");
  const openedState = useSelector((state) => state.viewer.isOpened);

  const acceptRequest = async (
    notification,
    communityId,
    communityType,
    userData
  ) => {
    notification.isRead = true;

    const updatedNotifications = document.notifications.filter(
      (notifi) => notifi.id !== notification.id
    );

    await updateDocument(user.uid, {
      notifications: updatedNotifications,
    });

    const communityDocument = doc(getFirestore(), communityType, communityId);

    await updateDoc(communityDocument, {
      users: arrayUnion(userData),
    });
  };

  const declineRequest = async (notification) => {
    notification.isRead = true;

    const updatedNotifications = document.notifications.filter(
      (notifi) => notifi.id !== notification.id
    );

    await updateDocument(user.uid, {
      notifications: updatedNotifications,
    });
  };
  return (
    <>
      <div
        className={`fixed right-0 -z-50 sm:w-screen transition-all duration-500 p-4 bg-modalAccColor text-white  ${
          openedState
            ? "translate-y-0 opacity-100 z-50"
            : "-translate-y-full opacity-0 -z-50"
        } rounded-b-2xl `}
      >
        <h2 className="text-2xl font-bold">
          {translations.titles.notifiactions[selectedLanguage]}:
        </h2>
        {document &&
        document.notifications &&
        document.notifications.filter(
          (notification) => !notification.requestContent
        ).length > 0 ? (
          document.notifications
            .filter((notification) => !notification.requestContent)
            .map((doc) => (
              <Link
                key={doc.id}
                to={doc.linkTo}
                className={`flex justify-around items-center p-2 my-2 rounded-lg cursor-pointer ${
                  doc.isRead ? "bg-stone-800" : "bg-red-800"
                } xl:w-1/3 md:w-2/3`}
                onClick={() => {
                  doc.isRead = true;

                  updateDocument(user.uid, {
                    notifications: document.notifications,
                  });
                }}
              >
                <FaInfoCircle
                  className={`mr-4 ${
                    doc.isRead ? "text-blue-400" : "text-stone-50"
                  } `}
                />

                <p
                  className={
                    doc.isRead
                      ? "text-stone-100"
                      : "font-extrabold text-stone-50"
                  }
                >
                  {doc.notificationContent}
                </p>
              </Link>
            ))
        ) : (
          <p>{translations.noNewStuff.notifiactions[selectedLanguage]}</p>
        )}

        <h2 className="text-2xl font-bold">
          {translations.titles.requests[selectedLanguage]}:
        </h2>
        <div className="flex flex-col gap-4 w-full overflow-y-scroll">
          {document &&
          document.notifications &&
          document.notifications.filter((doc) => doc.requestContent).length >
            0 ? (
            document.notifications
              .filter((doc) => doc.requestContent)
              .map((doc) => (
                <div className="alert sm:w-full md:w-4/5 xl:w-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-info shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>{doc.requestContent}</span>
                  <div className="flex gap-5">
                    <button
                      className="btn btn-sm bg-red-500 text-white"
                      onClick={() => {
                        declineRequest(doc);
                      }}
                    >
                      {translations.btns.decline[selectedLanguage]}
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        acceptRequest(
                          doc,
                          doc.clubToJoin,
                          doc.requestTo,
                          doc.joinerData
                        );
                      }}
                    >
                      {translations.btns.accept[selectedLanguage]}
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p>{translations.noNewStuff.requests[selectedLanguage]}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default NotificationViewer;
