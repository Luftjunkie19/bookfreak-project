import { useEffect, useState } from "react";

import { FaHeart, FaPencilAlt, FaShare, FaTrash } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { GiBookshelf } from "react-icons/gi";
import { MdPlaylistRemove, MdUpdate } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useClipboard } from "use-clipboard-copy";

import { Snackbar } from "@mui/material";

import alertMessages from "../../assets/translations/AlertMessages.json";
import translations from "../../assets/translations/BookPageTranslations.json";
import reuseableTranslations from "../../assets/translations/ReusableTranslations.json";
import BookReaderForm from "../../components/BookComponents/BookReaderForm";
import LikersList from "../../components/BookComponents/LikersList";
import RecensionsForBook from "../../components/BookComponents/RecensionsForBook";
import Loader from "../../components/Loader";
import { modalActions } from "../../context/ModalContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useRealDatabase } from "../../hooks/useRealDatabase";
import useRealtimeDocument from "../../hooks/useRealtimeDocument";
import useRealtimeDocuments from "../../hooks/useRealtimeDocuments";
import EditBook from "../Forms&FormsPages/EditBook";

function Book() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isPending, setIsPending] = useState(false);
  const [document, setDocument] = useState(null);
  const { getDocument } = useRealtimeDocument();
  const { getDocuments } = useRealtimeDocuments();
  const { removeFromDataBase, addToDataBase, updateDatabase } =
    useRealDatabase();
  const [isLiked, setIsLiked] = useState(false);
  const [bookReaderForm, setBookReaderForm] = useState(false);
  const [updateReaderStatus, setUpdateReaderStatus] = useState(false);
  const [likers, setLikers] = useState([]);
  const [readers, setReaders] = useState([]);
  const [showLikers, setShowLikers] = useState(false);
  const [openState, setOpenState] = useState({
    open: false,
    message: "",
  });
  const [recensions, setRecensions] = useState([]);

  const showAllLikers = () => {
    setShowLikers(true);
  };

  const hideAllLikers = () => {
    setShowLikers(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadLikers = async () => {
    const likersEls = await getDocuments("lovedBooks");

    if (likersEls) {
      setLikers(likersEls);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadRecensions = async () => {
    const likersEls = await getDocuments("bookRecensions");

    const realObjects = likersEls.map((bookReader) => {
      if (bookReader.recensions) {
        return bookReader.recensions;
      } else {
        return [];
      }
    });

    if (realObjects) {
      const newArray = realObjects.map((obj) => {
        if (obj !== null && obj !== undefined) {
          const nestedObject = Object.values(obj);
          return nestedObject;
        } else {
          return;
        }
      });

      if (newArray) {
        setRecensions(newArray.flat());
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const showIfLiked = async () => {
    const docElement = await getDocument("lovedBooks", `${id}-${user.uid}`);

    if (docElement) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadObject = async () => {
    const docElement = await getDocument("books", id);
    if (docElement) {
      setDocument(docElement);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadReaders = async () => {
    const likersEls = await getDocuments("bookReaders");

    const realObjects = likersEls.map((bookReader) => {
      return bookReader.readers;
    });

    const newArray = realObjects.map((obj) => {
      const nestedObject = Object.values(obj);
      return nestedObject;
    });

    if (newArray) {
      setReaders(newArray.flat());
    }
  };

  const publishRecension = (recension, bookRate) => {
    addToDataBase("bookRecensions", `${id}/recensions/${user.uid}`, {
      recensionedBook: id,
      bookRate: bookRate,
      recension: recension,
      displayName: user.displayName,
      email: user.email,
      id: user.uid,
      photoURL: user.photoURL,
      dateOfFinish: new Date().getTime(),
    });

    const readerObject = readers.find(
      (reader) => reader.id === user.uid && reader.bookReadingId === id
    );

    updateDatabase(
      { ...readerObject, recension: recension },
      "bookReaders",
      `${id}/readers/${user.uid}`
    );
  };

  useEffect(() => {
    loadObject();
    showIfLiked();
    loadLikers();
    loadReaders();
    loadRecensions();
  }, [loadLikers, loadObject, loadReaders, loadRecensions, showIfLiked]);

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  const changeLoveState = async () => {
    const likerDoc = await getDocument("lovedBooks", `${id}-${user.uid}`);

    if (!likerDoc) {
      addToDataBase("lovedBooks", `${id}-${user.uid}`, {
        displayName: user.displayName,
        lovedBookId: id,
        lovedBy: user.uid,
        photoURL: user.photoURL,
      });

      getDocument("likesData", id).then((data) => {
        updateDatabase(
          {
            likesAmount: data.likesAmount + 1,
          },
          "likesData",
          id
        );
      });
    } else {
      removeFromDataBase("lovedBooks", `${id}-${user.uid}`);
      getDocument("likesData", id).then((data) => {
        updateDatabase(
          {
            likesAmount: data.likesAmount - 1,
          },
          "likesData",
          id
        );
      });
    }
  };

  const clickDelete = () => {
    setIsPending(true);

    removeFromDataBase("books", id);

    setOpenState((state) => {
      state.message =
        alertMessages.notifications.successfull.remove[selectedLanguage];
      state.open = true;
      return state;
    });
    setIsPending(false);
    navigate("/");
  };

  const isOpened = useSelector((state) => state.modal.isOpened);
  const dispatch = useDispatch();
  const clipboard = useClipboard();

  const copyPathName = () => {
    clipboard.copy(window.location.href);
    setOpenState((state) => {
      state.message =
        alertMessages.notifications.successfull.copied[selectedLanguage];
      state.open = true;
      return state;
    });
  };

  const openBookReaderForm = () => {
    setBookReaderForm(true);
  };

  const openUpdateReaderForm = () => {
    setUpdateReaderStatus(true);
  };

  const closeBookReaderForm = () => {
    setBookReaderForm(false);
  };

  const closeUpdateReaderForm = () => {
    setUpdateReaderStatus(false);
  };

  const removeFromShelf = () => {
    removeFromDataBase(`bookReaders`, `${id}/readers/${user.uid}`);
    removeFromDataBase(`bookRecensions`, `${id}/recensions/${user.uid}`);
  };

  const addToShelf = (hasStarted, hasFinished, readPages) => {
    addToDataBase("bookReaders", `${id}/readers/${user.uid}`, {
      bookRate: 0,
      bookReadingId: id,
      displayName: user.displayName,
      email: user.email,
      hasFinished,
      id: user.uid,
      pagesRead: readPages,
      startedReading: hasStarted,
      dateOfFinish: hasFinished ? new Date().getTime() : null,
      recension: "",
      photoURL: user.photoURL,
    });
  };

  const updateReaderState = (hasStarted, hasFinished, readPages) => {
    if (document.pagesNumber > readPages) {
      removeFromDataBase(`bookRecensions`, `${id}/recensions/${user.uid}`);
    }

    addToDataBase("bookReaders", `${id}/readers/${user.uid}`, {
      bookRate: 0,
      bookReadingId: id,
      displayName: user.displayName,
      email: user.email,
      hasFinished,
      id: user.uid,
      pagesRead: readPages,
      startedReading: hasStarted,
      dateOfFinish: hasFinished ? new Date().getTime() : null,
      recension: "",
      photoURL: user.photoURL,
    });
  };

  return (
    <div className="min-h-screen h-full overflow-x-hidden">
      {isOpened && <EditBook id={id} />}

      {document && (
        <div className="flex h-full justify-around items-center sm:flex-col lg:flex-row mt-16">
          <div className="flex flex-col items-center justify-around w-full md:w-1/2">
            <div className="w-64 h-72 m-2">
              <img
                className="h-full w-full rounded-md object-cover"
                src={document.photoURL}
                alt="book-cover"
              />
            </div>
            {document && document.createdBy.id === user.uid && (
              <div className="flex w-full items-center justify-center gap-2">
                <button
                  className="btn sm:w-2/5 md:w-fit bg-facebook text-white md:min-w-[10rem]"
                  onClick={() => {
                    dispatch(modalActions.openModal());
                  }}
                >
                  {translations.buttonsTexts.edit[selectedLanguage]}{" "}
                  <FaPencilAlt />
                </button>
                <button
                  className="btn sm:w-2/5 md:w-fit bg-darkRed text-white md:min-w-[10rem]"
                  onClick={clickDelete}
                >
                  {translations.buttonsTexts.delete[selectedLanguage]}
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
          <div className="w-full text-white mt-5 md:ml-8 md:mt-0 max-w-2xl">
            <h3 className="text-white uppercase text-2xl">{document.title}</h3>
            <span className="text-gray-500 mt-3">
              {translations.authorText[selectedLanguage]}: {document.author}
            </span>
            <div className="mt-2">
              <div className="flex gap-4 justify-between items-center my-2 p-2 sm:w-full md:w-3/4 lg:w-4/5">
                {document && (
                  <div>
                    <button
                      className={`flex justify-around items-center`}
                      onClick={changeLoveState}
                    >
                      <FaHeart
                        className={`text-3xl ${isLiked && "text-red-500"}`}
                      />
                    </button>
                    {likers.filter((liker) => liker.lovedBookId === id).length >
                      0 && (
                      <p className="sm:text-sm lg:text-base">
                        <Link
                          to={`/profile/${
                            likers.filter(
                              (liker) => liker.lovedBookId === id
                            )[0].lovedBy
                          }`}
                        >
                          {
                            likers.filter(
                              (liker) => liker.lovedBookId === id
                            )[0].displayName
                          }{" "}
                        </Link>
                        <span
                          onClick={showAllLikers}
                          className="hover:underline"
                        >
                          {likers.filter((liker) => liker.lovedBookId === id)
                            .length === 1
                            ? `${translations.andPersons.singlePerson[selectedLanguage]} `
                            : ` ${
                                translations.andPersons.part1[selectedLanguage]
                              } ${
                                likers.filter(
                                  (liker) => liker.lovedBookId === id
                                ).length - 1
                              } ${
                                translations.andPersons.part2[selectedLanguage]
                              }`}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                <button
                  className="sm:btn-sm lg:btn btn btn-outline border-accColor text-accColor hover:bg-accColor hover:text-white"
                  onClick={copyPathName}
                >
                  <FaShare /> {translations.shareText[selectedLanguage]}
                </button>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-light">
                {reuseableTranslations.detailsText[selectedLanguage]}:
              </p>
              <div className="flex flex-col mt-1">
                <p>
                  {reuseableTranslations.pagesText[selectedLanguage]}:{" "}
                  {document.pagesNumber}
                </p>
                <p>
                  {reuseableTranslations.categoryText[selectedLanguage]}:{" "}
                  {document.category}
                </p>
                <Link to={`/profile/${document.createdBy.id}`}>
                  {translations.addedBy[selectedLanguage]}:{" "}
                  {document.createdBy.displayName}
                </Link>
              </div>
            </div>

            <div className="flex sm:flex-col md:flex-row lg:flex-col xl:flex-row gap-2 w-full  items-center my-3">
              {document &&
              !readers.find(
                (reader) =>
                  reader.id === user.uid && reader.bookReadingId === id
              ) ? (
                <button className="btn lg:btn" onClick={openBookReaderForm}>
                  {translations.buttonsTexts.addToShelf[selectedLanguage]}{" "}
                  <GiBookshelf />
                </button>
              ) : (
                <button className="btn " onClick={removeFromShelf}>
                  {translations.buttonsTexts.removeShelf[selectedLanguage]}{" "}
                  <MdPlaylistRemove />
                </button>
              )}
              {document &&
                readers.find(
                  (reader) =>
                    reader.id === user.uid && reader.bookReadingId === id
                ) && (
                  <button onClick={openUpdateReaderForm} className="btn ">
                    {translations.buttonsTexts.updateStatus[selectedLanguage]}
                    <MdUpdate />
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
      {document && readers && (
        <RecensionsForBook
          bookPages={document.pagesNumber}
          readPages={
            readers &&
            readers.find(
              (reader) => reader.id === user.uid && reader.bookReadingId === id
            )?.pagesRead
          }
          title={document.title}
          hasReadBook={
            readers &&
            readers.find(
              (reader) => reader.id === user.uid && reader.bookReadingId === id
            )?.hasFinished
          }
          hasRecension={
            readers &&
            readers
              .find(
                (reader) =>
                  reader.id === user.uid && reader.bookReadingId === id
              )
              ?.recension.trim("") !== ""
          }
          publishRecension={publishRecension}
          recensions={
            recensions && recensions.length > 0
              ? recensions.filter(
                  (recension) => recension.recensionedBook === id
                )
              : []
          }
        />
      )}

      {bookReaderForm && document && (
        <BookReaderForm
          readerData={readers.find(
            (reader) => reader.id === user.uid && reader.bookReadingId === id
          )}
          handleConfirm={addToShelf}
          pagesAmount={document.pagesNumber}
          closeForm={closeBookReaderForm}
        />
      )}

      {updateReaderStatus && document && (
        <BookReaderForm
          readerData={readers.find(
            (reader) => reader.id === user.uid && reader.bookReadingId === id
          )}
          handleConfirm={updateReaderState}
          pagesAmount={document.pagesNumber}
          closeForm={closeUpdateReaderForm}
        />
      )}

      {showLikers && (
        <LikersList
          likers={likers.filter((liker) => liker.lovedBookId === id)}
          likesAmount={
            likers.filter((liker) => liker.lovedBookId === id).length
          }
          closeList={hideAllLikers}
        />
      )}
      {isPending && <Loader />}

      {openState.open === true && (
        <>
          <Snackbar
            onClose={() => {
              setOpenState({ message: "", open: false });
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={openState.open}
            autoHideDuration={3000}
            severity="success"
            message={openState.message}
            action={
              <button
                className="flex items-center gap-2"
                onClick={() => {
                  setOpenState({ message: "", open: false });
                }}
              >
                <FaX className=" text-red-500" /> Close
              </button>
            }
          />
        </>
      )}
    </div>
  );
}

export default Book;
