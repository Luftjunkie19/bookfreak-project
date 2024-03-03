import '../../components/stylings/mui-stylings.css';

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
import { Link } from 'react-router-dom';
import uniqid from 'uniqid';

import {
  Alert,
  Autocomplete,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { storage } from '../../';
import { bookCategories } from '../../assets/CreateVariables';
import alertMessages from '../../assets/translations/AlertMessages.json';
import translations from '../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../assets/translations/ReusableTranslations.json';
import { snackbarActions } from '../../context/SnackBarContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';

function CreateBook() {
  const { user } = useAuthContext();
  const [error, setError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [editCover, setEditCover] = useState(null);
  const { addToDataBase } = useRealDatabase();
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [radius, setRadius] = useState(0);
  const [link, setLink] = useState(null);
  const [selected, setSelected]=useState("");
  const dispatch= useDispatch();
  const { documents:availableBooks } = useGetDocuments("books");
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
    .filter((reader) => reader.id === user.uid);

  const [book, setBook] = useState({
    author: "",
    title: "",
    pagesNumber: 1,
    category: null,
    bookCover: null,
    description: "",
    dateOfPublishing: null,
    countryOfRelease:"",
    publishingHouse:null,
  });
  const editorRef = useRef();

  const [usersReadPages, setUsersReadPages] = useState(0);
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  const isDarkModed = useSelector((state) => state.mode.isDarkMode);

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
      dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]}`, alertType:"error"}));
      setEditCover(null);
      return;
    }

    if (selected === null) {
      dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.selectAnything[selectedLanguage]}`, alertType:"error"}));
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
        setEditCover(fileReader.result);
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

      if (book.category.trim() === "") {
        setError(
          alertMessages.notifications.wrong.emptyMessage[selectedLanguage]
        );
        dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.emptyMessage[selectedLanguage]}`, alertType:"error"}));
        setIsPending(false);
     
        return;
      }

      if (book.pagesNumber < usersReadPages) {
        setError(
          alertMessages.notifications.wrong.outOfSpaceReading[selectedLanguage]
        );
        dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.outOfSpaceReading[selectedLanguage]}`, alertType:"error"}));
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
        dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.existsBook[selectedLanguage]}`, alertType:"error"}));
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

      if(book.description.trim().length < 20){
        dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.writeLonger[selectedLanguage]}`, alertType:"error"}));
        setError(alertMessages.notifications.wrong.writeLonger[selectedLanguage]);
        return
      }

      if(book.countryOfRelease.trim().length ===0 || !book.dateOfPublishing || !book.publishingHouse){
        dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.someFieldsEmpty[selectedLanguage]}`, alertType:"error"}));
        return
      }

      if(!book.bookCover){
        dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.bookCoverReq[selectedLanguage]}`, alertType:"error"}));
        return
      }

      

      if(book.dateOfPublishing > new Date().getFullYear()){
        dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.timeTraveler[selectedLanguage]}`, alertType:"error"}));
        return
      }


      console.log(bookReaders);

      if (bookReaders.find((reader) => !reader.hasFinished)) {
        dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.recentlyStartedReading[selectedLanguage]}`, alertType:"error"}));
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
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
          id: user.uid,
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
          [user.uid]: {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            startedReading: hasStarted,
            hasFinished: usersReadPages === book.pagesNumber,
            pagesRead: usersReadPages,
            bookRate: 0,
            dateOfFinish: isCompleted ? new Date().getTime() : null,
            recension: "",
            id: user.uid,

            bookReadingId: uniqueId,
          },
        },
      });

      addToDataBase("bookRecensions", uniqueId, {
        averageRate: 0,
        recensions: {},
      });


      dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.create[selectedLanguage]}`, alertType:"success"}));

     

      setIsPending(false);
      setError(null);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const handleSaveCover = async () => {
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
      `book-covers/${user.uid}/${
        book.title ? book.title : `book${uniqid()}`
      }.jpg`
    );
    await uploadBytes(storageRef, byteArray);
    const url = await getDownloadURL(storageRef);
    console.log(url);

    setBook((book) => {
      book.bookCover = url;
      return book;
    });

    setEditCover(null);
  };

  return (
    <div className={`min-h-screen h-full w-full overflow-x-hidden ${!isDarkModed && "pattern-bg"}`}>
      {editCover && (
        <div class="h-screen bg-imgCover w-screen fixed top-0 left-0 z-[9999999]">
          <button
            className="btn absolute top-0 right-0 m-2 bg-error z-[999] text-white"
            onClick={() => {
              setEditCover(null);
            }}
          >
            <FaWindowClose /> {reuseableTranslations.closeBtn[selectedLanguage]}
          </button>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <AvatarEditor
              image={editCover}
              ref={editorRef}
              width={300}
              height={300}
              borderRadius={radius}
              color={[0, 0, 0, 0.5]}
              scale={zoomLevel}
            />

            <label className="flex flex-col m-2">
              <span>Zoom level: x{zoomLevel}</span>
              <input
                className="range range-info"
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoomLevel}
                onChange={(e) => setZoomLevel(+e.target.value)}
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </div>
            </label>

            <label className="flex flex-col m-2">
              <span>Radius level: {radius / 100}x</span>
              <input
                className="range range-info"
                type="range"
                min={0}
                max={150}
                step={1.5}
                value={radius}
                onChange={(e) => setRadius(+e.target.value)}
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </div>
            </label>

            <div className="flex justify-center items-center">
              <button
                className="btn bg-accColor mt-4 text-white"
                onClick={handleSaveCover}
              >
                {reuseableTranslations.saveBtn[selectedLanguage]}
              </button>
            </div>
          </div>
        </div>
      )}{" "}
      <form onSubmit={handleSubmit} className={`w-full flex flex-col ${isDarkModed ? "text-white" : "text-black"}`}>
        <div className="flex flex-wrap items-center justify-center  w-full gap-4 p-4">
          <FaBook className={`text-6xl font-bold ${isDarkModed ? "text-white" : "text-black"}`} />
          <p className={` ${isDarkModed ? "text-white" : "text-black"} font-semibold`}>
            {translations.topText.books[selectedLanguage]}
          </p>
        </div>

        <div className="w-full flex-col flex gap-2 p-4">
          <p className="text-2xl bg-accColor p-2 font-bold w-max rounded-md text-white">{translations.generalInfo[selectedLanguage]}</p>
          <div className="flex flex-wrap w-full gap-4">
            <label className="flex flex-col sm:w-full md:max-w-lg lg:max-w-xs xl:max-w-md">
              <span>
                {translations.bookTitleInput.label[selectedLanguage]}:
              </span>
              <input
                required
                type="text"
                className="input w-full border-accColor outline-none py-4 px-1"
                onChange={(e) =>
                  setBook((book) => {
                    book.title = e.target.value;
                    return book;
                  })
                }
                placeholder={`${translations.bookTitleInput.placeholder[selectedLanguage]}`}
              />
            </label>

            <label className="flex flex-col sm:w-full md:max-w-lg lg:max-w-xs xl:max-w-md">
              <span>
                {translations.bookAuthorInput.label[selectedLanguage]}:
              </span>
              <input
                required
                type="text"
                onChange={(e) =>
                  setBook((book) => {
                    book.author = e.target.value;
                    return book;
                  })
                }
                className="input border-accColor outline-none w-full py-4 px-1"
                placeholder={`${translations.bookAuthorInput.placeholder[selectedLanguage]}`}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col p-4 w-full gap-2">
          <p className="text-2xl text-white bg-accColor p-2 font-bold w-max rounded-md">{translations.detailedInfo[selectedLanguage]}</p>
          <div className="flex items-center flex-wrap w-full gap-4">
            <label className="flex flex-col sm:w-full md:max-w-lg lg:max-w-xs xl:max-w-sm">
              <Autocomplete
                className="text-white"
                sx={{
                  color: "white",
                }}
                options={bookCategories}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={`${translations.bookCategoryInput.label[selectedLanguage]}`}
                  />
                )}
                onChange={(e, value) => {
                  setBook((book) => {
                    book.category = value;
                    return book;
                  });
                }}
                onInputChange={(e, value) => {
                  setBook((book) => {
                    book.category = value;
                    return book;
                  });
                }}
              />
            </label>

            <label className="flex flex-col sm:w-full md:max-w-lg lg:max-w-xs xl:max-w-sm">
              <span>
                {translations.pagesAmountInput.label[selectedLanguage]}:
              </span>

              <input
                min={0}
                required
                type="number"
                onChange={(e) =>
                  setBook((book) => {
                    book.pagesNumber = +e.target.value;
                    return book;
                  })
                }
                placeholder={`${translations.pagesAmountInput.placeholder[selectedLanguage]}`}
                className="input border-accColor outline-none w-full py-4 px-1 text-lg"
              />
            </label>

            <label className="flex flex-col gap-1 sm:w-full md:max-w-lg lg:max-w-xs xl:max-w-sm">
              <p>{translations.selectImgBtn.label[selectedLanguage]}</p>
          <input
            required
            type="file"
            onChange={handleSelect}
            className="hidden w-full"
          />
          <p className="btn w-full bg-accColor text-white border-none hover:bg-primeColor ">
            {translations.selectImgBtn.label[selectedLanguage]}
            <FaImage />
          </p>
        </label>


            <label className="flex flex-col sm:w-full md:max-w-lg lg:max-w-xs xl:max-w-sm">
              <p>{translations.countryOfBookRelease[selectedLanguage]}</p>
                <ReactFlagsSelect className="text-black w-full"
                selected={selected}
              onSelect={(country)=>{
                setSelected(country);
                setBook((book)=>{
                  book.countryOfRelease=country;
                  return book;
                })
              }}
              selectButtonClassName="bg-accColor text-white rounded-md border-white text-white"/>
            </label>
            <label className="flex flex-col sm:w-full md:max-w-lg lg:max-w-xs xl:max-w-md">
              <p>{translations.publisher[selectedLanguage]}</p>
              <input onChange={(e)=>{
                setBook((book)=>{
                  book.publishingHouse=e.target.value;
                  return book;
                });
              }} className="input border-accColor outline-none w-full py-4 px-1 text-lg" type="text" />
            </label>

            <label className='sm:w-full md:max-w-lg lg:max-w-xs xl:max-w-md'>
              <p>{translations.yearOfRelease[selectedLanguage]}</p>
              <DatePicker className='w-full' openTo="year" onChange={(value)=>{
                setError(null);
const yearOfPublishing=value["$y"];

if(yearOfPublishing > new Date().getFullYear()){
  dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.timeTraveler[selectedLanguage]}`, alertType:"error"}));
