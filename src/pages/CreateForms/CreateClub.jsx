import '../../components/stylings/mui-stylings.css';

import React, {
  useRef,
  useState,
} from 'react';

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import AvatarEditor from 'react-avatar-editor';
import { BsStars } from 'react-icons/bs';
import { CgDetailsMore } from 'react-icons/cg';
import {
  FaImage,
  FaWindowClose,
} from 'react-icons/fa';
import { RiTeamFill } from 'react-icons/ri';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router';
import uniqid from 'uniqid';

import {
  Alert,
  Autocomplete,
  Box,
  TextField,
} from '@mui/material';

import { storage } from '../../';
import alertMessages from '../../assets/translations/AlertMessages.json';
import translations from '../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../assets/translations/ReusableTranslations.json';
import { snackbarActions } from '../../context/SnackBarContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';

function CreateClub() {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const dispatch=useDispatch();
  const [attachedUsers, setAttachedUsers] = useState([]);
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
  const {documents}=useGetDocuments("users");
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const {documents: members}=useGetDocuments('communityMembers');
  const allMembers= members.map((club) => {
    return club.users;
  }).map((object) => {
    return Object.values(object);
  }).flat();
 


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
     dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.loyality[selectedLanguage]}`}));

      return;
    }


    if(!readersClub.clubLogo || readersClub.description.trim().length === 0 || readersClub.clubsName.trim().length === 0 || readersClub.requiredPagesRead === 0){
      dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.someFieldsEmpty[selectedLanguage]}`}));

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
    dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.create[selectedLanguage]}`}));
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
      storage,
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
    <div className={`min-h-screen h-full w-full flex flex-col ${!isDarkModed && "pattern-bg"}`}>
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

      <form onSubmit={submitForm} className={`w-full  ${isDarkModed ? "text-white" : "text-black"}`}>
        <div className="flex flex-wrap items-center justify-center gap-4 p-4">
          <RiTeamFill className="text-6xl" />
          <p className="font-bold">
            {translations.topText.clubs.underText[selectedLanguage]}
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 p-4">
          <p className={`font-bold text-2xl flex gap-2  ${isDarkModed ? "text-white" : "text-black"}`}>
            {" "}
            <BsStars /> Essential information <BsStars />{" "}
          </p>
          <div className="flex flex-wrap w-full gap-4 items-center">
            <label className="flex flex-col sm:w-full md:max-w-md">
              <span className={` ${isDarkModed ? "text-white" : "text-black"}`}>
                {translations.clubsNameInput.label[selectedLanguage]}:
              </span>
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
            <label className="flex flex-col sm:w-full md:max-w-lg">
              <Autocomplete
                multiple
                autoHighlight
                id="tags-outlined"
                options={notCurrentUsers}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => {
                  return (
                    <Box
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                      component="li"
                      key={option.value.id}
                      {...props}
                      className="bg-accColor text-white flex gap-4 items-center p-1"
                    >
                      <img
                        className="w-10 h-10 rounded-full"
                        loading="lazy"
                        src={option.value.photoURL}
                        srcSet={`${option.value.photoURL} 2x`}
                        alt={option.value.id}
                      />
                      <p>{option.value.nickname}</p>
                    </Box>
                  );
                }}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option.value.id === value.value.id
                }
                onChange={(e, value) => {
                  setAttachedUsers(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                    label={translations.membersInput.label[selectedLanguage]}
                    placeholder={
                      translations.membersInput.label[selectedLanguage]
                    }
                  />
                )}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap p-4 gap-4 items-center">
          <p className="font-bold text-2xl flex gap-2">
            <CgDetailsMore /> Detailed information <CgDetailsMore />
          </p>
          <div className="flex flex-wrap w-full gap-4 items-center">
            <label className="flex flex-col sm:w-full md:max-w-sm">
              <span>
                {translations.clubsLogoInput.label[selectedLanguage]}:
              </span>
              <div className="flex items-center justify-center w-full">
                <input
                  type="file"
                  required
                  onChange={handleSelect}
                  className="hidden"
                />
                <p className="btn w-full bg-accColor text-white border-none hover:bg-blue-400">
                  {translations.selectImgBtn.text[selectedLanguage]} <FaImage />
                </p>
              </div>
            </label>

            <label className="flex flex-col ssm:w-full md:max-w-xl">
              <span className={`label-text ${isDarkModed ? "text-white" : "text-black"} py-1`}>
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
        </div>

        <label className="flex flex-col p-4">
          <span>
            {translations.descriptionTextarea.label[selectedLanguage]}:
          </span>
          <textarea
            required
            className="outline-none h-48 max-w-5xl border-accColor border-2 resize-none py-1 rounded-lg"
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
          <button className="btn sm:w-full md:max-w-xl text-white bg-accColor hover:bg-blue-400">
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

export default CreateClub;
