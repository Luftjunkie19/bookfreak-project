import { useState } from "react";

import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import { FaHeart, FaPencilAlt, FaShare, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useClipboard } from "use-clipboard-copy";

import alertMessages from "../../assets/translations/AlertMessages.json";
import translations from "../../assets/translations/BookPageTranslations.json";
import reuseableTranslations from "../../assets/translations/ReusableTranslations.json";
import BookReaderForm from "../../components/BookComponents/BookReaderForm";
import LikersList from "../../components/BookComponents/LikersList";
import RecensionsForBook from "../../components/BookComponents/RecensionsForBook";
import Loader from "../../components/Loader";
import { modalActions } from "../../context/ModalContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";
import EditBook from "../Forms&FormsPages/EditBook";

function Book() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isPending, setIsPending] = useState(false);
  const { document, error } = useDocument("books", id);
  const { deleteDocument, updateDocument } = useFirestore("books");
  const [bookReaderForm, setBookReaderForm] = useState(false);
  const [updateReaderStatus, setUpdateReaderStatus] = useState(false);
  const [showLikers, setShowLikers] = useState(false);

  const showAllLikers = () => {
    setShowLikers(true);
  };

  const hideAllLikers = () => {
    setShowLikers(false);
  };

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  const clickDelete = async () => {
    setIsPending(true);
    const bookObject = doc(collection(getFirestore(), "books"), id);

    await deleteDoc(bookObject);

    toast.success(
      alertMessages.notifications.successfull.remove[selectedLanguage]
    );
    setIsPending(false);
    navigate("/");
  };

  const isOpened = useSelector((state) => state.modal.isOpened);
  const dispatch = useDispatch();
  const clipboard = useClipboard();

  const copyPathName = () => {
    clipboard.copy(window.location.href);
    toast.success(
      alertMessages.notifications.successfull.copied[selectedLanguage]
    );
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

  const addToShelf = async (hasStarted, hasFinished, readPages) => {
    setIsPending(true);
    closeBookReaderForm();

    if (
      document &&
      !document.readers.find((reader) => reader.id === user.uid)
    ) {
      await updateDocument(document.id, {
        readers: arrayUnion({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          startedReading: hasStarted,
          hasFinished: hasFinished,
          pagesRead: readPages,
          dateOfFinish: readPages === document.pagesNumber ? new Date() : null,
          recension: "",
          bookRate: 0,
          id: user.uid,
        }),
      });
      setIsPending(false);
      return;
    }

    setIsPending(false);
  };

  const removeFromShelf = async () => {
    setIsPending(true);
    await updateDocument(document.id, {
      readers: document.readers.filter((reader) => reader.id !== user.uid),
    });
    setIsPending(false);
  };

  const loveTheBook = async () => {
    setIsPending(true);

    if (
      document &&
      !document.likesData.likedBy.find((liker) => liker.uid === user.uid)
    ) {
      await updateDocument(id, {
        likesData: {
          likedBy: [
            ...document.likesData.likedBy,
            {
              displayName: user.displayName,
              photoURL: user.photoURL,
              uid: user.uid,
            },
          ],
          likesAmount: document.likesData.likesAmount + 1,
        },
      });
      setIsPending(false);
      return;
    }

    if (
      document &&
      document.likesData.likedBy.find((liker) => liker.uid === user.uid)
    ) {
      await updateDocument(id, {
        likesData: {
          likedBy: document.likesData.likedBy.filter(
            (liker) => liker.uid !== user.uid
          ),
          likesAmount: document.likesData.likesAmount - 1,
        },
      });
      setIsPending(false);
      return;
    }
    setIsPending(false);
  };

  const publishRecension = async (recension, bookRate) => {
    setIsPending(true);
    const yourReaderIndex = document.readers.findIndex(
      (reader) => reader.id === user.uid
    );
    document.readers[yourReaderIndex].recension = recension;
    document.readers[yourReaderIndex].bookRate = bookRate;

    await updateDocument(document.id, {
      readers: [...document.readers],
    });
    setIsPending(false);
  };

  const updateBookState = async (hasStarted, hasFinished, pagesRead) => {
    console.log(hasStarted, hasFinished, pagesRead);
    setIsPending(true);
    closeUpdateReaderForm();

    const updatedReaders = [
      ...document.readers.filter((reader) => reader.id !== user.uid),
      {
        pagesRead: pagesRead,
        startedReading: hasStarted,
        hasFinished: hasFinished,
        dateOfFinish: hasFinished ? Timestamp.fromDate(new Date()) : null,
        bookRate: 0,
        recension: "",
        displayName: user.displayName,
        email: user.email,
        id: user.uid,
        photoURL: user.photoURL,
      },
    ];

    await updateDocument(document.id, {
      readers: updatedReaders,
    });
    setIsPending(false);
  };

  return (
    <div className="min-h-screen h-full">
      {isOpened && <EditBook id={id} />}

      {updateReaderStatus && document && (
        <BookReaderForm
          pagesAmount={document.pagesNumber}
          handleConfirm={updateBookState}
          closeForm={closeUpdateReaderForm}
          readerData={document.readers.find((reader) => reader.id === user.uid)}
        />
      )}

      {bookReaderForm && document && (
        <BookReaderForm
          closeForm={closeBookReaderForm}
          handleConfirm={addToShelf}
          pagesAmount={document.pagesNumber}
        />
      )}

      {document && (
        <div className="flex h-full justify-around items-center sm:flex-col lg:flex-row mt-16 mx-6">
          <div className="flex flex-col items-center justify-around w-full md:w-1/2">
            <div className="w-64 h-64">
              <img
                className="h-full w-full rounded-md object-cover"
                src={document.photoURL}
                alt="book-cover"
              />
            </div>
            {document && document.createdBy.id === user.uid && (
              <div className="flex w-full sm:flex-col md:flex-row items-center justify-center p-2 gap-2">
                <button
                  className="btn sm:w-full md:w-fit bg-facebook text-white min-w-[10rem]"
                  onClick={() => {
                    dispatch(modalActions.openModal());
                  }}
                >
                  {translations.buttonsTexts.edit[selectedLanguage]}{" "}
                  <FaPencilAlt />
                </button>
                <button
                  className="btn sm:w-full md:w-fit bg-darkRed text-white md:min-w-[10rem]"
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
              <div className="flex sm:justify-around md:justify-between items-center my-2 sm:w-full lg:w-4/5">
                {document && (
                  <div>
                    <button
                      className={`flex justify-around items-center ${
                        document &&
                        document.likesData.likedBy.find(
                          (liker) => liker.uid === user.uid
                        ) &&
                        "text-red-500"
                      }`}
                      onClick={loveTheBook}
                    >
                      <FaHeart className="text-3xl" />
                    </button>

                    {document.likesData.likedBy.length > 0 && (
                      <p className=" text-sm py-2 group">
                        <Link
                          className=" font-semibold"
                          to={`/profile/${document.likesData.likedBy[0].uid}`}
                        >
                          {document.likesData.likedBy[0].displayName}
                        </Link>{" "}
                        {document.likesData.likedBy.length === 1 &&
                          `${translations.andPersons.singlePerson[selectedLanguage]}`}
                        {document.likesData.likedBy.length - 1 > 0 && (
                          <button
                            onClick={showAllLikers}
                            className="hover:underline-offset-2 hover:underline"
                          >
                            {`${
                              translations.andPersons.part1[selectedLanguage]
                            } ${document.likesData.likedBy.length - 1} ${
                              translations.andPersons.part2[selectedLanguage]
                            }`}
                          </button>
                        )}
                      </p>
                    )}
                  </div>
                )}

                <button
                  className="btn btn-outline border-accColor text-accColor hover:bg-accColor hover:text-white"
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

            <div className="flex sm:flex-col md:flex-row lg:flex-col xl:flex-row gap-5 w-full justify-around items-center my-3">
              {document &&
              !document.readers.find((reader) => reader.id === user.uid) ? (
                <button onClick={openBookReaderForm} className="btn btn-wide">
                  {translations.buttonsTexts.addToShelf[selectedLanguage]}
                </button>
              ) : (
                <button
                  className="btn sm:btn-wide lg:btn-md"
                  onClick={removeFromShelf}
                >
                  {translations.buttonsTexts.removeShelf[selectedLanguage]}
                </button>
              )}
              {document &&
                document.readers.find((reader) => reader.id === user.uid) && (
                  <button
                    onClick={openUpdateReaderForm}
                    className="btn sm:btn-wide lg:btn-md"
                  >
                    {translations.buttonsTexts.updateStatus[selectedLanguage]}
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {document && (
        <RecensionsForBook
          bookPages={document.pagesNumber}
          readPages={
            document &&
            document.readers.find((reader) => reader.id === user.uid) &&
            document.readers.find((reader) => reader.id === user.uid).pagesRead
          }
          title={document.title}
          hasReadBook={
            document &&
            document.readers.find((reader) => reader.id === user.uid) &&
            document.readers.find((reader) => reader.id === user.uid)
              .hasFinished
          }
          hasRecension={
            document &&
            document.readers.find((reader) => reader.id === user.uid) &&
            document.readers
              .find((reader) => reader.id === user.uid)
              .recension.trim(" ") !== ""
          }
          publishRecension={publishRecension}
          recensions={
            document &&
            document.readers.filter(
              (reader) =>
                reader.hasFinished === true && reader.recension.trim("") !== ""
            )
          }
        />
      )}

      {isPending && <Loader />}

      {showLikers && (
        <LikersList
          likers={document && document.likesData.likedBy}
          closeList={hideAllLikers}
          likesAmount={document && document.likesData.likesAmount}
        />
      )}
    </div>
  );
}

export default Book;
