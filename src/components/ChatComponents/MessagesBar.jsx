import { formatDistanceToNow } from "date-fns";
import { FaImage } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import translations from "../../assets/translations/ChatsTranslation.json";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";

function MessagesBar() {
  const { user } = useAuthContext();
  const location = useLocation();
  const { documents } = useCollection("chats");

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  const setCurrent = (path) => {
    if (location.pathname === path) {
      return true;
    }
  };

  return (
    <div>
      <h2 className="sm:text-center md:text-left p-2 leading-9 text-2xl font-semibold text-white">
        {translations.chatsTitle[selectedLanguage]}
      </h2>

      <div className="grid gap-4 p-1 grid-cols-1 sm:justify-items-center md:justify-items-start">
        {documents &&
        documents.filter((chat) =>
          chat.users.find((partner) => partner.id === user.uid)
        ).length > 0 ? (
          documents
            .filter((chat) =>
              chat.users.find((partner) => partner.id === user.uid)
            )
            .map((doc) => (
              <>
                <Link
                  to={`/message-to/${doc.id}`}
                  className={`sm:w-11/12 ${
                    location.pathname.includes("/message-to") &&
                    "lg:w-full xl:w-full 2xl:w-full"
                  } lg:w-1/3 2xl:w-1/4`}
                >
                  <div
                    className={`w-full p-3 rounded-lg text-white hover:bg-accColor duration-500 transition-all ${
                      setCurrent(`/message-to/${doc.id}`)
                        ? "bg-accColor"
                        : "bg-primeColor"
                    }`}
                  >
                    <div className="flex items-center gap-4 py-2">
                      <img
                        className="rounded-full w-16 h-16 object-cover"
                        src={
                          doc.users.find((partner) => partner.id !== user.uid)
                            .photoURL
                        }
                        alt=""
                      />

                      <p className="font-semibold">
                        {
                          doc.users.find((partner) => partner.id !== user.uid)
                            .nickname
                        }
                      </p>
                    </div>
                    <div className="w-full flex justify-between p-1 gap-2">
                      <p className="flex items-center">
                        {doc.messages &&
                          doc.messages[doc.messages.length - 1].sender.nickname}
                        :{" "}
                        {doc.messages &&
                        doc.messages[doc.messages.length - 1].content.includes(
                          "https://firebasestorage.googleapis.com/"
                        ) ? (
                          <>
                            <FaImage className="ml-2" /> Image
                          </>
                        ) : (
                          <>
                            {doc.messages[
                              doc.messages.length - 1
                            ].content.substring(0, 30)}
                            ...
                          </>
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
                </Link>
              </>
            ))
        ) : (
          <div>
            <h1 className="text-center">
              {translations.chatsEmpty[selectedLanguage]}.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagesBar;
