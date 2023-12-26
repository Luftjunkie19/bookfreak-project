import "../../components/stylings/mui-stylings.css";

import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { FaX } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import CreatableSelect from "react-select";
import { toast } from "react-toastify";

import { Alert, Snackbar } from "@mui/material";
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
  const [description, setDescription] = useState("");
  const [openState, setOpenState] = useState({
    open: false,
    message: "",
  });
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

    if (!expirationDate || expirationDate - new Date().getTime() <= 0) {
      setOpenState({
        open: true,
        message: "Cannot be set earlier date than today",
      });
      return;
    }

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

    setError(null);
    setIsPending(false);
    navigate(`/competition/${id}`);
    toast.success(
      alertMessages.notifications.successfull.update[selectedLanguage]
    );
  };

  return (
    <>
      <motion.div
        className="min-h-screen h-full flex w-full flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <form
          onSubmit={editCompetition}
          className="flex sm:w-full  flex-col p-6 m-2  text-white"
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
          <div className="flex w-full flex-col">
            <p className=" font-bold text-3xl ">Overall about competition</p>
            <div className="flex w-full flex-wrap gap-5 py-2 items-center">
              <label className="flex flex-col sm:w-full md:max-w-xs xl:max-w-md">
                <span>
                  {formsTranslation.bookTitleInput.label[selectedLanguage]}:
                </span>
                <input
                  className="outline-none input bg-[rgba(0, 87, 158, 0.72)] border-accColor w-full p-2 rounded-lg"
                  type="text"
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </label>

              <label className="flex flex-col sm:w-full md:max-w-xs xl:max-w-md">
                <span>
                  {formsTranslation.competitionCategory.label[selectedLanguage]}
                  :
                </span>
                <CreatableSelect
                  required
                  className="select-input text-black w-full"
                  isClearable
                  isSearchable
                  options={competitionTypes}
                  onChange={(e) => setCompetitionsName(e.value)}
                />
                <small>
                  {formsTranslation.competitionCategory.label[selectedLanguage]}
                  : {competitionsName}
                </small>
              </label>
            </div>
            <div className="flex w-full flex-col gap-1 py-2">
              <p className=" font-bold text-3xl ">Details about Competition</p>
              <div className="flex w-full flex-wrap gap-5 items-center">
                <label className="flex flex-col gap-2 sm:w-full md:max-w-xs xl:max-w-md">
                  <span>
                    {
                      formsTranslation.expirationDateInput.label[
                        selectedLanguage
                      ]
                    }
                    :
                  </span>

                  <DateTimePicker
                    label={`${formsTranslation.expirationDateInput.label[selectedLanguage]}`}
                    className="myDatePicker w-full"
                    sx={{
                      svg: { color: "#fff" },
                      input: { color: "#fff" },
                    }}
                    onChange={(newValue) => {
                      if (
                        new Date(newValue.$d).getTime() < new Date().getTime()
                      ) {
                        setOpenState({
                          open: true,
                          message: "Cannot be set earlier date than today",
                        });
                        return;
                      } else {
                        setExpirationDate(new Date(newValue.$d).getTime());
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <label className="flex py-2 flex-col sm:w-full lg:max-w-xl xl:max-w-4xl 2xl:max-w-5xl">
              <span className="font-medium text-white text-lg">
                {formsTranslation.descriptionTextarea.label[selectedLanguage]}:
              </span>
              <textarea
                className="resize-none w-full h-48 outline-none rounded-lg p-1"
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

          <div className="flex w-full justify-center items-center">
            <button className="btn sm:max-w-xs md:w-80 mt-2 bg-accColor text-white">
              {formsTranslation.updateBtn[selectedLanguage]}
            </button>
          </div>
        </form>
      </motion.div>
      {isPending && <Loader />}
      {openState.open === true && (
        <>
          <Snackbar
            onClose={() => {
              setOpenState({ message: "", open: false });
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={openState.open}
            autoHideDuration={3000}
            message={openState.message}
            action={
              <button
                className="flex items-center gap-2"
                onClick={() => {
                  setOpenState({ message: "", open: false });
                }}
              >
                <FaX className=" text-red-500" /> Close
              </button>
            }
          />
        </>
      )}
    </>
  );
}

export default EditCompetition;
