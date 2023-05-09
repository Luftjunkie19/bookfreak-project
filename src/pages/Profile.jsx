import "./Profile.css";
import "./Home.css";

import { deleteUser } from "firebase/auth";
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { motion } from "framer-motion";
import {
  FaCommentAlt,
  FaPencilAlt,
  FaPlusCircle,
  FaUserAltSlash,
} from "react-icons/fa";
import { GiWhiteBook } from "react-icons/gi";
import { Route, Routes, useParams } from "react-router";
import { Link, useNavigate } from "react-router-dom";

import FavouriteBooks from "../components/FavouriteBooks";
import Links from "../components/Links";
import OwnedBooks from "../components/OwnedBooks";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";
import { useDocument } from "../hooks/useDocument";
import { useLogout } from "../hooks/useLogout";
import { useOrderedCollection } from "../hooks/useOrderedCollection";

function Profile() {
  const { id } = useParams();

  const { logout } = useLogout();

  const { document, error } = useDocument("users", id);

  const { documents } = useCollection("books");

  const { orderedDocuments } = useOrderedCollection("chats");

  const navigate = useNavigate();

  const { user } = useAuthContext();

  const redirectToExistedChat = (providedId) => {
    if (orderedDocuments) {
      const existedChat = orderedDocuments.filter((document) => {
        return providedId === document.id.split("-").reverse().join("-");
      });

      if (existedChat.length > 0) {
        navigate(`/message-to/${existedChat[0].id}`);
      } else {
        navigate(`/message-to/${providedId}`);
      }
    }
  };

  const removeFromParticularCollection = async (collection) => {
    const collectionDocuments = await getDocs(collection);

    collectionDocuments.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  };

  const removeUserFromArrays = async (collection, user, collectionsName) => {
    const documents = await getDocs(collection);

    documents.forEach((docu) => {
      const document = doc(getFirestore(), collectionsName, docu.id);

      updateDoc(document, { users: arrayRemove(user) });
    });
  };

  const removeAccount = async () => {
    const userToRemove = doc(getFirestore(), "users", user.uid);

    const books = collection(getFirestore(), "books");
    const chats = collection(getFirestore(), "chats");
    const ownedBooks = query(books, where("createdBy.id", "==", user.uid));
    const partneredChats = query(
      chats,
      where("users.partner.id", "==", user.uid)
    );

    const ownedLinks = query(
      collection(getFirestore(), "links"),
      where("addedBy", "==", user.uid)
    );

    const memberPattern = {
      label: user.displayName,
      value: {
        id: user.uid,
        nickname: user.displayName,
        photoURL: user.photoURL,
      },
    };
    const joinedCompetitions = query(
      collection(getFirestore(), "competitions"),
      where("users", "array-contains", memberPattern)
    );
    const joinedClubs = collection(getFirestore(), "clubs");
    const ownedCompetitions = query(
      joinedCompetitions,
      where("createdBy.id", "==", user.uid)
    );
    const ownedClubs = query(
      joinedClubs,
      where("createdBy.id", "==", user.uid)
    );
    const ownedChats = query(chats, where("users.you.id", "==", user.uid));
    removeFromParticularCollection(partneredChats);
    removeFromParticularCollection(ownedLinks);
    removeFromParticularCollection(ownedChats);
    removeFromParticularCollection(ownedBooks);
    removeFromParticularCollection(ownedClubs);
    removeFromParticularCollection(ownedCompetitions);
    removeUserFromArrays(joinedCompetitions, memberPattern, "competitions");
    removeUserFromArrays(joinedClubs, memberPattern, "clubs");

    await deleteDoc(userToRemove);
    await deleteUser(user);
    await logout();
  };

  return (
    <>
      {document && (
        <>
          <motion.div
            className="user-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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
                <p className="reader-stats">
                  Already read:{" "}
                  {
                    documents.filter(
                      (doc) =>
                        doc.createdBy.id === document.id &&
                        doc.readPages === doc.pagesNumber
                    ).length
                  }
                  x <GiWhiteBook />
                </p>

                {document.id === user.uid && (
                  <>
                    <div className="owner-buttons">
                      <Link className="btn profile-btn edit" to="/edit-profile">
                        Edit Profile <FaPencilAlt />
                      </Link>

                      <Link className="btn profile-btn add-link" to="/add-link">
                        Add link <FaPlusCircle />
                      </Link>

                      <button
                        className="btn profile-btn remove-user"
                        onClick={removeAccount}
                      >
                        Remove User <FaUserAltSlash />
                      </button>
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
            <div className="pages-buttons">
              <Link to="owned-books" className="btn user-btn">
                Books
              </Link>
              <Link to="links" className="btn user-btn">
                Links
              </Link>
              <Link to="users-fav" className="btn user-btn">
                Favourite
              </Link>
            </div>

            <Routes>
              <Route
                path="owned-books"
                element={
                  <OwnedBooks
                    ownedBooks={documents && documents}
                    ownerId={document && document.id}
                  />
                }
              />
              <Route
                path="links"
                element={
                  <Links document={document && document} user={user && user} />
                }
              />

              <Route
                path="users-fav"
                element={<FavouriteBooks id={document.id} />}
              />
            </Routes>
          </motion.div>
        </>
      )}

      {error && <p className="error">No user found 😥</p>}
    </>
  );
}

export default Profile;
