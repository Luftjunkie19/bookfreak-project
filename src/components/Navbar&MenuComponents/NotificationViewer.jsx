/* eslint-disable react-hooks/exhaustive-deps */
import {
  useEffect,
  useState,
} from 'react';

import { FaInfoCircle } from 'react-icons/fa';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { Link } from 'react-router-dom';

import translations
  from '../../assets/translations/NotificationsTranslations.json';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

function NotificationViewer() {
  const { user } = useAuthContext();
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const { updateDatabase, addToDataBase } = useRealDatabase();
  const { getDocuments } = useRealtimeDocuments();
  const [documents, setDocuments] = useState([]);

  const loadNotifications = async () => {
    const notificationsEl = await getDocuments("notifications");

    if (notificationsEl) {
      setDocuments(notificationsEl);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const dispatch = useDispatch();
  const secDispatch = useDispatch();
  const [requestId, setRequestId] = useState("");
  const openedState = useSelector((state) => state.viewer.isOpened);

  const acceptRequest = async (notification, communityId, userData) => {
    updateDatabase(
      { ...notification, isRead: true },
      "notifications",
      `${notification.clubToJoin}-${notification.notificationTime}`
    );

    addToDataBase(
      `communityMembers/${communityId}/users`,
      userData.value.id,
      userData
    );

    console.log(communityId, userData);
  };

  const readNotification = (notification) => {
    updateDatabase(
      {
        ...notification,
        isRead: true,
      },
      "notifications",
      `${notification.notificationId}-${notification.notificationTime}`
    );
  };
  return (
    <>
      <div
        className={`fixed right-0 -z-50 sm:w-screen transition-all duration-500 p-4 ${isDarkModed ? "bg-modalAccColor" : "bg-primeColor"} text-white  ${
          openedState
            ? "translate-y-0 opacity-100 z-50"
            : "-translate-y-full opacity-0 -z-50"
        } rounded-b-2xl `}
      >
        <h2 className="text-2xl font-bold">
          {translations.titles.notifiactions[selectedLanguage]}:
        </h2>
        {documents.length > 0 &&
        documents.filter(
          (notification) =>
            !notification.requestContent &&
            notification.directedTo === user.uid &&
            !notification.isRead
        ).length > 0 ? (
          documents
            .filter(
              (notification) =>
                !notification.requestContent &&
                notification.directedTo === user.uid &&
                !notification.isRead
            )
            .map((doc) => (
              <Link
                key={doc.notificationId}
                to={doc.linkTo}
                className={`flex justify-around items-center p-2 my-2 rounded-lg cursor-pointer ${
                  doc.isRead ? "bg-stone-800" : "bg-red-800"
                } xl:w-1/3 md:w-2/3`}
                onClick={() => readNotification(doc)}
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
          {documents.length > 0 &&
          documents.filter(
            (doc) =>
              doc.requestContent && doc.directedTo === user.uid && !doc.isRead
          ).length > 0 ? (
            documents
              .filter(
                (doc) =>
                  doc.requestContent &&
                  doc.directedTo === user.uid &&
                  !doc.isRead
              )
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
                        updateDatabase(
                          {
                            ...doc,
                            isRead: true,
                          },
                          "notifications",
                          `${
                            doc.notificationId
                              ? doc.notificationId
                              : doc.clubToJoin
                          }-${doc.notificationTime}`
                        );
                      }}
                    >
                      {translations.btns.decline[selectedLanguage]}
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        acceptRequest(doc, doc.clubToJoin, doc.joinerData);
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