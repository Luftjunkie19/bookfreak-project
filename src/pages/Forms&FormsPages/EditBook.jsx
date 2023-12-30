import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { motion } from 'framer-motion';
import AvatarEditor from 'react-avatar-editor';
import {
  FaBookOpen,
  FaWindowClose,
} from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Alert } from '@mui/material';

import alertMessages from '../../assets/translations/AlertMessages.json';
import translations from '../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../assets/translations/ReusableTranslations.json';
import Loader from '../../components/Loader';
import { modalActions } from '../../context/ModalContext';
import { snackbarActions } from '../../context/SnackBarContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFormRealData } from '../../hooks/useFormRealData';
import { useRealDatabase } from '../../hooks/useRealDatabase';

function EditBook({ id }) {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  
  const { document } = useFormRealData("books", id);
  const { updateDatabase } = useRealDatabase();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pagesNumber, setPagesNumber] = useState(1);
  const [erro, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [photoImg, setPhotoImg] = useState(null);
  const [editPhotoImg, setEditPhotoImg] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const storage = getStorage();
  const { user } = useAuthContext();
  const editorRef = useRef();
  const navigate = useNavigate();
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setAuthor(document.author);
      setPagesNumber(document.pagesNumber);
      setPhotoImg(document.photoURL);
    }
  }, [document]);

  const dispatch = useDispatch();

  const changeLogo = (e) => {
    setError(null);
    setEditPhotoImg(null);
    setIsPending(false);

    let selected = e.target.files[0];

    if (selected === null) {
      setEditPhotoImg(null);
      setPhotoImg(document.photoURL);
      return;
    }
    if (selected?.size > 100000) {
      setError(alertMessages.notficactions.wrong.tooBigFile[selectedLanguage]);
      setEditPhotoImg(null);
      return;
    }

    if (!selected?.type.includes("image")) {
      setError(
        alertMessages.notficactions.wrong.inAppropriateFile[selectedLanguage]
      );
      setEditPhotoImg(null);
      return;
    }

    if (selected?.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setEditPhotoImg(fileReader.result);
      };
      return;
    }

    setError(null);
  };

  const handleSaveAvatar = async () => {
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
      `profileImg/uid${user.uid}/${user.displayName}.jpg`
    );
    await uploadBytes(storageRef, byteArray);
    const url = await getDownloadURL(storageRef);
    console.log(url);

    setPhotoImg(url);
    setEditPhotoImg(null);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      setError(null);
      setIsPending(false);
      dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.update[selectedLanguage]}`, alertType:"success"}))
      

      updateDatabase(
        {
          ...document,
          title: title,
          author: author,
          pagesNumber: pagesNumber,
          photoURL: photoImg,
        },
        "books",
        id
      );

      navigate(`/book/${id}`);
      dispatch(modalActions.closeModal());
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <motion.div
        className="loader-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button
          className="btn sm:text-xs lg:text-base absolute right-0 top-0 m-2 bg-error text-white"
          onClick={() => {
            dispatch(modalActions.closeModal());
          }}
        >
          {reuseableTranslations.closeBtn[selectedLanguage]} <GrClose />
        </button>

        <form
          onSubmit={handleUpdate}
          className="flex flex-col items-center justify-center gap-5"
        >
          <FaBookOpen className="text-4xl" />
          <h2 className="text-3xl font-semibold text-white">
            {translations.topText.editBookText[selectedLanguage]}
          </h2>
          <p>{translations.topText.editBookText.underText[selectedLanguage]}</p>

          <label className="flex flex-col w-full">
            <span>{translations.bookTitleInput.label[selectedLanguage]}: </span>
            <input
              className={`outline-none input border-2 border-accColor rounded-md p-2 w-full  ${isDarkModed ? "text-white" : "text-black"} `}
              type="text"
              name="title"
              required
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </label>
          <label className="flex flex-col w-full">
            <span>
              {translations.bookAuthorInput.label[selectedLanguage]}:{" "}
            </span>
            <input
              className={`outline-none input border-2 border-accColor rounded-md p-2 w-full  ${isDarkModed ? "text-white" : "text-black"}`}
              type="text"
              name="author"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </label>

          <label className="flex flex-col w-full">
            <span>
              {translations.pagesAmountInput.label[selectedLanguage]}:{" "}
            </span>
            <input
              type="number"
              name="pagesNumber"
              className={`outline-none input border-2 border-accColor rounded-md p-2 w-full  ${isDarkModed ? "text-white" : "text-black"}`}
              min={1}
              required
              value={pagesNumber}
              onChange={(e) => setPagesNumber(+e.target.value)}
            />
          </label>

          <label className="flex flex-col m-2">
            <span>{translations.selectImgBtn.label[selectedLanguage]}:</span>

            <input
              className={`file-input file-input-bordered w-full max-w-xsoutline-none ${isDarkModed ? "text-white" : "text-black"}`}
              type="file"
              onChange={changeLogo}
            />
          </label>

          {erro && (
            <Alert className="bg-transparent" severity="error">
              {erro}
            </Alert>
          )}

          <button className="btn bg-accColor text-white btn-wide my-2">
            {reuseableTranslations.updateStatus[selectedLanguage]}
          </button>
        </form>
        {editPhotoImg && (
          <div className="loader-container">
            <button
              className="btn absolute top-0 right-0 btn-error text-white m-2"
              onClick={() => {
                setEditPhotoImg(null);
                setPhotoImg(document.photoURL);
              }}
            >
              <FaWindowClose /> Close
            </button>

            <AvatarEditor
              image={editPhotoImg}
              ref={editorRef}
              width={300}
              height={300}
              color={[0, 0, 0, 0.5]}
              scale={zoomLevel}
            />

            <label className="flex flex-col">
              <span>Zoom:</span>

              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoomLevel}
                onChange={(e) => setZoomLevel(+e.target.value)}
                className="range range-success py-2"
              />
            </label>
            <p>Zoom level: x{zoomLevel}</p>

            <button
              className="btn bg-accColor text-white"
              onClick={handleSaveAvatar}
            >
              {reuseableTranslations.saveBtn[selectedLanguage]}
            </button>
          </div>
        )}
      </motion.div>

      {isPending && <Loader />}
    </>
  );
}

export default EditBook;
