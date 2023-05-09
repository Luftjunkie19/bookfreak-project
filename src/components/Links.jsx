import React from 'react';

import { motion } from 'framer-motion';
import {
  FaDiscord,
  FaGithub,
  FaSpotify,
  FaTrashAlt,
  FaYoutube,
} from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useClipboard } from 'use-clipboard-copy';

import { useFirestore } from '../hooks/useFirestore';
import { useLinks } from '../hooks/useLinks';

function Links({ document, user }) {
  const { deleteDocument } = useFirestore("links");

  const navigate = useNavigate();

  const { links } = useLinks();

  const { copy } = useClipboard();

  const handleCopy = (nickname) => {
    copy(nickname);
    toast.dark("Nickname successfully copied ✅");
  };

  const deleteLink = async (id) => {
    await deleteDocument(id);
    toast.success("Link deleted");
    navigate(`/profile/${id}`);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2>Links to:</h2>

      <div className="links">
        {links &&
          (links.filter((link) => {
            return link.addedBy === document.id;
          }).length === 0 ? (
            <p>No links added yet</p>
          ) : (
            <>
              {links
                .filter((link) => {
                  return link.addedBy === document.id;
                })
                .map((link, i) => (
                  <>
                    {link.mediaType === "discord" ? (
                      <>
                        <div
                          className={`link ${link.mediaType}`}
                          onClick={() => handleCopy(link.nickname)}
                          key={i}
                        >
                          <FaDiscord /> <p>{link.nickname}</p>
                          {link.addedBy === user.uid && (
                            <button
                              className="remove-link"
                              onClick={async () => await deleteLink(link.id)}
                            >
                              <FaTrashAlt />
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={`link ${link.mediaType}`} key={i}>
                          <Link target="_blank" to={link.linkTo}>
                            {link.mediaType === "youtube" && (
                              <>
                                <FaYoutube />
                              </>
                            )}

                            {link.mediaType === "github" && (
                              <>
                                <FaGithub />
                              </>
                            )}

                            {link.mediaType === "spotify" && (
                              <>
                                <FaSpotify />
                              </>
                            )}

                            {link.mediaType === "youtube" && (
                              <>
                                <p>Youtube</p>
                              </>
                            )}
                            {link.mediaType === "github" && (
                              <>
                                <p>Github</p>
                              </>
                            )}

                            {link.mediaType === "spotify" && (
                              <>
                                <p>Spotify</p>
                              </>
                            )}
                          </Link>
                          {link.addedBy === user.uid && (
                            <button
                              className="remove-link"
                              onClick={async () => await deleteLink(link.id)}
                            >
                              <FaTrashAlt />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </>
                ))}
            </>
          ))}
      </div>
    </motion.div>
  );
}

export default Links;
