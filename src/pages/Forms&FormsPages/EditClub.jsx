import { useEffect, useState } from "react";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { motion } from "framer-motion";
import { FaUsers } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import CreatableSelect from "react-select";
import { toast } from "react-toastify";

import { Alert } from "@mui/material";

import alertMessages from "../../assets/translations/AlertMessages.json";
import formsTranslation from "../../assets/translations/FormsTranslations.json";
import Loader from "../../components/Loader";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFormRealData } from "../../hooks/useFormRealData";
import { useRealDatabase } from "../../hooks/useRealDatabase";

function EditClub() {
  const { id } = useParams();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const { updateDatabase } = useRealDatabase();
  const { document } = useFormRealData("readersClubs", id);
  const { user } = useAuthContext();
  const [clubsName, setClubsName] = useState("");
  const [error, setError] = useState("");
  const [attachedUsers, setAttachedUsers] = useState([]);
  const [description, setDescription] = useState("");
  const [clubLogo, setClubLogo] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [requiredPagesRead, setRequiredPagesRead] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (document) {
      setClubsName(document.clubsName);
      setClubLogo(document.clubLogo);
      setDescription(document.description);
      setRequiredPagesRead(document.requiredPagesRead);
    }
  }, [document]);

  const notCurrentUsers = [].filter((doc) => {
    return doc.id !== user.uid;
  });

  let usersAvailable = notCurrentUsers.map((user) => {
    return {
      label: user.nickname,
      value: {
        nickname: user.nickname,
        id: user.id,
        photoURL: user.photoURL,
      },
    };
  });

  const handleSelect = (e) => {
    setError(null);
    setClubLogo(null);
    let selected = e.target.files[0];

    if (selected.size > 200000) {
      setError(alertMessages.notficactions.wrong.tooBigFile[selectedLanguage]);
      return;
    }

    if (!selected.type.includes("image")) {
      setError(
        alertMessages.notficactions.wrong.inAppropriateFile[selectedLanguage]
      );
      return;
    }

    if (!selected) {
      setError(
        alertMessages.notficactions.wrong.selectAnything[selectedLanguage]
      );
      return;
    }

    setError(null);
    setClubLogo(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      if (clubLogo.name) {
        const uploadPath = `clubLogo/uid${user.uid}/${clubLogo.name}`;

        const storage = getStorage();

        const image = ref(storage, uploadPath);

        const snapshot = await uploadBytes(image, clubLogo);
        const photoURL = await getDownloadURL(image);

        updateDatabase(
          {
            ...document,
            clubsName: clubsName,
            clubLogo: photoURL,
            description: description,
            requiredPagesRead: requiredPagesRead,
          },
          "readersClubs",
          id
        );

        attachedUsers.map(async (member) => {
          /**({
            notificationContent: `${user.displayName} has comitted some changes in ${clubsName} club`,
            directedTo: member.value.id,
            linkTo: `readers-clubs/${id}`,
            isRead: false,
            notificationTime: Timestamp.fromDate(new Date()),
            changeConcering: user.photoURL,
            sentTo: document.id,
          });**/
        });

        navigate(`/readers-clubs/${id}`);
        toast.success(
          alertMessages.notifications.successfull.update[selectedLanguage]
        );
      } else {
        updateDatabase(
          {
            ...document,
            clubsName: clubsName,
            clubLogo: clubLogo,
            description: description,
            requiredPagesRead: requiredPagesRead,
          },
          "readersClubs",
          id
        );
        attachedUsers.map(async (member) => {
          /**({
            notificationContent: `${user.displayName} has comitted some changes in ${clubsName} club`,
            directedTo: member.value.id,
            linkTo: `readers-clubs/${id}`,
            isRead: false,
            notificationTime: Timestamp.fromDate(new Date()),
            changeConcering: user.photoURL,
          });**/
        });

        setError(null);
        setIsPending(false);
        navigate(`/readers-clubs/${id}`);
        toast.success(
          alertMessages.notifications.successfull.update[selectedLanguage]
        );
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen h-full flex flex-col justify-center items-center">
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onSubmit={handleSubmit}
        className="flex sm:w-full md:w-4/5 xl:w-3/5 2xl:w-1/2 flex-col gap-2 justify-around items-center sm:bg-transparent md:bg-primeColor text-white p-4 rounded-md"
      >
        <FaUsers className="text-3xl" />
        <h2 className="text-2xl text-center font-extrabold">
          {formsTranslation.topText.editClub[selectedLanguage]}
        </h2>
        <p className="font-thin text-center text-lg">
          {formsTranslation.topText.editCompetition.underText[selectedLanguage]}
        </p>

        <div className="flex w-full justify-around items-center flex-wrap gap-3">
          <label className="flex flex-col sm:w-full lg:w-2/5">
            <span>
              {formsTranslation.clubsNameInput.label[selectedLanguage]}:
            </span>
            <input
              className="outline-none p-2 rounded-md"
              type="text"
              required
              value={clubsName}
              onChange={(e) => setClubsName(e.target.value)}
            />
          </label>

          <label className="flex flex-col sm:w-full lg:w-2/5">
            <span>
              {formsTranslation.membersInput.label[selectedLanguage]}:
            </span>
            <CreatableSelect
              className="select-input"
              isClearable
              isSearchable
              isMulti
              options={usersAvailable}
              value={attachedUsers}
              onChange={(e) => {
                setAttachedUsers(e);
              }}
            />
          </label>

          <label className="flex flex-col sm:w-full lg:w-2/5">
            <span>
              {formsTranslation.selectImgBtn.label[selectedLanguage]}:{" "}
            </span>
            <input
              className="file-input file-input-bordered w-full"
              type="file"
              onChange={handleSelect}
            />
          </label>

          <label className="flex flex-col sm:w-full lg:w-1/2 2xl:w-2/5">
            <span className="label-text">
              {formsTranslation.requiredPagesToJoin.label[selectedLanguage]}
            </span>
            <input
              className="input border-none outline-none w-full"
              placeholder={`${formsTranslation.requiredPagesToJoin.placeholder[selectedLanguage]}`}
              type="number"
              min={0}
              value={requiredPagesRead}
              step={10}
              onChange={(e) => {
                setRequiredPagesRead(+e.target.value);
              }}
            />
          </label>

          <label className="flex flex-col w-full">
            <span>
              {formsTranslation.descriptionTextarea.label[selectedLanguage]}:
            </span>
            <textarea
              className="outline-none p-2 rounded-md resize-none"
              required
              placeholder="Tell the users, what are you in this club doing."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>
        </div>

        {error && (
          <Alert className="bg-transparent" severity="error">
            {error}
          </Alert>
        )}

        <button className="btn bg-accColor text-white mt-2">
          {formsTranslation.updateBtn[selectedLanguage]}
        </button>
      </motion.form>
      {isPending && <Loader />}
    </div>
  );
}

export default EditClub;
