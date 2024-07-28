'use client';
import { useState } from 'react';

import { httpsCallable } from 'firebase/functions';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import uniqid from 'uniqid';


import { functions } from '../../firebase';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/FormsTranslations.json';
import { snackbarActions } from '../../../context/SnackBarContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocument from '../../../hooks/useGetDocument';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import LabeledInput from 'components/input/LabeledInput';
import { Avatar, Chip, DatePicker, Select, SelectItem, Switch, Tooltip } from '@nextui-org/react';
import { FaInfo } from 'react-icons/fa6';
import { InputSwitch } from 'primereact/inputswitch';
import Image from 'next/image';

function CreateCompetition() {
  const { user } = useAuthContext();
  const { addToDataBase, updateDatabase } = useRealDatabase();
  const [attachedUsers, setAttachedUsers] = useState([]);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const dispatch=useDispatch();
  const payCompetitionCharge= httpsCallable(functions, 'payCompetitionCharge');
  const [prize, setPrize]=useState(null)
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

  const navigate = useRouter();
  const { documents }=useGetDocuments('users');
  const {document}=useGetDocument("users", user ? user.uid : '');


  let notCurrentUsers = documents
    .filter((doc) => {
      return ( user &&
        doc.id !== user.uid &&
        !attachedUsers.some((member:any) => member.value.id === doc.id)
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

  const [competition, setCompetition] = useState<{
    competitionTitle: string,
    competitionsName: string,
    expiresAt: null | Date,
    description: string,
    prizeType: null | 'Money' | 'item',
    chargeId: null | string,
    prizeHandedIn: false,
    prize: {
      moneyPrize?: {
        amount: number | null,
        currency: string | null,
      },
      itemPrize?: { title: string | null, typeOfPrize: string | null },
    },
  }>({
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
      expiresAt: new Date((competition.expiresAt as Date)).getTime(),
      description: competition.description,
      prizeHandedIn: false,
      chargeId: competition.chargeId,
      prize: competition.prize,
      createdBy: {
        displayName: (user as User).displayName,
        email: (user as User).email,
        photoURL: (user as User).photoURL,
        createdAt: new Date().getTime(),
        id: (user as User).uid,
      },
      id: uniqueId,
    });

    addToDataBase("communityChats", uniqueId, {
      messages: {},
      chatId: uniqueId,
    });

    addToDataBase("communityMembers", uniqueId, {
      users: {
        [(user as User).uid]: {
          label: (user as User).displayName,
          belongsTo: uniqueId,
          value: {
            nickname: (user as User).displayName,
            id: (user as User).uid,
            photoURL: (user as User).photoURL,
          },
        },
      },
    });

    attachedUsers.map((member:any) =>
      addToDataBase("notifications", `${uniqueId}-${new Date().getTime()}`, {
        notificationContent: `You've been invited by ${(user as User).displayName} to join the ${competition.competitionsName} competition.`,
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
    navigate.push("/");
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
        competition.prizeType === "Money" &&  competition.prize.moneyPrize &&
        competition.prize.moneyPrize.amount === 0
      ) {
        dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.zeroAmount[selectedLanguage]}`, alertType:"error"}));
        
        
        setIsPending(false);
        return;
      }

      if (competition.prize.moneyPrize && competition.prize.moneyPrize.amount && competition.prize.moneyPrize.amount > document.creditsAvailable) {
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
        
        const { error, chargeObject } = await payoutObject.data as any;

        console.log(chargeObject);

        if (error) {
          setError(error);
          setIsPending(false);
          return;
        }

        if (chargeObject && user) {
          setCompetition((comp) => {
            comp.chargeId = chargeObject.id;
            (comp.prize.moneyPrize as any).currency =
              document.stripeAccountData.default_currency;
            return comp;
          });
          updateDatabase(
            {
              valueInMoney:
                document.creditsAvailable.valueInMoney -
                (competition.prize.moneyPrize.amount as number),
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
     <div className={`min-h-screen h-full w-full overflow-x-hidden `}>
      
    </div>
  );
}

export default CreateCompetition;
