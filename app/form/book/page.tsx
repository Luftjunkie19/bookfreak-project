'use client';
import {
  useRef,
  useState,
} from 'react';

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import AvatarEditor from 'react-avatar-editor';
import ReactFlagsSelect from 'react-flags-select';
import {
  FaBook,
  FaImage,
  FaWindowClose,
} from 'react-icons/fa';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router';
import  Link  from 'next/link';
import uniqid from 'uniqid';



import { storage } from '../../firebase';
// import { bookCategories } from '../../assets/CreateVariables';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import { snackbarActions } from '../../../context/SnackBarContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useRealDatabase } from 'hooks/useRealDatabase';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { User } from 'firebase/auth';

function CreateBook() {
  const { user } = useAuthContext();
  const [error, setError] = useState<string | null>("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [editCover, setEditCover] = useState<string | null>(null);
  const { addToDataBase } = useRealDatabase();
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [radius, setRadius] = useState(0);
  const [link, setLink] = useState(null);
  const [selected, setSelected] = useState("");
  const dispatch = useDispatch();
  const { documents: availableBooks } = useGetDocuments("books");
  const { documents } = useGetDocuments("bookReaders");
  const bookReaders = documents
    .map((bookReader) => {
      return bookReader.readers;
    })
    .map((obj) => {
      const nestedObject = Object.values(obj);
      return nestedObject;
    })
    .flat()
    .filter((reader:any) => reader.id === (user as User).uid);

  const [book, setBook] = useState({
    author: "",
    title: "",
    pagesNumber: 1,
    category: null,
    bookCover: null,
    description: "",
    dateOfPublishing: null,
    countryOfRelease: "",
    publishingHouse: null,
  });
  const editorRef = useRef<AvatarEditor>(null);

  const [usersReadPages, setUsersReadPages] = useState(0);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);

  const handleSelect = (e) => {
    setError(null);
    setEditCover(null);
    setIsPending(false);

    let selected = e.target.files[0];

    if (selected?.size > 200000) {
      setError(alertMessages.notifications.wrong.tooBigFile[selectedLanguage]);
      setEditCover(null);
      return;
    }

    if (!selected.type.includes("image")) {
      dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]}`, alertType: "error" }));
      setEditCover(null);
      return;
    }

    if (selected === null) {
      dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.selectAnything[selectedLanguage]}`, alertType: "error" }));
      setError(
        alertMessages.notifications.wrong.selectAnything[selectedLanguage]
      );

      setEditCover(null);
      return;
    }

    if (selected.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setEditCover(fileReader.result as string);
      };
      setError(null);
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const uniqueId = uniqid();

      if (book.category && book.category.trim() === "") {
        setError(
          alertMessages.notifications.wrong.emptyMessage[selectedLanguage]
        );
        dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.emptyMessage[selectedLanguage]}`, alertType: "error" }));
        setIsPending(false);

        return;
      }

      if (book.pagesNumber < usersReadPages) {
        setError(
          alertMessages.notifications.wrong.outOfSpaceReading[selectedLanguage]
        );
        dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.outOfSpaceReading[selectedLanguage]}`, alertType: "error" }));
        return;
      }

      if (
        availableBooks.find(
          (doc) =>
            doc.title.toLowerCase().includes(book.title.toLowerCase()) &&
            doc.author.toLowerCase().includes(book.author.toLowerCase()) &&
            doc.countryOfRelease.toLowerCase().includes(book.countryOfRelease.toLowerCase())
        )
      ) {
        dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.existsBook[selectedLanguage]}`, alertType: "error" }));
        setError(alertMessages.notifications.wrong.existsBook[selectedLanguage]);
        setLink(
          availableBooks.find(
            (doc) =>
              doc.title.toLowerCase().includes(book.title.toLowerCase()) &&
              doc.author.toLowerCase().includes(book.author.toLowerCase()) &&
              doc.countryOfRelease.toLowerCase().includes(book.countryOfRelease.toLowerCase())
          ).id
        );
        return;
      }

      if (book.description.trim().length < 20) {
        dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.writeLonger[selectedLanguage]}`, alertType: "error" }));
        setError(alertMessages.notifications.wrong.writeLonger[selectedLanguage]);
        return
      }

      if (book.countryOfRelease.trim().length === 0 || !book.dateOfPublishing || !book.publishingHouse) {
        dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.someFieldsEmpty[selectedLanguage]}`, alertType: "error" }));
        return
      }

      if (!book.bookCover) {
        dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.bookCoverReq[selectedLanguage]}`, alertType: "error" }));
        return
      }



      if (book.dateOfPublishing > new Date().getFullYear()) {
        dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.timeTraveler[selectedLanguage]}`, alertType: "error" }));
        return
      }


      console.log(bookReaders);

      if (bookReaders.find((reader:any) => !reader.hasFinished)) {
        dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.recentlyStartedReading[selectedLanguage]}`, alertType: "error" }));
        return;
      }

      const bookElement = {
        ...book,
        author: book.author,
        title: book.title,
        pagesNumber: book.pagesNumber,
        photoURL: book.bookCover,
        category: book.category,
        createdBy: {
          displayName: (user as User).displayName,
          email: (user as User).email,
          photoURL: (user as User).photoURL,
          createdAt: new Date(),
          id: (user as User).uid,
        },
        id: uniqueId,
      };

      console.log(bookElement);

      addToDataBase("books", uniqueId, bookElement);
      addToDataBase("likesData", uniqueId, {
        likesAmount: 0,
      });

      addToDataBase("bookReaders", uniqueId, {
        id: uniqueId,
        readers: {
          [(user as User).uid]: {
            displayName: (user as User).displayName,
            email: (user as User).email,
            photoURL: (user as User).photoURL,
            startedReading: hasStarted,
            hasFinished: usersReadPages === book.pagesNumber,
            pagesRead: usersReadPages,
            bookRate: 0,
            dateOfFinish: isCompleted ? new Date().getTime() : null,
            recension: "",
            id: (user as User).uid,

            bookReadingId: uniqueId,
          },
        },
      });

      addToDataBase("bookRecensions", uniqueId, {
        averageRate: 0,
        recensions: {},
      });


      dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.successfull.create[selectedLanguage]}`, alertType: "success" }));



      setIsPending(false);
      setError(null);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const handleSaveCover = async () => {
    if (editorRef.current) {
      
      const editorImg = editorRef.current
        .getImageScaledToCanvas()
        .toDataURL("image/jpg");
  
      const byteCharacters = atob(editorImg.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
  
      const storageRef = ref(
        storage,
        `book-covers/${(user as User).uid}/${book.title ? book.title : `book${uniqid()}`
        }.jpg`
      );
      await uploadBytes(storageRef, byteArray);
      const url = await getDownloadURL(storageRef);
      console.log(url);
  
      setBook((book:any) => {
        book.bookCover = url;
        return book;
      });
  
      setEditCover(null);
    }
  };

  return (
    <div className={`min-h-screen h-full w-full overflow-x-hidden ${!isDarkModed && "pattern-bg"}`}>

    </div>
  );
}

export default CreateBook;
