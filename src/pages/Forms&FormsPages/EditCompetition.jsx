import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import CreatableSelect from "react-select";
import { toast } from "react-toastify";

import { Alert } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";

import alertMessages from "../../assets/translations/AlertMessages.json";
import formsTranslation from "../../assets/translations/FormsTranslations.json";
import Loader from "../../components/Loader";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFormRealData } from "../../hooks/useFormRealData";
import { useRealDatabase } from "../../hooks/useRealDatabase";

function EditCompetition() {
  const { id } = useParams();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const { updateDatabase } = useRealDatabase();
  const { user } = useAuthContext();
  const [title, setTitle] = useState("");
  const [competitionsName, setCompetitionsName] = useState("");
  const [error, setError] = useState("");
  const [expirationDate, setExpirationDate] = useState(null);
  const [attachedUsers, setAttachedUsers] = useState([]);
  const [description, setDescription] = useState("");

  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const { document } = useFormRealData("competitions", id);

  useEffect(() => {
    if (document) {
      setTitle(document.competitionTitle);
      setCompetitionsName(document.competitionsName);
      setDescription(document.description);
      setExpirationDate(document.expiresAt);
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

  const competitionTypes = [
    { value: "First read, first served", label: "First read, first served" },
    {
      value: "Lift others, rise",
      label: "Lift others, rise",
    },
    { value: "Teach to fish", label: "Teach to fish" },
  ];

  const editCompetition = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    setError(null);
    setIsPending(false);
    navigate(`/competition/${id}`);
    toast.success(
      alertMessages.notifications.successfull.update[selectedLanguage]
    );

    updateDatabase(
      {
        ...document,
        competitionTitle: title,
        competitionsName: competitionsName,
        description: description,
        expiresAt: expirationDate,
      },
      "competitions",
      id
    );

    attachedUsers.map(async (member) => {
      /**({
        notificationContent: `${user.displayName} has comitted some changes in ${title} competition`,
        directedTo: member.value.id,
        linkTo: `competition/${id}`,
        isRead: false,
        notificationTime: Timestamp.fromDate(new Date()),
        changeConcering: user.photoURL,
        sentTo: document.id,
      });**/
    });
  };

  return (
    <>
      <motion.div
        className="min-h-screen h-full flex justify-center items-center w-full flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <form
          onSubmit={editCompetition}
          className="flex sm:w-full justify-around md:w-3/4 xl:w-2/3 2xl:w-1/2 flex-col p-6 m-2 sm:bg-transparent md:bg-primeColor items-center text-white"
        >
          <h2 className="text-3xl text-center font-semibold">
            {formsTranslation.topText.editCompetition[selectedLanguage]}
          </h2>
          <p className="text-2xl text-center font-thin mb-2">
            {
              formsTranslation.topText.editCompetition.underText[
                selectedLanguage
              ]
            }
          </p>

          <div className="flex w-full justify-around flex-wrap gap-2 rounded-md text-white">
            <label className="flex flex-col sm:w-full lg:w-2/5">
              <span>
                {formsTranslation.bookTitleInput.label[selectedLanguage]}:
              </span>
              <input
                className="outline-none p-2 rounded-lg"
                type="text"
                required
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </label>

            <label className="flex flex-col sm:w-full lg:w-2/5">
              <span>
                {formsTranslation.competitionCategory.label[selectedLanguage]}:
              </span>
              <CreatableSelect
                required
                className="select-input text-black"
                isClearable
                isSearchable
                options={competitionTypes}
                onChange={(e) => setCompetitionsName(e.value)}
              />
              <small>
                {formsTranslation.competitionCategory.label[selectedLanguage]}:{" "}
                {competitionsName}
              </small>
            </label>
            <label className="flex flex-col gap-2 sm:w-full xl:w-2/5">
              <span>
                {formsTranslation.expirationDateInput.label[selectedLanguage]}:
              </span>

              <DateTimePicker
                label={`${formsTranslation.expirationDateInput.label[selectedLanguage]}`}
                className="myDatePicker w-full"
                sx={{
                  svg: { color: "#fff" },
                  input: { color: "#fff" },
                }}
                onChange={(newValue) => {
                  setExpirationDate(new Date(newValue.$d).getTime());
                }}
              />
            </label>

            <label className="flex flex-col sm:w-full lg:w-2/5">
              <span>
                {formsTranslation.membersInput.label[selectedLanguage]}:
              </span>
              <CreatableSelect
                isClearable
                isSearchable
                isMulti
                options={[]}
                value={attachedUsers}
                onChange={(e) => {
                  setAttachedUsers(e);
                }}
              />
            </label>

            <label className="flex flex-col w-full">
              <span>
                {formsTranslation.descriptionTextarea.label[selectedLanguage]}:
              </span>
              <textarea
                className="resize-none outline-none rounded-lg p-1"
                required
                placeholder="What's this competition about, what's to win?"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              ></textarea>
            </label>
          </div>

          {error && (
            <Alert className="bg-transparent" severity="error">
              {error}
            </Alert>
          )}

          <button className="btn w-36 mt-2 bg-accColor text-white">
            {formsTranslation.updateBtn[selectedLanguage]}
          </button>
        </form>
      </motion.div>
      {isPending && <Loader />}
    </>
  );
}

export default EditCompetition;
