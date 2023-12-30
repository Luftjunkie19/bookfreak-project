import '../stylings/backgrounds.css';

import {
  useEffect,
  useState,
} from 'react';

import {
  FaHeart,
  FaPencilAlt,
  FaShare,
  FaTrash,
} from 'react-icons/fa';
import { GiBookshelf } from 'react-icons/gi';
import {
  MdPlaylistRemove,
  MdRecommend,
  MdUpdate,
} from 'react-icons/md';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  useNavigate,
  useParams,
} from 'react-router';
import { Link } from 'react-router-dom';
import uniqid from 'uniqid';
import { useClipboard } from 'use-clipboard-copy';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';

import alertMessages from '../../assets/translations/AlertMessages.json';
import translations from '../../assets/translations/BookPageTranslations.json';
import reuseableTranslations
  from '../../assets/translations/ReusableTranslations.json';
import BookReaderForm from '../../components/BookComponents/BookReaderForm';
import LikersList from '../../components/BookComponents/LikersList';
import RecensionsForBook
  from '../../components/BookComponents/RecensionsForBook';
import CompetitionMembers
  from '../../components/CommunityComponents/CompetitionMembers';
import Loader from '../../components/Loader';
import { modalActions } from '../../context/ModalContext';
import { snackbarActions } from '../../context/SnackBarContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';
import EditBook from '../Forms&FormsPages/EditBook';

function Book() {
  const { id } = useParams();
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isPending, setIsPending] = useState(false);
  const [document, setDocument] = useState(null);
  const { getDocument } = useRealtimeDocument();
  const { getDocuments } = useRealtimeDocuments();
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const { removeFromDataBase, addToDataBase, updateDatabase } =
    useRealDatabase();
  const [isLiked, setIsLiked] = useState(false);
  const [bookReaderForm, setBookReaderForm] = useState(false);
  const [updateReaderStatus, setUpdateReaderStatus] = useState(false);
  const [showLikers, setShowLikers] = useState(false);
  const [recensions, setRecensions] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const handleOpenAccord = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const showAllLikers = () => {
    setShowLikers(true);
  };

  const hideAllLikers = () => {
    setShowLikers(false);
  };



