import {
  useRef,
  useState,
} from 'react';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import AvatarEditor from 'react-avatar-editor';
import {
  FaBook,
  FaImage,
  FaWindowClose,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import uniqid from 'uniqid';

import {
  Alert,
  Autocomplete,
  TextField,
} from '@mui/material';

import { bookCategories } from '../../assets/CreateVariables';
import alertMessages from '../../assets/translations/AlertMessages.json';
import translations from '../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../assets/translations/ReusableTranslations.json';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useRealDatabase } from '../../hooks/useRealDatabase';

function CreateBook() {
  const [error, setError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [editCover, setEditCover] = useState(null);
  const { addToDataBase } = useRealDatabase();
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [radius, setRadius] = useState(0);
  const [book, setBook] = useState({
    author: "",
    title: "",
    pagesNumber: 1,
    category: null,
    bookCover: null,
  });
  const editorRef = useRef();
  const { user } = useAuthContext();
  const [usersReadPages, setUsersReadPages] = useState(0);
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  const handleSelect = (e) => {
    setError(null);
    setEditCover(null);
    setIsPending(false);

    let selected = e.target.files[0];

    if (selected?.size > 200000) {
      setError(alertMessages.notficactions.wrong.tooBigFile[selectedLanguage]);
      setEditCover(null);
      return;
    }

    if (!selected?.type.includes("image")) {
      setError(
        alertMessages.notficactions.wrong.inAppropriateFile[selectedLanguage]
      );
      setEditCover(null);
      return;
    }

    if (selected === null) {
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
        setIsPending(false);
        toast.error(
          alertMessages.notifications.wrong.emptyMessage[selectedLanguage]
        );
        return;
      }

      if (book.pagesNumber < usersReadPages) {
        setError(
          alertMessages.notifications.wrong.outOfSpaceReading[selectedLanguage]
        );
        return;
      }

      const bookElement = {
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

      toast.success(
        alertMessages.notifications.successfull.create[selectedLanguage]
      );

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
      getStorage(),
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
    <div className="min-h-screen h-full w-full flex flex-col justify-center items-center">
      {editCover && (
        <div class="h-screen bg-imgCover w-screen fixed top-0 left-0 z-[9999]">
          <button
            className="btn absolute top-0 right-0 m-2"
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
      <form
        onSubmit={handleSubmit}
        className="lg:bg-accColor sm:w-full lg:w-2/3 xl:w-3/5 2xl:w-1/2 text-white p-6 rounded-lg"
      >
        <div className="flex flex-col justify-center items-center w-full gap-2 p-2">
          <FaBook className="text-6xl font-bold" />
          <p className="text-center">
            {translations.topText.books[selectedLanguage]}
          </p>
        </div>

        <div className="grid sm:grid-cols-1 xl:grid-cols-2 gap-2">
          <label className="flex flex-col">
            <span>{translations.bookTitleInput.label[selectedLanguage]}:</span>
            <input
              required
              type="text"
              className="input border-none outline-none w-full py-4 px-1"
              onChange={(e) =>
                setBook((book) => {
                  book.title = e.target.value;
                  return book;
                })
              }
              placeholder={`${translations.bookTitleInput.placeholder[selectedLanguage]}`}
            />
          </label>
          <label className="flex flex-col">
            <span>{translations.bookAuthorInput.label[selectedLanguage]}:</span>
            <input
              required
              type="text"
              onChange={(e) =>
                setBook((book) => {
                  book.author = e.target.value;
                  return book;
                })
              }
              className="input border-none outline-none w-full py-4 px-1"
              placeholder={`${translations.bookAuthorInput.placeholder[selectedLanguage]}`}
            />
          </label>

          <label className="flex flex-col">
            <span>
              {translations.bookCategoryInput.label[selectedLanguage]}:
            </span>

            <Autocomplete
              className="text-white"
              sx={{
                color: "white",
                borderColor: "white",
                colorAdjust: "white",
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
          <label className="flex flex-col">
            <span>{translations.selectImgBtn.label[selectedLanguage]}:</span>
            <div className="flex items-center justify-center">
              <input
                required
                type="file"
                onChange={handleSelect}
                className="hidden"
              />
              <p className="btn btn-wide sm:bg-accColor lg:bg-primeColor text-white border-none hover:bg-primeColor">
                {translations.selectImgBtn.text[selectedLanguage]}
                <FaImage />
              </p>
            </div>
          </label>

          <label className="flex flex-col">
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
              className="input border-none outline-none w-full py-4 px-1"
            />
          </label>

          <div className="form-control justify-center">
            <label className="label cursor-pointer">
              <span className="label-text">
                {translations.hasStarted.query[selectedLanguage]}?
              </span>

              <input
                type="checkbox"
                className="checkbox"
                onChange={(e) => {
                  setHasStarted(e.target.checked);
                }}
              />
            </label>
          </div>
          {hasStarted && (
            <>
              <div className="form-control justify-center">
                <label className="flex flex-col">
                  <span className="label-text">
                    {translations.readPagesInput.label[selectedLanguage]}?
                  </span>
                  <input
                    className="input border-none outline-none w-full py-4 px-1"
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

              <div className="form-control justify-center">
                <label className="label cursor-pointer">
                  <span className="label-text">
                    {translations.hasFinished.query[selectedLanguage]}?
                  </span>
                  <input
                    type="checkbox"
                    className="checkbox"
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

        <div className="flex w-full justify-center items-center my-4">
          <button className="btn sm:w-full md:w-1/2 text-white sm:bg-accColor lg:bg-primeColor">
            {translations.submit[selectedLanguage]}
          </button>
        </div>

        {error && (
          <Alert className="bg-transparent" severity="error">
            {error}
          </Alert>
        )}
      </form>
    </div>
  );
}

export default CreateBook;
