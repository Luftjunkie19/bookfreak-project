import React, { useEffect, useState } from "react";

import countryToCurrency from "country-to-currency";
import { Alert } from "flowbite-react";
import CurrencyInput from "react-currency-input-field";
import ReactFlagsSelect from "react-flags-select";
import { FaX } from "react-icons/fa6";
import { GiSwordsPower } from "react-icons/gi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CreatableSelect from "react-select/creatable";
import uniqid from "uniqid";

import { Snackbar } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { loadStripe } from "@stripe/stripe-js";

import {
  competitionTypes,
  differentPrize,
  prizeTypes,
} from "../../assets/CreateVariables";
import translations from "../../assets/translations/FormsTranslations.json";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useRealDatabase } from "../../hooks/useRealDatabase";
import useRealtimeDocuments from "../../hooks/useRealtimeDocuments";

function CreateCompetition() {
  const { user } = useAuthContext();
  const { addToDataBase } = useRealDatabase();
  const { getDocuments } = useRealtimeDocuments();
  const [documents, setDocuments] = useState([]);
  const [attachedUsers, setAttachedUsers] = useState([]);
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [currency, setCurrency] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [openState, setOpenState] = useState({
    open: false,
    message: "",
  });
  const [stripePromise, setStripePromise] = useState(() =>
    loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)
  );

  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadUsers = async () => {
    const usersElements = await getDocuments("users");

    if (usersElements) {
      setDocuments(usersElements);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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

  const [competition, setCompetition] = useState({
    competitionTitle: "",
    competitionsName: "",
    expiresAt: null,
    description: "",
    prizeType: null,
    prize: {
      moneyPrize: { amount: null, currency: null },
      itemPrize: { title: null, typeOfPrize: null },
    },
  });

  const finalizeAll = () => {
    const uniqueId = uniqid();
    addToDataBase("competitions", uniqueId, {
      competitionTitle: competition.competitionTitle,
      competitionsName: competition.competitionsName,
      expiresAt: new Date(competition.expiresAt).getTime(),
      description: competition.description,
      prize: competition.prize,
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
      addToDataBase("notifications", `${uniqueId}-${new Date().getTime()}`, {
        notificationContent: `You've been invited by ${user.displayName} to join the ${competition.competitionsName} competition.`,
        directedTo: member.value.id,
        linkTo: `/competition/${uniqueId}`,
        isRead: false,
        notificationId: uniqueId,
        notificationTime: new Date().getTime(),
        addedTo: competition.competitionsName,
      })
    );

    setIsPending(false);
    setError(null);
    navigate("/");
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      if (!competition.expiresAt) {
        setOpenState((state) => {
          state.message = "You cannot set the earlier date than today.";
          state.open = true;
          return state;
        });
        return;
      }

      finalizeAll();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen h-full w-full flex flex-col justify-center items-center">
      <form
        onSubmit={submitForm}
        className="lg:bg-accColor sm:w-full lg:w-2/3 xl:w-3/5 2xl:w-1/2 text-white p-6 rounded-lg"
      >
        <div className="flex flex-col justify-center items-center gap-2 py-4 mb-2">
          <GiSwordsPower className="text-6xl font-semibold" />
          <p className="text-center">
            {translations.topText.competitions[selectedLanguage]}
          </p>
        </div>

        <div className="flex mb-4 w-full justify-around items-center sm:flex-col lg:flex-row gap-2">
          <label className="flex flex-col sm:w-full xl:w-2/5">
            <span>{translations.bookTitleInput.label[selectedLanguage]}:</span>
            <input
              type="text"
              required
              className="input border-accColor rounded-md border-2 outline-none w-full py-4 px-1"
              placeholder={`${translations.bookTitleInput.placeholder[selectedLanguage]}`}
              onChange={(e) =>
                setCompetition((competition) => {
                  competition.competitionTitle = e.target.value;
                  return competition;
                })
              }
            />
          </label>

          <label className="flex flex-col gap-2 sm:w-full xl:w-2/5">
            <span>
              {translations.expirationDateInput.label[selectedLanguage]}:
            </span>

            <DateTimePicker
              required
              label={`${translations.expirationDateInput.label[selectedLanguage]}`}
              className="myDatePicker w-full"
              sx={{
                svg: { color: "#fff" },
                input: { color: "#fff" },
              }}
              onChange={(newValue) => {
                console.log(new Date(newValue.$d));
                if (new Date(newValue.$d).getTime() < new Date().getTime()) {
                  setOpenState((state) => {
                    state.message =
                      "You cannot set the earlier date than today.";
                    state.open = true;
                    return state;
                  });
                  return;
                } else {
                  setCompetition((competition) => {
                    competition.expiresAt = new Date(newValue.$d);
                    return competition;
                  });
                }
              }}
            />
          </label>
        </div>
        <div className="flex w-full justify-around items-center sm:flex-col lg:flex-row gap-2">
          <label className="flex flex-col sm:w-full xl:w-2/5">
            <span>{translations.membersInput.label[selectedLanguage]}:</span>
            <CreatableSelect
              className="text-black w-full"
              isMulti
              isClearable
              isSearchable
              options={notCurrentUsers}
              onChange={(e) => {
                setAttachedUsers(e);
              }}
            />
          </label>

          <label className="sm:w-full xl:w-2/5">
            <span>
              {translations.competitionCategory.label[selectedLanguage]}:
            </span>
            <CreatableSelect
              required
              className="text-black w-full"
              options={competitionTypes}
              onChange={(e) => {
                setCompetition((competition) => {
                  competition.competitionsName = e.value;
                  return competition;
                });
              }}
            />
          </label>
        </div>
        <div className="flex flex-wrap w-full justify-around items-center sm:flex-col lg:flex-row gap-2">
          <label className="sm:w-full xl:w-2/5">
            <span>Competition's prize</span>
            <CreatableSelect
              required
              className="text-black w-full"
              onChange={(value) => {
                setCompetition((comp) => {
                  comp.prizeType = value.value;
                  return comp;
                });
              }}
              options={prizeTypes}
            />
          </label>

          {competition.prizeType === "Money" && (
            <>
              <label className="sm:w-full xl:w-2/5 ">
                <span>Competition's prize</span>
                <ReactFlagsSelect
                  required
                  selected={selectedCountry}
                  className="text-black w-full"
                  onSelect={(code) => {
                    setSelectedCountry(code);
                    setCurrency(countryToCurrency[code]);
                    setCompetition((comp) => {
                      comp.prize.moneyPrize.currency = countryToCurrency[code];
                      return comp;
                    });
                  }}
                  options={prizeTypes}
                />
              </label>

              <label className=" flex flex-col">
                <span>Prize amount:</span>
                <CurrencyInput
                  suffix={currency}
                  className="input"
                  onValueChange={(value) => {
                    setCompetition((comp) => {
                      comp.prize.moneyPrize.amount = +value;
                      return comp;
                    });
                    console.log(competition);
                  }}
                />
              </label>
            </>
          )}

          {competition.prizeType === "item" && (
            <>
              <label className="sm:w-full xl:w-2/5 ">
                <span>Competition's prize </span>
                <CreatableSelect
                  required
                  className="text-black w-full"
                  onChange={(value) => {
                    setCompetition((comp) => {
                      comp.prize.itemPrize.typeOfPrize = value.value;
                      return comp;
                    });
                  }}
                  options={differentPrize}
                />
              </label>

              <label className="flex flex-col max-w-sm">
                <span>Prize Details:</span>
                <input
                  className="input border-accColor rounded-md border-2 outline-none w-full py-4 px-1"
                  required
                  type="text"
                  onChange={(e) => {
                    setCompetition((comp) => {
                      comp.prize.itemPrize.title = e.target.value;
                      return comp;
                    });
                  }}
                />
              </label>
            </>
          )}
        </div>

        <label className="flex flex-col">
          <span>
            {translations.descriptionTextarea.label[selectedLanguage]}:
          </span>
          <textarea
            required
            className="outline-none border-accColor border-2 h-48 resize-none py-1 rounded-lg"
            placeholder={`${translations.descriptionTextarea.placeholder[selectedLanguage]}`}
            onChange={(e) =>
              setCompetition((competition) => {
                competition.description = e.target.value;
                return competition;
              })
            }
          ></textarea>
        </label>

        <div className="flex justify-center items-center my-2 p-2 w-full ">
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

      {openState.open === true && (
        <>
          <Snackbar
            onClose={() => {
              setOpenState({ message: "", open: false });
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={openState.open}
            autoHideDuration={3000}
            severity="success"
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
    </div>
  );
}

export default CreateCompetition;
