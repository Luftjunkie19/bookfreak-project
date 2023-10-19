import "../stylings/scrollbarStyling.css";
import "../stylings/backgrounds.css";

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
import { Alert } from "flowbite-react";
import { BiSolidBook, BiSolidLike } from "react-icons/bi";
import {
  FaBook,
  FaCommentAlt,
  FaPencilAlt,
  FaPlusCircle,
  FaStar,
  FaUserAltSlash,
} from "react-icons/fa";
import { FaBookBookmark } from "react-icons/fa6";
import { IoShareSocialSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Route, Routes, useParams } from "react-router";
import { Link, useNavigate } from "react-router-dom";

import translations from "../../assets/translations/ProfileTranslations.json";
import FavouriteBooks from "../../components/ProfileComonents/FavouriteBooks";
import FullyReadBooks from "../../components/ProfileComonents/FullyReadBooks";
import Links from "../../components/ProfileComonents/Links";
import OwnedBooks from "../../components/ProfileComonents/OwnedBooks";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { useDocument } from "../../hooks/useDocument";
import { useLogout } from "../../hooks/useLogout";
import { useOrderedCollection } from "../../hooks/useOrderedCollection";

function Profile() {
  const { id } = useParams();

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

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

      console.log(existedChat);

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
    <div className="min-h-screen h-full">
      {document && (
        <>
          <div className="grid xl:grid-cols-2 sm:grid-cols-1 gap-2">
            <div className="p-2 sm:border-b-4 sm:border-white xl:border-none bg-userColumnBgCol xl:rounded-b-lg">
              <div className="flex xl:justify-start sm:justify-center p-2">
                <div className="avatar">
                  <div className="w-48 rounded-full ring border-accColor ring-offset-base-100 ring-offset-2">
                    <img
                      src={document.photoURL}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center lg:flex-row sm:flex-col">
                <p className="text-white font-bold text-3xl tracking-wide py-3">
                  {document.nickname}
                </p>
              </div>

              {document && document.links.length > 0 && (
                <div>
                  <p className="text-2xl text-white flex gap-2 items-center">
                    <IoShareSocialSharp />
                    {
                      translations.featuresButtons.socialMediaButton[
                        selectedLanguage
                      ]
                    }
                    :
                  </p>

                  <Links document={document && document} user={user && user} />
                </div>
              )}

              <div className="flex-w-full justify-center items-center">
                <div className="stats w-full stats-vertical 2xl:stats-horizontal shadow my-3">
                  <div className="stat">
                    <div className="stat-figure text-accColor text-4xl">
                      <BiSolidBook />
                    </div>
                    <div className="stat-title">
                      {translations.stats.booksRead[selectedLanguage]}
                    </div>
                    <div className="stat-value">
                      {
                        documents.filter((book) =>
                          book.readers.some(
                            (reader) =>
                              reader.id === document.id &&
                              reader.pagesRead === book.pagesNumber
                          )
                        ).length
                      }
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-accColor text-4xl">
                      <FaBookBookmark />
                    </div>
                    <div className="stat-title">
                      {translations.stats.addedBooks[selectedLanguage]}
                    </div>
                    <div className="stat-value">
                      {
                        documents.filter(
                          (book) => book.createdBy.id === document.id
                        ).length
                      }
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-accColor text-4xl">
                      <BiSolidLike />
                    </div>
                    <div className="stat-title">
                      {translations.stats.likedBooks[selectedLanguage]}
                    </div>
                    <div className="stat-value">
                      {
                        documents.filter((book) =>
                          book.likesData.likedBy.find(
                            (liker) => liker.uid === document.id
                          )
                        ).length
                      }
                    </div>
                  </div>
                </div>
              </div>

              {document.id === user.uid && (
                <>
                  <div className="grid sm:grid-cols-1 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 py-3">
                    <Link
                      className="btn text-white border-none bg-blue-500 hover:bg-blue-900 flex justify-around"
                      to="/edit-profile"
                    >
                      {
                        translations.managmentButtons.editButton[
                          selectedLanguage
                        ]
                      }{" "}
                      <FaPencilAlt className="text-xl" />
                    </Link>

                    <Link
                      className="btn text-white border-none bg-accColor hover:bg-green-950 flex justify-around"
                      to="/add-link"
                    >
                      {
                        translations.managmentButtons.addLinkButton[
                          selectedLanguage
                        ]
                      }
                      <FaPlusCircle className="text-xl" />
                    </Link>

                    <button
                      className="btn bg-red-600 text-white border-none hover:bg-darkRed flex justify-around"
                      onClick={removeAccount}
                    >
                      {
                        translations.managmentButtons.removeUserButton[
                          selectedLanguage
                        ]
                      }
                      <FaUserAltSlash className="text-xl" />
                    </button>
                  </div>
                </>
              )}

              {document.description && document.description.trim() !== "" ? (
                <div class="flex flex-col text-white p-3 w-full">
                  <h2 class="text-3xl font-extralight pb-2">
                    {translations.description.title[selectedLanguage]}:
                  </h2>
                  <p class="overflow-y-scroll overflow-x-hidden h-40 py-2 pr-4">
                    {document.description}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col text-white">
                  <h2>{translations.description.title[selectedLanguage]}:</h2>
                  <p>{translations.description.vacancy[selectedLanguage]}.</p>
                </div>
              )}

              {document.id !== user.uid && (
                <>
                  <div className="contact-user">
                    <button
                      onClick={() =>
                        redirectToExistedChat(`${document.id}-${user.uid}`)
                      }
                      className="btn bg-accColor text-white"
                    >
                      <FaCommentAlt />{" "}
                      {translations.messageBtn[selectedLanguage]}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col">
              <div className="sm:grid sm:grid-flow-col sm:auto-cols-[53%] gap-4 pt-3 snap-inline overflow-x-auto md:flex md:justify-around md:items-center">
                <Link
                  to="owned-books"
                  className="btn bg-accColor border-none snap-start text-white"
                >
                  {translations.featuresButtons.booksButton[selectedLanguage]}
                  <FaBook />
                </Link>
                <Link
                  to="read-books"
                  className="btn bg-accColor border-none snap-start text-white"
                >
                  {translations.featuresButtons.readBooksBtn[selectedLanguage]}
                  <FaBookBookmark />
                </Link>
                <Link
                  to="users-fav"
                  className="btn bg-accColor border-none snap-start text-yellow-400"
                >
                  {
                    translations.featuresButtons.favouritesButton[
                      selectedLanguage
                    ]
                  }
                  <FaStar />
                </Link>
              </div>

              <div className="flex justify-center items-center py-4">
                <Routes>
                  <Route
                    path="owned-books"
                    element={
                      <OwnedBooks
                        ownedBooks={documents}
                        ownerId={document.id}
                      />
                    }
                  />

                  <Route
                    path="read-books"
                    element={
                      <FullyReadBooks
                        readBooks={documents}
                        readerId={document.id}
                      />
                    }
                  />

                  <Route
                    path="users-fav"
                    element={<FavouriteBooks id={document.id} />}
                  />
                </Routes>
              </div>
            </div>
          </div>
        </>
      )}

      {error && (
        <Alert className="bg-transparent" severity="error">
          No user found
        </Alert>
      )}
    </div>
  );
}

export default Profile;
