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
import { MdRecommend } from 'react-icons/md';
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

import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/BookPageTranslations.json';
import reuseableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import BookReaderForm from '../../../components/book/BookReaderForm';
import LikersList from '../../../components/book/LikersList';
import RecensionsForBook from '../../../components/book/RecensionsForBook';
// import CompetitionMembers
//   from '../../components/CommunityComponents/CompetitionMembers';
import Loader from '../../../components/Loader';
import { modalActions } from '../../../context/ModalContext';
import { snackbarActions } from '../../../context/SnackBarContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocument from '../../../hooks/useGetDocument';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import useRealtimeDocument from '../../../hooks/useRealtimeDocument';
import useRealtimeDocuments from '../../../hooks/useRealtimeDocuments';
// import EditBook from '../Forms&FormsPages/EditBook';
import Image from 'next/image';

function Book({ params }: { params: { bookId: string } }) {
  const { bookId: id } = params;
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isPending, setIsPending] = useState(false);
  const { getDocument } = useRealtimeDocument();
  const { getDocuments } = useRealtimeDocuments();
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const { removeFromDataBase, addToDataBase, updateDatabase } =
    useRealDatabase();
  const [isLiked, setIsLiked] = useState(false);
  const [bookReaderForm, setBookReaderForm] = useState(false);
  const [updateReaderStatus, setUpdateReaderStatus] = useState(false);
  const [showLikers, setShowLikers] = useState(false);
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
const {documents: recensionObjects}=useGetDocuments('bookRecensions');

const recensions= recensionObjects.map((bookReader) => {
  if (bookReader.recensions) {
    return bookReader.recensions;
  } else {
    return [];
  }
}).map((obj) => {
  if (obj !== null && obj !== undefined) {
    const nestedObject = Object.values(obj);
    return nestedObject;
  } else {
    return;
  }
}).flat();

 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const showIfLiked = async () => {
    if (user) {      
      const docElement = await getDocument("lovedBooks", `${id}-${user.uid}`);
  
      if (docElement) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    }
  };

const {document}=useGetDocument('books', id);
  const {documents:readersObjects}=useGetDocuments("bookReaders");

  const readers=readersObjects.map((bookReader:any) => {
    return bookReader.readers;
  }).map((obj:any[]) => {
    const nestedObject = Object.values(obj);
    return nestedObject;
  }).flat();

 
  const publishRecension = (recension, bookRate) => {
    if (user) {
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
        (reader:any) => reader.id === user.uid && reader.bookReadingId === id
      );
  
      updateDatabase(
        { ...(readerObject as any), recension: recension },
        "bookReaders",
        `${id}/readers/${user.uid}`
      );
 }
  };


  const {documents: membersObjects}=useGetDocuments('communityMembers');
  const competitionsMembers= membersObjects.map((communityMember) => {
    return communityMember.users;
  }).map((member) => {
    return Object.values(member);
  }).flat();

  useEffect(() => {
    showIfLiked();

;
  }, [
    showIfLiked,
  ]);

  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

  const getCompetitionMembers = () => {
    if (user) { 
       const userCompetitions = competitionsMembers
      .filter((doc:any) => doc.value.id === user.uid)
      .map((communityMember:any) => communityMember.belongsTo);

    let result = [];
    let visitedCompetitions:any[] = [];

    while (userCompetitions.length > 0) {
      const currentCompetition = userCompetitions.pop();

      if (!visitedCompetitions.includes(currentCompetition)) {
        const membersInCurrentCompetition = competitionsMembers.filter(
          (member:any) => member.belongsTo === currentCompetition
        );

        result = result.concat(membersInCurrentCompetition as any);

        const newMembersCompetitions = membersInCurrentCompetition
          .filter((member:any) => !visitedCompetitions.includes(member.belongsTo))
          .map((member:any) => member.belongsTo);

        userCompetitions.push(...newMembersCompetitions);
        visitedCompetitions.push(currentCompetition);
      }
    }

    result = result.filter(
      (value:any, index, self) =>
        self.findIndex((m:any) => m.value.id === value.value.id) === index
    );

    return result.filter((member:any) => member.value.id !== user.uid);
    }
   
  };

  const changeLoveState = async () => {
    if (user) {
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
    }
   
  };

  const clickDelete = () => {
    setIsPending(true);

    removeFromDataBase("books", id);
dispatch(snackbarActions.showMessage({message:`${  alertMessages.notifications.successfull.remove[selectedLanguage]}`, alertType:"success"}));
    setIsPending(false);
    navigate("/");
  };

  const isOpened = useSelector((state:any) => state.modal.isOpened);
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
    if (user) {
      if(readers.filter((doc:any)=>doc.bookReadingId===id).length === 1){
        removeFromDataBase(`bookReaders`, `${id}`);
      }else{
        removeFromDataBase(`bookReaders`, `${id}/readers/${user.uid}`);
        removeFromDataBase(`bookRecensions`, `${id}/recensions/${user.uid}`);
      
      }
    }

  };

  const addToShelf = (hasStarted, hasFinished, readPages) => {
    if (user) { 
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
      if (user) {   
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
    }
    }
  };

  const [showList, setShowList] = useState(false);
  const showListsOfUsers = () => {
    setShowList(true);
  };

  const closeListsOfUsers = () => {
    setShowList(false);
  };

  const recommendToUser = async (receiverId: string) => {
    if (user) {
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
dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.send[selectedLanguage]}`, alertType:"success"}));
    }

  };

  return (
    <div className={`min-h-screen h-full overflow-x-hidden ${!isDarkModed && "pattern-bg"}`}>
      {/* {isOpened && <EditBook id={id} />} */}

      {document && (
        <>
     
            </>
      )}
      {document &&  readers && (
         <>
     
            </>
      )}

      {bookReaderForm && document && user && (
       <>
     
            </>
      )}

      {updateReaderStatus && document && (
     <>
     
            </>
      )}

      {showLikers && (
        <>
     
            </>
      )}
      {isPending && <Loader />}

    </div>
  );
}

export default Book;
