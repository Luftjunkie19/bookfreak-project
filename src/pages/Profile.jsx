import "./Profile.css";

import {
  FaCommentAlt,
  FaDiscord,
  FaGithub,
  FaPencilAlt,
  FaPlusCircle,
  FaSpotify,
  FaTrashAlt,
  FaYoutube,
} from "react-icons/fa";
import { useParams } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useClipboard } from "use-clipboard-copy";

import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";
import { useDocument } from "../hooks/useDocument";
import { useFirestore } from "../hooks/useFirestore";
import { useLinks } from "../hooks/useLinks";
import { useOrderedCollection } from "../hooks/useOrderedCollection";

function Profile() {
  const { id } = useParams();

  const { document, error } = useDocument("users", id);

  console.log(document);

  const { documents } = useCollection("books");

  const { orderedDocuments } = useOrderedCollection("chats");

  const navigate = useNavigate();

  const { deleteDocument } = useFirestore("links");

  const { links } = useLinks();

  console.log(links);

  const { user } = useAuthContext();

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

  const redirectToExistedChat = (providedId) => {
    if (orderedDocuments) {
      const existedChat = orderedDocuments.filter((document) => {
        return providedId === document.id.split("-").reverse().join("-");
      });

      console.log(...existedChat);

      if (existedChat.length > 0) {
        navigate(`/message-to/${existedChat[0].id}`);
      } else {
        navigate(`/message-to/${providedId}`);
      }
    }
  };

  return (
    <>
      {document && (
        <>
          <div className="user-container">
            <div
              className={
                document.id !== user.uid ? "profile-for-users" : "profile-data"
              }
            >
              <div className="profile-details">
                <div className="profile-img">
                  <img src={document.photoURL} alt="avatar" />
                </div>

                <p className="nickname">{document.nickname}</p>
                <p>Email: {document.email}</p>

                {document.id === user.uid && (
                  <>
                    <div className="owner-buttons">
                      <Link className="btn profile-btn edit" to="/edit-profile">
                        Edit Profile <FaPencilAlt />
                      </Link>

                      <Link className="btn profile-btn add-link" to="/add-link">
                        Add link <FaPlusCircle />
                      </Link>
                    </div>
                  </>
                )}
              </div>

              {document.description && document.description.trim() !== "" ? (
                <>
                  <div className="description">
                    <h2>Description:</h2>
                    <p>{document.description}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="description">
                    <h2>Description: </h2>
                    <p>No description yet.</p>
                  </div>
                </>
              )}

              {document.id !== user.uid && (
                <>
                  <div className="contact-user">
                    <button
                      onClick={() =>
                        redirectToExistedChat(`${document.id}-${user.uid}`)
                      }
                      className="btn message"
                    >
                      <FaCommentAlt /> Message
                    </button>
                  </div>
                </>
              )}
            </div>

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
                            <div
                              className={`link ${link.mediaType}`}
                              onClick={() => handleCopy(link.nickname)}
                              key={i}
                            >
                              <FaDiscord /> <p>{link.nickname}</p>
                              {link.addedBy === user.uid && (
                                <button
                                  className="remove-link"
                                  onClick={async () =>
                                    await deleteLink(link.id)
                                  }
                                >
                                  <FaTrashAlt />
                                </button>
                              )}
                            </div>
                          ) : (
                            <>
                              <Link target="_blank" to={link.linkTo} key={i}>
                                <div className={`link ${link.mediaType}`}>
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

                                  {link.addedBy === user.uid && (
                                    <button
                                      className="remove-link"
                                      onClick={async () =>
                                        await deleteLink(link.id)
                                      }
                                    >
                                      <FaTrashAlt />
                                    </button>
                                  )}
                                </div>
                              </Link>
                            </>
                          )}
                        </>
                      ))}
                  </>
                ))}
            </div>
            <h2>Added Books:</h2>

            <div
              className={
                documents &&
                documents.filter((doc) => {
                  return doc.createdBy.id === document.id;
                }).length > 0
                  ? "books"
                  : "links"
              }
            >
              {documents &&
              documents.filter((doc) => {
                return doc.createdBy.id === document.id;
              }).length > 0 ? (
                documents
                  .filter((doc) => {
                    return doc.createdBy.id === document.id;
                  })
                  .map((book, i) => (
                    <Link to={`/book/${book.id}`}>
                      <div className="owned-book" key={i}>
                        <div className="owned-cover">
                          <img src={book.photoURL} alt="" />
                        </div>
                      </div>
                    </Link>
                  ))
              ) : (
                <p>No books yet</p>
              )}
            </div>
          </div>
        </>
      )}

      {error && <p className="error">No user found 😥</p>}
    </>
  );
}

export default Profile;