const {documents:likers}=useGetDocuments("lovedBooks");

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

  const {documents:readersObjects}=useGetDocuments("bookReaders");

  const readers=readersObjects.map((bookReader) => {
    return bookReader.readers;
  }).map((obj) => {
    const nestedObject = Object.values(obj);
    return nestedObject;
  }).flat();

 
  const publishRecension = (recension, bookRate) => {
    if (recension.trim("").length < 10) {
      dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.recensionLonger[selectedLanguage]}`, alertType:"error"}));
      return;
    }

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

  const [competitionsMembers, setCompetitionsMembers] = useState([]);
  const [competitions, setCompetitions] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadCompetitionsMembers = async () => {
    const communityMembers = await getDocuments("communityMembers");

    const realObjects = communityMembers.map((communityMember) => {
      return communityMember.users;
    });

    const alreadyObjects = realObjects.map((member) => {
      return Object.values(member);
    });

    setCompetitionsMembers(alreadyObjects.flat());
  };



  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadCompetitions = async () => {
    const communityMembers = await getDocuments("competitions");

    setCompetitions(communityMembers);
  };

  useEffect(() => {
    loadObject();
    showIfLiked();
    loadRecensions();
    loadCompetitionsMembers();
    loadCompetitions();
  }, [
    loadCompetitions,
    loadCompetitionsMembers,
    loadObject,
    loadRecensions,
    showIfLiked,
  ]);

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  const getCompetitionMembers = () => {
    const userCompetitions = competitionsMembers
      .filter((doc) => doc.value.id === user.uid)
      .map((communityMember) => communityMember.belongsTo);

    let result = [];
    let visitedCompetitions = [];

    while (userCompetitions.length > 0) {
      const currentCompetition = userCompetitions.pop();

      if (!visitedCompetitions.includes(currentCompetition)) {
        const membersInCurrentCompetition = competitionsMembers.filter(
          (member) => member.belongsTo === currentCompetition
        );

        result = result.concat(membersInCurrentCompetition);

        const newMembersCompetitions = membersInCurrentCompetition
          .filter((member) => !visitedCompetitions.includes(member.belongsTo))
          .map((member) => member.belongsTo);

        userCompetitions.push(...newMembersCompetitions);
        visitedCompetitions.push(currentCompetition);
      }
    }

    result = result.filter(
      (value, index, self) =>
        self.findIndex((m) => m.value.id === value.value.id) === index
    );

    return result.filter((member) => member.value.id !== user.uid);
  };

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
dispatch(snackbarActions.showMessage({message:`${  alertMessages.notifications.successfull.remove[selectedLanguage]}`, alertType:"success"}));
    setIsPending(false);
    navigate("/");
  };

  const isOpened = useSelector((state) => state.modal.isOpened);
  const clipboard = useClipboard();

  const copyPathName = () => {
    clipboard.copy(window.location.href);
    dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.copied[selectedLanguage]}`, alertType:"success"}));
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
if(readers.filter((doc)=>doc.bookReadingId===id).length === 1){
  removeFromDataBase(`bookReaders`, `${id}`);
}else{
  removeFromDataBase(`bookReaders`, `${id}/readers/${user.uid}`);
  removeFromDataBase(`bookRecensions`, `${id}/recensions/${user.uid}`);

}

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

  const [showList, setShowList] = useState(false);
  const showListsOfUsers = () => {
    setShowList(true);
  };

  const closeListsOfUsers = () => {
    setShowList(false);
  };

  const recommendToUser = async (receiverId) => {
    const firstPossibility = `${user.uid}-${receiverId}`;
    const secondPossibility = `${receiverId}-${user.uid}`;

    const existingChat1 = await getDocument("usersChats", firstPossibility);
    const existingChat2 = await getDocument("usersChats", secondPossibility);

    let chatId;

    if (existingChat1 || existingChat2) {
      chatId = existingChat1 ? firstPossibility : secondPossibility;
    } else {
      chatId = firstPossibility;

      addToDataBase("usersChats", firstPossibility, {
        chatId: firstPossibility,
        createdAt: new Date().getTime(),
      });

      addToDataBase("entitledToChat", `${firstPossibility}/${user.uid}`, {
        entitledUserId: user.uid,
        entitledChatId: firstPossibility,
      });

      addToDataBase("entitledToChat", `${firstPossibility}/${receiverId}`, {
        entitledUserId: receiverId,
        entitledChatId: firstPossibility,
      });
    }

    const messageId = `${chatId}/${new Date().getTime()}${uniqid()}`;

    addToDataBase("usersChatMessages", messageId, {
      content: document.photoURL,
      message: `Hi, I want to recommend you the book ${document.title} written by ${document.author}.`,
      chatId: chatId,
      sender: {
        id: user.uid,
      },
      receiver: {
        id: receiverId,
      },
      sentAt: new Date().getTime(),
    });

    addToDataBase("recommendations", messageId, {
      content: document.photoURL,
      message: `Hi, I want to recommend you the book ${document.title} written by ${document.author}.`,
      chatId: chatId,
      messageId,
      sender: {
        id: user.uid,
      },
      receiver: {
        id: receiverId,
      },
      sentAt: new Date().getTime(),
    });
dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.sent[selectedLanguage]}`, alertType:"success"}));
  };

  return (
    <div className={`min-h-screen h-full overflow-x-hidden ${!isDarkModed && "pattern-bg"}`}>
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
          <div className="w-full mt-5 md:ml-8 md:mt-0 max-w-2xl">
            <h3 className={` ${isDarkModed ? "text-white" : "text-black"} uppercase text-2xl`}>{document.title}</h3>
            <Link
              to={`/author/${document.author}`}
              className={`${isDarkModed ? "text-white" : "text-black"} mt-3`}
            >
              {translations.authorText[selectedLanguage]}: {document.author}.
            </Link>
            <div className="mt-2">
              <div className="flex gap-4 justify-between items-center my-2 p-2 sm:w-full md:w-3/4 lg:w-4/5">
                {document && (
                  <div>
                    <button
                      className={`flex justify-around items-center `}
                      onClick={changeLoveState}
                    >
                      <FaHeart
                        className={`text-3xl ${!isDarkModed ? `text-black  ${isLiked && "text-red-500"}` : `text-white  ${isLiked && "text-red-500"}`}`}
                      />
                    </button>
                    {likers.filter((liker) => liker.lovedBookId === id).length >
                      0 && (
                      <p className={`sm:text-sm lg:text-base ${isDarkModed ? "text-white" :"text-black"}`}>
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
                          className={`hover:underline ${isDarkModed ? "text-white" :"text-black"}`}
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
              <button
                onClick={() => {
                  showListsOfUsers();
                }}
                className="btn bg-accColor text-white"
              >
                {reuseableTranslations.recommendText[selectedLanguage]} <MdRecommend className=" text-lg" />{" "}
              </button>
              {showList && (
                <CompetitionMembers
                  open={showList}
                  handleClose={closeListsOfUsers}
                  users={getCompetitionMembers()}
                  handleCreateRecommendation={recommendToUser}
                />
              )}
            </div>
            <div className="mt-3">
              <p className={`text-3xl font-bold ${isDarkModed ? "text-white" :"text-black"}`}>
                {reuseableTranslations.detailsText[selectedLanguage]}:
              </p>
              <div className={`flex flex-col mt-1 ${isDarkModed ? "text-white" :"text-black"}`}>
                <p className=" font-semibold">
                  {reuseableTranslations.pagesText[selectedLanguage]}:{" "}
                  <span className=" font-normal">

                  {document.pagesNumber}
                  </span>
                </p>
                <p className="font-semibold">
                  {reuseableTranslations.categoryText[selectedLanguage]}:{" "}
                  <span className=" font-normal">{document.category} </span>
                </p>
                <Link to={`/profile/${document.createdBy.id}`}>
                  {translations.addedBy[selectedLanguage]}:{" "}
                  <span className=" font-normal">{document.createdBy.displayName}</span>
                </Link>
                <p  className="font-semibold">{reuseableTranslations.publishingHouseCountry[selectedLanguage]}: <span className=" font-normal">{new Intl.DisplayNames([selectedLanguage], {type:"region"}).of(document.countryOfRelease)}</span></p>
                <p className="font-semibold">{reuseableTranslations.releasedBy.part1[selectedLanguage]} <span className="font-semibold text-yellow-500">{document.publishingHouse}</span> {reuseableTranslations.releasedBy.part2[selectedLanguage]} <span className=" font-normal">{document.dateOfPublishing}</span></p>
                <Accordion className="max-w-lg" expanded={expanded === 'panel1'} onChange={handleOpenAccord('panel1')} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '8px' }}>
  <AccordionSummary
    aria-controls="panel1bh-content"
    id="panel1bh-header"
    sx={{ backgroundColor: '#4267b5'  }}
   
  >
    <Typography sx={{ flexShrink: 0, fontWeight: 'bold', color:"white", fontFamily:"Montserrat" }}>
      {reuseableTranslations.bookDescription[selectedLanguage]}
    </Typography>
    <Typography sx={{ color:"white", fontFamily:"Montserrat", paddingLeft:6 }}>{document.title}</Typography>
  </AccordionSummary>
  <AccordionDetails sx={{ padding: '16px', backgroundColor:"#4267b5",color:"white",  }}>
    <Typography sx={{fontFamily:"Montserrat"}}>
      {document.description}
    </Typography>
  </AccordionDetails>
</Accordion>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 w-full items-center my-3">
              {document &&
              !readers.find(
                (reader) =>
                  reader.id === user.uid && reader.bookReadingId === id
              ) ? (
                <button
                  className="btn text-white bg-accColor"
                  onClick={openBookReaderForm}
                >
                  {translations.buttonsTexts.addToShelf[selectedLanguage]}{" "}
                  <GiBookshelf />
                </button>
              ) : (
                <button
                  className="btn text-white bg-error"
                  onClick={removeFromShelf}
                >
                  {translations.buttonsTexts.removeShelf[selectedLanguage]}{" "}
                  <MdPlaylistRemove />
                </button>
              )}
              {document &&
                readers.find(
                  (reader) =>
                    reader.id === user.uid && reader.bookReadingId === id
                ) && (
                  <button
                    onClick={openUpdateReaderForm}
                    className="btn text-white bg-accColor"
                  >
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

    </div>
  );
}

export default Book;
