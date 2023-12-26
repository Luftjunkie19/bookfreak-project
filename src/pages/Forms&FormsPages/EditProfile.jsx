import { useEffect, useRef, useState } from "react";

import { updateEmail, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { motion } from "framer-motion";
import AvatarEditor from "react-avatar-editor";
import ReactFlagsSelect from "react-flags-select";
import { FaWindowClose } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Snackbar } from "@mui/material";

import alertMessages from "../../assets/translations/AlertMessages.json";
import formsTranslation from "../../assets/translations/FormsTranslations.json";
import reuseableTranslations from "../../assets/translations/ReusableTranslations.json";
import BookBucksComponent from "../../components/HomeComponents/BookBucksComponent";
import Loader from "../../components/Loader";
import { modeActions } from "../../context/ModeContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFormRealData } from "../../hooks/useFormRealData";
import { useRealDatabase } from "../../hooks/useRealDatabase";
import useRealtimeDocuments from "../../hooks/useRealtimeDocuments";

function EditProfile() {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
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
  const [selected, setSelected] = useState(null);
  const editorRef = useRef();
  const [amountToPayout, setAmountToPayout] = useState(0);
  const [balance, setBalance] = useState(null);
  const storage = getStorage();
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
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
      setBalance(document.creditsAvailable.valueInMoney);
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
          nationality: {
            nationality: selected
              ? selected.toLowerCase()
              : document.nationality.nationality,
            nationalityFlag: selected
              ? `https://flagcdn.com/h40/${selected.toLowerCase()}.png`
              : document.nationality.nationalityFlag,
          },
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
      setIsPending(false);
    }
    setIsPending(false);
  };

  const payoutAmount = async (e) => {
    e.preventDefault();
    try {
      setIsPending(true);
      await fetch(
        `http://127.0.0.1:5001/bookfreak-8d935/us-central1/stripeFunctions/createPayout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Connection: "keep-alive",
            Accept: "*",
          },
          body: JSON.stringify({
            amount: amountToPayout,
            currentUserId: user.uid,
            userId: document.stripeAccountData.id,
            currency: document.stripeAccountData.default_currency,
            destinationAccount:
              document.stripeAccountData.external_accounts.data["0"].id,
          }),
        }
      );
      setAmountToPayout(0);
      setBalance((prev) => {
        return prev - amountToPayout;
      });
      setIsPending(false);
    } catch (err) {
      setImgError(err.message);
      setIsPending(false);
    }
  };

  const moveToProvideFinanceData = async (e) => {
    e.preventDefault();
    try {
      const accountLinkResponse = await fetch(
        "http://127.0.0.1:5001/bookfreak-8d935/us-central1/stripeFunctions/createAccountLink",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Connection: "keep-alive",
            Accept: "*",
          },
          body: JSON.stringify({ accountId: document.stripeAccountData.id }),
        }
      );

      const { accountLinkObject } = await accountLinkResponse.json();

      window.location.href = accountLinkObject.url;
      window.location.assign(accountLinkObject.url);
      window.location.replace(accountLinkObject.url);

      toast.success("New link created");
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };
  return (
    <motion.div
      className="min-h-screen h-full"
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
      {document && (
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col text-white  rounded-lg"
        >
          <div className="w-full flex flex-wrap items-center  p-4 gap-4">
            <IoSettings className="text-3xl hover:animate-spin" />
            <h2 className="text-xl text-center font-bold">User Settings</h2>
          </div>
          {/**Choose image start */}
          <div className="flex w-full items-center sm:justify-center lg:justify-start flex-wrap gap-8 pl-3">
            <img className="w-48 h-48 rounded-full" src={profileImg} alt="" />

            <label className="flex flex-col sm:w-full max-w-md">
              <span>
                {formsTranslation.userFields.chooseAvatar[selectedLanguage]}:{" "}
              </span>
              <input
                type="file"
                onChange={handleImg}
                className="file-input file-input-bordered bg-accColor w-full"
              />
            </label>
          </div>
          {/**Choose image end */}

          {/**Details start */}
          <div className="w-full p-6">
            <p className=" text-2xl font-semibold text-white">
              General information
            </p>
            <div className="flex flex-wrap w-full gap-4 py-2">
              <label className="flex flex-col sm:w-full md:max-w-lg">
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

              <label className="flex flex-col sm:w-full md:max-w-lg">
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
              <label className="flex flex-col sm:w-full md:max-w-lg">
                <span>Nationality:</span>
                <ReactFlagsSelect
                  searchPlaceholder="Search countries"
                  className="text-black sm:w-full md:max-w-lg"
                  selectButtonClassName="bg-accColor text-white rounded-md p-2 border-white text-white"
                  selected={
                    selected
                      ? selected
                      : document.nationality.nationality.toUpperCase()
                  }
                  onSelect={(code) => {
                    setSelected(code);
                    console.log(code);
                  }}
                />
                <small>
                  Note ! Changing the nationality won't change the currency and
                  country in your financial account.
                </small>
              </label>
            </div>
          </div>

          {/**Details end */}

          <div className="flex flex-col w-full gap-3 p-6">
            {document.stripeAccountData && (
              <p className="text-white font-semibold text-2xl">
                Available credits:{" "}
                <span className="font-bold text-green-500">
                  {" "}
                  {(balance / 100 - amountToPayout / 100).toFixed(2)}{" "}
                  {document.stripeAccountData.default_currency.toUpperCase()}
                </span>
              </p>
            )}
            <input
              type="number"
              step={0.5}
              min={0}
              max={balance / 100}
              className="p-4 rounded-lg max-w-lg"
              value={amountToPayout / 100}
              onChange={(e) => {
                setAmountToPayout(Math.round(+e.target.value * 100));
              }}
            />
            <button
              className="btn max-w-sm bg-accColor text-white"
              onClick={payoutAmount}
            >
              Payout
            </button>
          </div>

          <div className="flex flex-col w-full gap-3 p-6">
            <p className=" text-2xl font-semibold text-white">
              Financial Management
            </p>
            <Link
              to={document.linkToExpress}
              target="_blank"
              className="btn max-w-xs bg-accColor text-white"
            >
              Move to dashboard
            </Link>
          </div>

          <div className="p-6 flex gap-3 flex-col">
            <p className="text-2xl font-semibold text-white">Visibility mode</p>
            <label className="flex cursor-pointer gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${
                  isDarkModed ? " text-white" : " text-base-content"
                }`}
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
              <input
                type="checkbox"
                checked={isDarkModed}
                className="toggle theme-controller"
                onChange={() => {
                  dispatch(modeActions.toggleDarkMode());
                }}
              />
              <svg
                className={`${
                  isDarkModed ? " text-white" : " text-base-content"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </label>
          </div>

          {!document.stripeAccountData.details_submitted &&
            !document.stripeAccountData.charges_enabled && (
              <div className="flex flex-col gap-3 px-4">
                <p>Provide essential financial data</p>
                <button
                  className="btn btn-info max-w-sm text-white"
                  onClick={moveToProvideFinanceData}
                >
                  Finish
                </button>
              </div>
            )}

          <div className="flex flex-col gap-3 px-4">
            <p className="text-2xl font-semibold text-white">
              Replenish your account
            </p>
            <BookBucksComponent />
          </div>

          <label className="flex flex-col gap-2 pl-6 pr-2">
            <span>
              {formsTranslation.descriptionTextarea.label[selectedLanguage]}:
            </span>
            <textarea
              className="rounded-lg resize-none outline-none max-w-4xl h-52 p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>

          {!isPending && (
            <button className="btn self-center my-4 bg-accColor text-white sm:w-9/12 md:max-w-md">
              {formsTranslation.updateBtn[selectedLanguage]}
            </button>
          )}

          {isPending && (
            <button disabled className="btn bg-accColor self-center">
              Loading...
            </button>
          )}
        </form>
      )}
      {imgError && (
        <Snackbar
          onClose={(e) => {
            e.preventDefault();
            setImgError(null);
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={imgError}
          autoHideDuration={3000}
          message={imgError}
          action={
            <button
              className="flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                setImgError(null);
              }}
            >
              <FaX className=" text-red-500" /> Close
            </button>
          }
        />
      )}

      {isPending && <Loader />}
    </motion.div>
  );
}

export default EditProfile;
