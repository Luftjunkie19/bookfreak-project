import { useEffect, useRef, useState } from "react";

import { updateEmail, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { motion } from "framer-motion";
import AvatarEditor from "react-avatar-editor";
import { FaUserAlt, FaWindowClose } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Alert } from "@mui/material";

import alertMessages from "../../assets/translations/AlertMessages.json";
import formsTranslation from "../../assets/translations/FormsTranslations.json";
import reuseableTranslations from "../../assets/translations/ReusableTranslations.json";
import Loader from "../../components/Loader";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFormRealData } from "../../hooks/useFormRealData";
import { useRealDatabase } from "../../hooks/useRealDatabase";
import useRealtimeDocuments from "../../hooks/useRealtimeDocuments";

function EditProfile() {
  const { user } = useAuthContext();

  const { document } = useFormRealData("users", user.uid);
  const { getDocuments } = useRealtimeDocuments();
  const { updateDatabase } = useRealDatabase();
  const defaultImg = user.photoURL;
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const [nickname, setNickname] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [profileImg, setProfileImg] = useState(defaultImg);
  const [imgError, setImgError] = useState(null);
  const [description, setDescription] = useState("");
  const [editProfileImg, setEditProfileImg] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [bookReaders, setBookReaders] = useState([]);
  const editorRef = useRef();

  const storage = getStorage();

  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadBookReaders = async () => {
    const documents = await getDocuments("bookReaders");

    const realObjects = documents.map((bookReader) => {
      return bookReader.readers;
    });

    const newArray = realObjects.map((obj) => {
      const nestedObject = Object.values(obj)[0];
      return nestedObject;
    });

    setBookReaders(newArray);
  };

  useEffect(() => {
    loadBookReaders();
  }, [loadBookReaders]);

  useEffect(() => {
    if (document) {
      setDescription(document.description);
    }
  }, [document]);

  const handleImg = (e) => {
    setImgError(null);
    setEditProfileImg(null);
    setIsPending(false);

    let selected = e.target.files[0];

    if (selected?.size > 100000) {
      setImgError(`The ${selected.name} is to big file`);
      setEditProfileImg(null);
      return;
    }

    if (!selected?.type.includes("image")) {
      setImgError("Selected file is not an Img");
      setEditProfileImg(null);
      return;
    }

    if (selected === null) {
      setProfileImg(document.photoURL);
      setEditProfileImg(null);
      return;
    }

    if (selected?.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setEditProfileImg(fileReader.result);
      };
      return;
    }

    setImgError(null);
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

    setProfileImg(url);
    setEditProfileImg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsPending(true);
    try {
      console.log(nickname, email, profileImg);

      await updateProfile(user, {
        displayName: nickname,
        photoURL: profileImg,
      });

      await updateEmail(user, email);

      updateDatabase(
        {
          ...document,
          nickname: nickname,
          photoURL: profileImg,
          description: description,
          email: email,
        },
        "users",
        user.uid
      );

      if (bookReaders.length > 0) {
        const yourObjects = bookReaders.filter(
          (reader) => reader.id === user.uid
        );

        yourObjects.map((reader) => {
          updateDatabase(
            {
              ...reader,
              displayName: nickname,
              email: email,
              photoURL: profileImg,
            },
            "bookReaders",
            `${reader.bookReadingId}/readers/${user.uid}`
          );
        });
      }

      setIsPending(false);
      navigate(`/profile/${user.uid}`);
      toast.info(
        alertMessages.notifications.successfull.update[selectedLanguage]
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      className="min-h-screen h-full flex justify-center items-center flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {editProfileImg && (
        <div class="h-screen bg-imgCover w-screen fixed top-0 left-0 z-[9999]">
          <button
            className="btn absolute top-0 right-0 m-2"
            onClick={() => {
              setEditProfileImg(null);
            }}
          >
            <FaWindowClose /> Close
          </button>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <AvatarEditor
              image={editProfileImg}
              ref={editorRef}
              width={300}
              height={300}
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

            <div className="flex justify-center items-center">
              <button
                className="btn bg-accColor mt-4 text-white"
                onClick={handleSaveAvatar}
              >
                {reuseableTranslations.saveBtn[selectedLanguage]}
              </button>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex sm:w-full md:w-3/4 xl:w-2/3 2xl:w-1/2 p-3 flex-col justify-center items-center text-white sm:bg-transparent md:bg-accColor rounded-lg"
      >
        <FaUserAlt className="text-3xl" />
        <h2 className="text-3xl text-center">
          {formsTranslation.topText.editProfile[selectedLanguage]}
        </h2>
        <p className="my-2 text-sm text-center">
          {formsTranslation.topText.editCompetition.underText[selectedLanguage]}
        </p>
        <div className="flex flex-wrap w-full justify-around items-center gap-4 p-6 rounded-lg">
          <label className="flex flex-col sm:w-full lg:w-2/5">
            <span>
              {formsTranslation.userFields.nickname[selectedLanguage]}:
            </span>
            <input
              className="p-4 rounded-lg"
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </label>

          <label className="flex flex-col sm:w-full lg:w-2/5">
            <span>Email:</span>
            <input
              className="p-4 rounded-lg"
              type="email"
              required
              value={email}
              disabled={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="flex flex-col sm:w-full lg:w-2/5">
            <span>
              {formsTranslation.userFields.chooseAvatar[selectedLanguage]}:{" "}
            </span>
            <input
              type="file"
              onChange={handleImg}
              className="file-input file-input-bordered w-full"
            />
          </label>

          <label className="flex flex-col w-full">
            <span>
              {formsTranslation.descriptionTextarea.label[selectedLanguage]}:
            </span>
            <textarea
              className="p-4 rounded-lg resize-none outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>

          <small className="w-full">
            While logging with any auth-provider you cannot change your email or
            we're too dumb for it 😅 yet. Expect an development of the site sir.
          </small>
        </div>
        {!isPending && (
          <button className="btn sm:w-full md:w-1/2 my-4 sm:bg-accColor md:bg-primeColor text-white">
            {formsTranslation.updateBtn[selectedLanguage]}
          </button>
        )}

        {isPending && (
          <button disabled className="btn bg-primeColor">
            Loading...
          </button>
        )}

        {imgError && (
          <Alert className="bg-transparent" severity="error">
            {imgError}
          </Alert>
        )}
      </form>
      {isPending && <Loader />}
    </motion.div>
  );
}

export default EditProfile;
