import "./MessagesBar.css";

import { formatDistanceToNow } from "date-fns";
import { FaImage } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";

import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";

function MessagesBar({ partneredDocs }) {
  const { user } = useAuthContext();
  const location = useLocation();
  const { documents } = useCollection("chats", [
    "users.you.id",
    "==",
    user.uid,
  ]);

  const setCurrent = (path) => {
    if (location.pathname === path) {
      return true;
    }
  };

  const navigate = useNavigate();

  const redirectToAppropriateMessage = (id) => {
    navigate("/");
    setTimeout(() => {
      navigate(`/message-to/${id}`);
    });
  };

  return (
    <>
      <div className="messages-bar">
        <h2>Your chats: </h2>
        {documents && documents.length > 0
          ? documents.map((doc) => (
              <>
                <button
                  className="chat-btn"
                  onClick={() => redirectToAppropriateMessage(doc.id)}
                >
                  <div
                    className={`chat-message ${
                      setCurrent(`/message-to/${doc.id}`) ? "current" : ""
                    }`}
                  >
                    <div className="from-details">
                      <div className="from-photo">
                        <img src={doc.users.partner.photoURL} alt="" />
                      </div>

                      <p className="nickname">{doc.users.partner.nickname}</p>
                    </div>
                    <div className="content-details">
                      <p className="from-content">
                        {doc.messages &&
                          doc.messages[doc.messages.length - 1].sender.nickname}
                        :{" "}
                        {doc.messages &&
                        doc.messages[doc.messages.length - 1].content.includes(
                          "https://firebasestorage.googleapis.com/"
                        ) ? (
                          <>
                            <FaImage /> Image
                          </>
                        ) : (
                          <>{doc.messages[doc.messages.length - 1].content}</>
                        )}
                      </p>
                      <p className="time-sent">
                        {doc.messages &&
                          formatDistanceToNow(
                            doc.messages[
                              doc.messages.length - 1
                            ].sentAt.toDate()
                          )}{" "}
                        ago
                      </p>
                    </div>
                  </div>
                </button>
              </>
            ))
          : ""}

        {partneredDocs && partneredDocs.length > 0
          ? partneredDocs.map((doc) => (
              <button
                className="chat-btn"
                onClick={() => redirectToAppropriateMessage(doc.id)}
              >
                <div
                  className={`chat-message ${
                    setCurrent(`/message-to/${doc.id}`) ? "current" : ""
                  }`}
                >
                  <div className="from-details">
                    <div className="from-photo">
                      <img src={doc.users.you.photoURL} alt="" />
                    </div>

                    <p className="nickname">{doc.users.you.nickname}</p>
                  </div>
                  <div className="content-details">
                    <p className="from-content">
                      {doc.messages &&
                        doc.messages[doc.messages.length - 1].sender.nickname}
                      :{" "}
                      {doc.messages &&
                      doc.messages[doc.messages.length - 1].content.includes(
                        "https://firebasestorage.googleapis.com/"
                      ) ? (
                        <>
                          <FaImage /> Image
                        </>
                      ) : (
                        <>{doc.messages[doc.messages.length - 1].content}</>
                      )}
                    </p>
                    <p className="time-sent">
                      {doc.messages &&
                        formatDistanceToNow(
                          doc.messages[doc.messages.length - 1].sentAt.toDate()
                        )}{" "}
                      ago
                    </p>
                  </div>
                </div>
              </button>
            ))
          : ""}
      </div>
    </>
  );
}

export default MessagesBar;
