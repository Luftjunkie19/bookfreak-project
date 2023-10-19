import React from "react";

import { motion } from "framer-motion";
import {
  FaDiscord,
  FaGithub,
  FaSpotify,
  FaTrashAlt,
  FaYoutube,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useClipboard } from "use-clipboard-copy";

import translations from "../../assets/translations/AlertMessages.json";
import { useFirestore } from "../../hooks/useFirestore";

function Links({ document, user }) {
  const navigate = useNavigate();
  const { updateDocument } = useFirestore("users");

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const { copy } = useClipboard();

  const handleCopy = (nickname) => {
    copy(nickname);
    toast.success(
      translations.notifications.successfull.copied[selectedLanguage]
    );
  };

  const deleteLink = async (id, userId) => {
    const allLinks = document.links;

    await updateDocument(user.uid, {
      links: allLinks.filter((link) => link.id !== id),
    });

    navigate(`/profile/${userId}`);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex w-full gap-2 flex-wrap p-2"
    >
      {document.links.length > 0 ? (
        document.links
          .filter((link) => {
            return link.addedBy === document.id;
          })
          .map((link, i) => (
            <>
              {link.mediaType === "discord" ? (
                <div className="flex items-center">
                  {link.addedBy === user.uid && (
                    <button
                      className="text-red-500 pl-4"
                      onClick={async () => await deleteLink(link.id, user.uid)}
                    >
                      <FaTrashAlt className="text-red-500 text-2xl" />
                    </button>
                  )}
                  <button
                    className="text-white flex items-center  p-2"
                    onClick={() => handleCopy(link.nickname)}
                    key={i}
                  >
                    <FaDiscord className="text-4xl" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center p-2">
                  {link.addedBy === user.uid && (
                    <button
                      className=" text-red-500 text-2xl flex items-center"
                      onClick={async () => await deleteLink(link.id, user.uid)}
                    >
                      <FaTrashAlt />
                    </button>
                  )}

                  <Link
                    to={link.linkTo}
                    className={"text-white flex items-center  p-2 gap-2"}
                    target="_blank"
                  >
                    {link.mediaType === "spotify" ? (
                      <FaSpotify className="text-4xl text-spotify" />
                    ) : link.mediaType === "youtube" ? (
                      <FaYoutube className="text-4xl text-youtube" />
                    ) : link.mediaType === "github" ? (
                      <FaGithub className="text-4xl" />
                    ) : (
                      ""
                    )}{" "}
                  </Link>
                </div>
              )}
            </>
          ))
      ) : (
        <>
          <h1>No links available.</h1>
        </>
      )}

      <div className="grid 2xl:grid-cols-3 xl:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"></div>
    </motion.div>
  );
}

export default Links;
