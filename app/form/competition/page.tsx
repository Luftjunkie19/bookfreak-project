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
import BlueDarkGradientButton from 'components/buttons/gradient/BlueDarkGradientButton';
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
     <div className={`min-h-screen h-full w-full overflow-x-hidden flex flex-col items-center justify-center`}>
      <div className=" flex flex-col gap-4 p-4 rounded-xl border bg-dark-gray border-primary-color max-w-7xl w-full">
        <div className="flex p-1 justify-between w-full items-center">
        <p className='text-white text-2xl font-bold'>Create New Competition !</p>
          <Tooltip content={<div className="flex flex-col gap-2 max-w-sm w-full">
            <div className="">
              <p className='text-sm'>{translations.competitionTypes.first[selectedLanguage]}</p>
              <p className='text-xs'>
                Points are calculated as 2 points per book read. Members are ranked by total points.
              </p>
            </div>

             <div className="">
              <p className='text-sm'>{translations.competitionTypes.second[selectedLanguage]}</p>
              <p className='text-xs'>Points are calculated as 1 point per book read and 1 point per valid recommendation. Members are ranked by total points.</p>
            </div>

             <div className="">
              <p className='text-sm'>{translations.competitionTypes.third[selectedLanguage]}</p>
              <p className='text-xs'>Points are calculated based on pages read, average test results, and number of attempts. Members are ranked by total points.</p>
            </div>

          </div>}>
          <button className='text-white text-sm flex gap-2 items-center'>Competition Types ? <FaInfo className='text-white' /></button>
          </Tooltip>  
     </div>
        <div className="flex flex-col gap-2">
          <p className='text-white text-lg font-medium'>General Information</p>
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          <LabeledInput label='Competition Name' setValue={(value) => console.log(value)} />
            <Select isRequired 
              classNames={{
             'trigger':'rounded-lg border-2 border-primary-color'
              }}
      placeholder="Select Category"
              className='text-white'
              labelPlacement='outside'
              label={
               'Category'  
              }  
      >
              {competitionTypes.map((option) => (
            
          <SelectItem key={option.label}>
            {option.value}
          </SelectItem>                  

        ))}
      </Select>
            <DatePicker 
              classNames={{
                input:'rounded-lg border-2 border-primary-color'
              }}
             
              labelPlacement='outside'
              className='text-white self-end' 
          label={'Expiration Date'}
          isRequired
            />
            <div className="flex self-end flex-col gap-2">
<p className='text-white'>Is the prize money ?</p>
           <InputSwitch checked  />
            </div>
                   <Select
              className='self-end'
      items={notCurrentUsers}
              label="Invite your friends."
      selectionMode="multiple"
      placeholder="Select a user"
      labelPlacement='inside'
      classNames={{
        trigger: "min-h-12 py-2",
      }}
      renderValue={(items) => {
        return (
          <div className="flex overflow-x-auto gap-4 ">
            {items.map((item:any, i) => (
              <div onClick={() => console.log(item)} key={item.data.value.id}>
                <Image src={item.data.value.photoURL} alt='' width={32} height={32} className='w-6 h-6 rounded-full'/>
               
              </div>
            ))}
          </div>
        );
      }}
    >
      {(user) => (
        <SelectItem key={user.value.id} textValue={user.label}>
          <div className="flex gap-2 items-center">
            <Avatar alt={user.label} className="flex-shrink-0" size="sm" src={user.value.photoURL} />
            <div className="flex flex-col">
              <span className="text-small text-default-400">{user.value.nickname}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>

         
       
        
                 <div className="flex flex-col gap-1">
            <p className='text-white'>Thumbnail</p>
                      <input
  type="file"
  className="file-input max-w-xs w-full bg-primary-color" />
</div>
        </div>
       </div>
        <div className="flex flex-col gap-2">
          <p className='text-white text-lg font-medium'>Prize Details</p>
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4"> 
            <LabeledInput label='Prize Amount' type='number' setValue={(value) => console.log(value)} />
             <Select isRequired 
              classNames={{
             'trigger':'rounded-lg border-2 border-primary-color'
              }}
      placeholder="Select Category"
              className='text-white'
              labelPlacement='outside'
              label={
               'Item Prize-Type'  
              }  
      >
              {differentPrize.map((option) => (
            
          <SelectItem key={option.label}>
            {option.value}
          </SelectItem>                  

        ))}
      </Select>
            <LabeledInput label='Book Title'  setValue={(value) => console.log(value)} />
            <LabeledInput label='Book Author' setValue={(value) => console.log(value)} />
            <LabeledInput label='Book Pages' type='number' setValue={(value) => console.log(value)} />
            
              <LabeledInput label='Ticket-Event Name'  setValue={(value) => console.log(value)} />
            <LabeledInput label='Ticket-Event Link' setValue={(value) => console.log(value)} />
             <LabeledInput label='Voucher Name' setValue={(value) => console.log(value)} />

          </div>
           
        </div>
         <div className="flex flex-col gap-2">
          <p className='text-white text-lg font-medium'>Item-Prize Description</p>
          <textarea name="" id="" className='h-32 p-2 rounded-lg border-2 border-primary-color max-w-xl outline-none w-full resize-none'></textarea>
        </div>


        <div className="flex flex-col gap-2">
          <p className='text-white text-lg font-medium'>Description</p>
          <textarea name="" id="" className='h-48 p-2 rounded-lg border-2 border-primary-color max-w-2xl outline-none w-full resize-none'></textarea>
        </div>


        <BlueDarkGradientButton isSubmit additionalClasses='self-end px-4 py-2 max-w-36 w-full'>
          Append
        </BlueDarkGradientButton>
  </div>
    </div>
  );
}

export default CreateCompetition;
