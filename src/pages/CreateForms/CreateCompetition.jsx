import { useState } from 'react';

import { httpsCallable } from 'firebase/functions';
import { BsStars } from 'react-icons/bs';
import { CgDetailsMore } from 'react-icons/cg';
import { GiSwordsPower } from 'react-icons/gi';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router';
import CreatableSelect from 'react-select';
import uniqid from 'uniqid';

import {
  Alert,
  Autocomplete,
  Box,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';

import { functions } from '../../';
import alertMessages from '../../assets/translations/AlertMessages.json';
import translations from '../../assets/translations/FormsTranslations.json';
import FailLoader from '../../components/FailLoader';
import Loader from '../../components/Loader';
import { snackbarActions } from '../../context/SnackBarContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';

function CreateCompetition() {
  const { user } = useAuthContext();
  const { addToDataBase, updateDatabase } = useRealDatabase();
  const [attachedUsers, setAttachedUsers] = useState([]);
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const dispatch=useDispatch();
  const payCompetitionCharge= httpsCallable(functions, 'payCompetitionCharge');
   const competitionTypes = [
    { value: "First read, first served", label: translations.competitionTypes.first[selectedLanguage] },
    {
      value: "Lift others, rise",
      label: translations.competitionTypes.second[selectedLanguage],
    },
    { value: "Teach to fish", label: translations.competitionTypes.third[selectedLanguage] },
  ];
  
   const prizeTypes = [
    { value: "item", label: translations.item[selectedLanguage] },
    {
      value: "Money",
      label: translations.money[selectedLanguage],
    },
  ];
  
   const differentPrize = [
    { value: "book", label:translations.book[selectedLanguage] },
    {
      value: "Voucher",
      label: "Voucher",
    },
    { value: "ticket", label: translations.ticket[selectedLanguage] },
  ];

  const navigate = useNavigate();
  const { documents }=useGetDocuments('users');
  const {document}=useGetDocument("users", user.uid);


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
    chargeId: null,
    prizeHandedIn: false,
    prize: {
      moneyPrize: {
        amount: 0,
        currency: null,
      },
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
      prizeHandedIn: false,
      chargeId: competition.chargeId,
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
        dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.earlyDate[selectedLanguage]}`,alertType:"error", }));
        setIsPending(false);
        return;
      }

      if (
        competition.prizeType === "Money" &&
        competition.prize.moneyPrize.amount === 0
      ) {
        dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.zeroAmount[selectedLanguage]}`, alertType:"error"}));
        
        
        setIsPending(false);
        return;
      }

      if (competition.prize.moneyPrize.amount > document.creditsAvailable) {
        dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.notEnoughCredits[selectedLanguage]}`, alertType:"error"}));
        
     
        setIsPending(false);
        return;
      }

      if (
        competition.prize.itemPrize === undefined ||
        competition.prize.itemPrize === null ||
        competition.prize.moneyPrize === null ||
        competition.prize.moneyPrize === undefined
      ) {
        
          //state.message = "Something went wrong.";
       
        setIsPending(false);
        return;
      }

      if (competition.prizeType === "Money" && competition.prize.moneyPrize) {
        const payoutObject = await payCompetitionCharge({
          organizatorObject: document,
          payerId: document.stripeAccountData.id,
          amount: competition.prize.moneyPrize.amount,
          currency:
            document.stripeAccountData.default_currency.toUpperCase(),
        });
        
        const { error, chargeObject } = payoutObject.data;

        console.log(chargeObject);

        if (error) {
          setError(error);
          setIsPending(false);
          return;
        }

        if (chargeObject) {
          setCompetition((comp) => {
            comp.chargeId = chargeObject.id;
            comp.prize.moneyPrize.currency =
              document.stripeAccountData.default_currency;
          });
          updateDatabase(
            {
              valueInMoney:
                document.creditsAvailable.valueInMoney -
                competition.prize.moneyPrize.amount,
            },
            "users",
            `${user.uid}/creditsAvailable`
          );
        }
      }
      finalizeAll();
      dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.create[selectedLanguage]}`, alertType:"success"}));
      setIsPending(false);
    } catch (err) {
      console.log(err);
      setIsPending(false);
    }
  };


  return (
    <div className={`min-h-screen h-full w-full flex flex-col  ${!isDarkModed && "pattern-bg"}`}>
      {isPending && error && <FailLoader />}
      {isPending && <Loader />}
      <form onSubmit={submitForm} className={`w-full ${isDarkModed ? "text-white" : "text-black"}`}>
        <div className="flex flex-wrap items-center justify-center gap-4 py-4 mb-2">
          <GiSwordsPower className="text-6xl font-semibold" />
          <p className="text-center">
            {translations.topText.competitions[selectedLanguage]}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 p-4">
          <p className="font-bold text-2xl flex gap-2 sm:text-center md:text-left">
            {" "}
            <BsStars /> {translations.essentialInfo[selectedLanguage]} <BsStars />{" "}
          </p>
          <div className="flex flex-wrap w-full gap-4">
            <label className="flex flex-col sm:w-full md:max-w-xs xl:max-w-md">
              <span>
                {translations.bookTitleInput.label[selectedLanguage]}:
              </span>
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

            <label className="flex flex-col sm:w-full md:max-w-xs xl:max-w-md">
              <span>
                {translations.expirationDateInput.label[selectedLanguage]}:
              </span>

              <DateTimePicker
                required
                label={`${translations.expirationDateInput.label[selectedLanguage]}`}
                className="myDatePicker w-full bg-modalAccColor"
                sx={{
                  color: "#fff",
                  svg: { color: "#fff" },
                  input: { color: "#fff" },
                }}
                onChange={(newValue) => {
                  console.log(new Date(newValue.$d));
                  if (new Date(newValue.$d).getTime() < new Date().getTime()) {
                    dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.earlyDate[selectedLanguage]}`, alertType:"error"}));
                     
                    return;
                  } else {
                    setCompetition((competition) => {
                      competition.expiresAt = new Date(newValue.$d).getTime();
                      return competition;
                    });
                  }
                }}
              />
            </label>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 p-4">
          <p className="font-bold text-2xl flex gap-2 sm:text-center md:text-left">
            <CgDetailsMore /> {translations.detailedInfo[selectedLanguage]} <CgDetailsMore />
          </p>
          <div className="flex flex-wrap items-center w-full gap-4">
            <label className="flex flex-col sm:w-full md:max-w-xs xl:max-w-md">
              <Autocomplete
                sx={{
                  color: "#fff",
                  ":-ms-input-placeholder": {
                    color: "white",
                  },
                  listStyle: {
                    backgroundColor: "red",
                    color: "yellow",
                  },
                  "& + .MuiAutocomplete-popper .MuiAutocomplete-option": {
                    backgroundColor: "#363636",
                  },
                  "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected='true']":
                    {
                      backgroundColor: "#4396e6",
                    },
                  "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected ='true'] .Mui-focused":
                    {
                      backgroundColor: "#3878b4",
                    },
                }}
                multiple
                id="tags-outlined"
                options={notCurrentUsers}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => {
                  return (
                    <Box
                      sx={{
                        "& > img": { mr: 2, flexShrink: 0 },
                      }}
                      component="li"
                      key={option.value.id}
                      {...props}
                      className="bg-accColor cursor-pointer text-white flex gap-4 items-center p-1 cursor-pointer"
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
                    className=" text-white"
                    label={translations.membersInput.label[selectedLanguage]}
                    placeholder={translations.inviteSomeUsers[selectedLanguage]}
                  />
                )}
              />
            </label>

            <label className="sm:w-full md:max-w-xs xl:max-w-md">
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
        </div>

        <div className="flex flex-wrap w-full gap-4 p-4">
          <label className="sm:w-full md:max-w-xs xl:max-w-md">
            <span>{translations.competitionsPrize[selectedLanguage]}</span>
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
              <label className="flex flex-col sm:w-full md:max-w-xs xl:max-w-md">
                <span>{translations.prizeMoneyAmountInYourCurrency[selectedLanguage]}:</span>
                <input
                  className="input w-full border-accColor outline-none"
                  type="number"
                  step={0.5}
                  min={0}
                  max={document.creditsAvailable.valueInMoney / 100}
                  onChange={(e) => {
                    setCompetition((comp) => {
                      comp.prize.moneyPrize.amount = +e.target.value * 100;
                      comp.prize.moneyPrize.currency=document.stripeAccountData.default_currency;
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
              <label className="sm:w-full md:max-w-xs xl:max-w-md">
                <span>{translations.competitionsPrize[selectedLanguage]}</span>

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

              <label className="flex flex-col sm:w-full md:max-w-xs xl:max-w-md">
                <span>{translations.prizeDetails[selectedLanguage]}:</span>
                <input
                  className="input border-accColor rounded-md border-2 outline-none w-full px-1"
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

        <label className="flex flex-col p-4">
          <span className="font-bold text-lg">
            {translations.descriptionTextarea.label[selectedLanguage]}:
          </span>
          <textarea
            required
            className="outline-none border-accColor sm:w-full md:max-w-5xl border-2 h-48 resize-none py-1 rounded-lg"
            placeholder={`${translations.descriptionTextarea.placeholder[selectedLanguage]}`}
            onChange={(e) =>
              setCompetition((competition) => {
                competition.description = e.target.value;
                return competition;
              })
            }
          ></textarea>
        </label>

        <div className="flex justify-center items-center my-2 p-2 w-full">
          <button className="btn sm:w-full md:max-w-lg text-white bg-accColor hover:bg-blue-400">
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

export default CreateCompetition;