return;
}

                setBook((bookItem)=>{
                  bookItem.dateOfPublishing=yearOfPublishing;
                  return bookItem;
                });
  
              }} />
            </label>

          </div>
        </div>

<div className="w-full max-w-2xl flex flex-col p-4 gap-3">
<p className='text-2xl bg-accColor text-white p-2 font-bold w-min rounded-md'>{translations.descriptionTextarea.label[selectedLanguage]}</p>
  <textarea placeholder={translations.descriptionTextarea.placeholder[selectedLanguage]} required className="textarea border-accColor textarea-bordered outline-none sm:w-full md:max-w-md lg:max-w-2xl h-24 resize-none" onChange={(e)=>{
    setBook((book)=>{
      book.description=e.target.value;
      return book;
    });
  }}>
  </textarea>
</div>


        <div className="flex flex-col w-full p-4 gap-2">
          <p className="text-2xl text-white bg-accColor p-2 font-bold w-max rounded-md">{translations.userInfo[selectedLanguage]}</p>

          <div className="form-control justify-center sm:w-full md:max-w-lg">
            <label className="label cursor-pointer">
              <span className="label-text">
                {translations.hasStarted.query[selectedLanguage]}?
              </span>

              <input
                type="checkbox"
                className="checkbox checkbox-info"
                onChange={(e) => {
                  setHasStarted(e.target.checked);
                }}
              />
            </label>
          </div>

          {hasStarted && (
            <>
              <div className="form-control justify-center sm:w-full md:max-w-md">
                <label className="flex flex-col">
                  <span className="label-text">
                    {translations.readPagesInput.label[selectedLanguage]}?
                  </span>
                  <input
                    className="input border-accColor outline-none w-full py-4 px-1"
                    type="number"
                    value={usersReadPages}
                    min={0}
                    max={book.pagesNumber}
                    onChange={(e) => {
                      if (+e.target.value === book.pagesNumber) {
                        setIsCompleted(true);
                        return;
                      }

                      if (+e.target.value > book.pagesNumber) {
                        setIsCompleted(false);
                        setUsersReadPages(book.pagesNumber);
                        return;
                      }

                      setUsersReadPages(+e.target.value);
                    }}
                  />
                </label>
              </div>

              <div className="form-control justify-center sm:w-full md:max-w-lg">
                <label className="label cursor-pointer">
                  <span className="label-text">
                    {translations.hasFinished.query[selectedLanguage]}?
                  </span>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-info"
                    onChange={(e) => {
                      setIsCompleted(e.target.checked);
                      if (e.target.checked) {
                        setUsersReadPages(book.pagesNumber);
                      } else {
                        setUsersReadPages(0);
                      }
                    }}
                  />
                </label>
              </div>
            </>
          )}
        </div>

        
        {error && (
          <Alert className='m-1 w-max' severity="error">
            {error}
          </Alert>
        )}

        <div className="flex justify-center items-center w-full my-4">
          <button className="btn sm:w-full md:max-w-lg text-white bg-accColor">
            {translations.submit[selectedLanguage]}
          </button>
        </div>


        {link && <Link to={`/book/${link}`}>{translations.moveToBook[selectedLanguage]}</Link>}
      </form>
    </div>
  );
}

export default CreateBook;
