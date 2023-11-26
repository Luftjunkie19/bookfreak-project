import React, { useEffect, useRef, useState } from "react";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import AvatarEditor from "react-avatar-editor";
import { FaImage, FaWindowClose } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { RiTeamFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CreatableSelect from "react-select/creatable";
import uniqid from "uniqid";

import { Alert, Snackbar } from "@mui/material";

import alertMessages from "../../assets/translations/AlertMessages.json";
import translations from "../../assets/translations/FormsTranslations.json";
import reuseableTranslations from "../../assets/translations/ReusableTranslations.json";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useRealDatabase } from "../../hooks/useRealDatabase";
import useRealtimeDocuments from "../../hooks/useRealtimeDocuments";

function CreateClub() {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState({ open: false, message: null });
  const { getDocuments } = useRealtimeDocuments();
  const [attachedUsers, setAttachedUsers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [editCover, setEditCover] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [radius, setRadius] = useState(0);
  const editorRef = useRef();
  const [readersClub, setReadersClub] = useState({
    clubsName: "",
    clubLogo: null,
    description: "",
    requiredPagesRead: 0,
  });
  const navigate = useNavigate();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const { user } = useAuthContext();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadUsers = async () => {
    const usersElements = await getDocuments("users");

    if (usersElements) {
      setDocuments(usersElements);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadAllMembers = async () => {
    const ClubswithMembers = await getDocuments("communityMembers");
    if (ClubswithMembers) {
      const membersOfClubsEls = ClubswithMembers.map((club) => {
        return club.users;
      });

      const allMembersEls = membersOfClubsEls.map((object) => {
        return Object.values(object);
      });

      const finalConversion = allMembersEls.flat();
      setAllMembers(finalConversion);
    }
  };

  useEffect(() => {
    loadUsers();
    loadAllMembers();
  }, [loadAllMembers, loadUsers]);

  let notCurrentUsers = documents
    .filter((doc) => {
      return (
        doc.id !== user.uid &&
        !attachedUsers.some((member) => member.value.id === doc.id)
      );
    })
    .map((user) => {
      return {
        label: user.nickname,
        value: {
          nickname: user.nickname,
          id: user.id,
          photoURL: user.photoURL,
        },
      };
    });

  const { addToDataBase } = useRealDatabase();
  const submitForm = (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    if (
      allMembers.find(
        (member) =>
          member.value.id === user.uid &&
          member.belongsTo.includes("readersClub")
      )
    ) {
      setMessage({
        open: true,
        message: alertMessages.notifications.wrong.loyality[selectedLanguage],
      });

      return;
    }

    const uniqueId = uniqid("readersClub");

    addToDataBase("readersClubs", uniqueId, {
      clubsName: readersClub.clubsName,
      clubLogo: readersClub.clubLogo,
      description: readersClub.description,
      requiredPagesRead: readersClub.requiredPagesRead,
      createdBy: {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date().getTime(),
        id: user.uid,
      },
      id: uniqueId,
    });

    addToDataBase("communityChats", uniqueId, {
      messages: {},
      chatId: uniqueId,
    });

    addToDataBase("communityMembers", uniqueId, {
      users: {
        [user.uid]: {
          label: user.displayName,
          belongsTo: uniqueId,
          value: {
            nickname: user.displayName,
            id: user.uid,
            photoURL: user.photoURL,
          },
        },
      },
    });

    attachedUsers.map((member) =>
      addToDataBase("notifications", member.value.id, {
        notificationContent: `You've been invited by ${user.displayName} to ${readersClub.clubsName} club.`,
        directedTo: member.value.id,
        linkTo: `/readers-club/${uniqueId}`,
        notificationId: uniqueId,
        isRead: false,
        notificationTime: new Date().getTime(),
        addedTo: readersClub.clubsName,
      })
    );
    setIsPending(false);
    setError(null);
    navigate("/");
  };

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

    if (selected?.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setEditCover(fileReader.result);
      };
      setError(null);
      return;
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
      `readersClub-logos/${user.uid}/${
        readersClub.clubsName ? readersClub.clubsName : `readersClub${uniqid()}`
      }.jpg`
    );
    await uploadBytes(storageRef, byteArray);
    const url = await getDownloadURL(storageRef);
    console.log(url);

    setReadersClub((club) => {
      club.clubLogo = url;
      return club;
    });

    setEditCover(null);
  };

  return (
    <div className="min-h-screen h-full w-full flex flex-col justify-center items-center">
      {editCover && (
        <div className="h-screen bg-imgCover w-screen fixed top-0 left-0 z-[9999]">
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
      )}

      <form
        onSubmit={submitForm}
        className="lg:bg-accColor sm:w-full lg:w-2/3 xl:w-3/5 2xl:w-1/2 text-white p-6 rounded-lg"
      >
        <div className="flex flex-col justify-center items-center p-4">
          <RiTeamFill className="text-4xl" />
          <h2 className="text-2xl text-center py-2">
            {translations.topText.clubs[selectedLanguage]}
          </h2>
          <p className="text-center">
            {translations.topText.clubs.underText[selectedLanguage]}
          </p>
        </div>

        <div className="flex w-full flex-wrap justify-around items-center gap-2">
          <label className="flex flex-col sm:w-full lg:w-2/5">
            <span>{translations.clubsNameInput.label[selectedLanguage]}:</span>
            <input
              required
              type="text"
              className="input border-accColor rounded-md border-2 outline-none w-full py-4 px-1"
              placeholder={`${translations.clubsNameInput.placeholder[selectedLanguage]}`}
              onChange={(e) =>
                setReadersClub((club) => {
                  club.clubsName = e.target.value;
                  return club;
                })
              }
            />
          </label>
          <label className="flex flex-col sm:w-full lg:w-2/5">
            <span> {translations.membersInput.label[selectedLanguage]}:</span>
            <CreatableSelect
              className="text-black w-full"
              options={notCurrentUsers}
              isMulti
              isClearable
              isSearchable
              onChange={(e) => {
                setAttachedUsers(e);
              }}
            />
          </label>
          <label className="flex flex-col items-center sm:w-full lg:w-1/2 2xl:w-2/5">
            <span>{translations.clubsLogoInput.label[selectedLanguage]}:</span>
            <div className="flex items-center justify-center w-full p-2">
              <input
                type="file"
                required
                onChange={handleSelect}
                className="hidden"
              />
              <p className="btn sm:w-full sm:bg-accColor lg:bg-primeColor text-white border-none hover:bg-lime-700">
                {translations.selectImgBtn.text[selectedLanguage]} <FaImage />
              </p>
            </div>
          </label>

          <label className="flex flex-col sm:w-full lg:w-1/2 2xl:w-2/5">
            <span className="label-text">
              {translations.requiredPagesToJoin.label[selectedLanguage]}
            </span>
            <input
              className="input border-accColor rounded-md border-2 outline-none w-full"
              placeholder={`${translations.requiredPagesToJoin.placeholder[selectedLanguage]}`}
              type="number"
              min={0}
              step={10}
              onChange={(e) => {
                setReadersClub((club) => {
                  club.requiredPagesRead = +e.target.value;
                  return club;
                });
              }}
            />
          </label>
        </div>
        <label className="flex flex-col">
          <span>
            {translations.descriptionTextarea.label[selectedLanguage]}:
          </span>
          <textarea
            required
            className="outline-none h-48 border-accColor border-2 resize-none py-1 rounded-lg"
            placeholder={`${translations.descriptionTextarea.placeholder[selectedLanguage]}`}
            onChange={(e) =>
              setReadersClub((club) => {
                club.description = e.target.value;
                return club;
              })
            }
          ></textarea>
        </label>

        <div className="flex w-full justify-center items-center p-2 my-2">
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
      {message.open && (
        <Snackbar
          onClose={() => {
            setMessage({ message: "", open: false });
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={message.open}
          autoHideDuration={3000}
          severity="success"
          message={message.message}
          action={
            <button
              className="flex items-center gap-2"
              onClick={() => {
                setMessage({ message: "", open: false });
              }}
            >
              <FaX className=" text-red-500" /> Close
            </button>
          }
        />
      )}
    </div>
  );
}

export default CreateClub;
