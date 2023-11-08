import "../stylings/scrollbarStyling.css";
import "../stylings/backgrounds.css";

import { useEffect, useState } from "react";

import { deleteUser } from "firebase/auth";
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
import { useLogout } from "../../hooks/useLogout";
import { useRealDatabase } from "../../hooks/useRealDatabase";
import useRealtimeDocument from "../../hooks/useRealtimeDocument";
import useRealtimeDocuments from "../../hooks/useRealtimeDocuments";

function Profile() {
  const { id } = useParams();

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const { logout } = useLogout();
  const [document, setDocument] = useState(null);
  const [books, setBooks] = useState([]);
  const [links, setLinks] = useState([]);
  const [favBooks, setFavBooks] = useState([]);
  const [readerObjects, setReaderObjects] = useState([]);
  const { getDocument } = useRealtimeDocument();
  const { removeFromDataBase } = useRealDatabase();
  const { getDocuments } = useRealtimeDocuments();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const documentObject = async () => {
    const doc = await getDocument("users", id);

    if (doc) {
      setDocument(doc);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadReaderObjects = async () => {
    const readerObjects = await getDocuments("bookReaders");

    const realObjects = readerObjects.map((bookReader) => {
      return bookReader.readers;
    });

    const newArray = realObjects.map((obj) => {
      const nestedObject = Object.values(obj);
      return nestedObject;
    });

    setReaderObjects(newArray.flat());
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadBooks = async () => {
    const booksEl = await getDocuments("books");
    setBooks(booksEl);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadLinks = async () => {
    const linksEl = await getDocuments("links");
    setLinks(linksEl);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadFavouritedBooks = async () => {
    const favBooksEl = await getDocuments("lovedBooks");
    setFavBooks(favBooksEl);
  };

  useEffect(() => {
    documentObject();
    loadReaderObjects();
    loadFavouritedBooks();
    loadBooks();
    loadLinks();
  }, [
    documentObject,
    loadBooks,
    loadFavouritedBooks,
    loadLinks,
    loadReaderObjects,
  ]);

  const navigate = useNavigate();

  const { user } = useAuthContext();

  const booksFilter = books.map((book) => {
    return { bookId: book.id, pagesNumber: book.pagesNumber };
  });

  const readersFiltered = readerObjects.filter((reader) => reader.id === id);

  const redirectToExistedChat = (providedId) => {
    navigate(`/message-to/${providedId}`);
  };

  const removeAccount = async () => {
    removeFromDataBase("users", user.uid);

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
                      onClick={() => {
                        console.log(
                          books.filter(
                            (book, i) =>
                              book.id === favBooks[i].lovedBookId &&
                              favBooks[i].lovedBy === id
                          ),
                          favBooks
                        );
                      }}
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

              {document &&
                links.filter((link) => link.belongsTo === document.id).length >
                  0 && (
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

                    <Links
                      links={links && links}
                      ownerId={document && document.id}
                      userId={user && user.uid}
                    />
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
                        readersFiltered.filter(
                          (reader, i) =>
                            reader.pagesRead === booksFilter[i]?.pagesNumber &&
                            booksFilter[i]?.bookId === reader.bookReadingId
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
                        books.filter(
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
                        favBooks.filter((book) => book?.lovedBy === document.id)
                          .length
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
                      <OwnedBooks ownedBooks={books} ownerId={document.id} />
                    }
                  />

                  <Route
                    path="read-books"
                    element={
                      <FullyReadBooks
                        readBooks={books.filter(
                          (book, i) =>
                            readersFiltered[i]?.pagesRead ===
                              book.pagesNumber && readersFiltered[i]?.id === id
                        )}
                        usersReadPages={readersFiltered.filter(
                          (reader, i) =>
                            reader.pagesRead === books[i]?.pagesNumber &&
                            reader.id === id
                        )}
                      />
                    }
                  />

                  <Route
                    path="users-fav"
                    element={
                      <FavouriteBooks
                        favBooks={
                          books &&
                          favBooks &&
                          books.filter(
                            (book, i) =>
                              book.id ===
                              favBooks
                                .filter((book) => book.lovedBy === id)
                                .map((book) => {
                                  return book.lovedBookId;
                                })[i]
                          )
                        }
                      />
                    }
                  />
                </Routes>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
