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
import { Avatar, Chip, DatePicker, Dropdown, DropdownItem, DropdownSection, DropdownTrigger, Select, SelectItem, Switch, Tooltip, useDisclosure } from '@nextui-org/react';
import { FaInfo } from 'react-icons/fa6';
import { InputSwitch } from 'primereact/inputswitch';
import Image from 'next/image';
import { HiOutlineUpload } from 'react-icons/hi';
import Button from 'components/buttons/Button';
import SingleDropDown from 'components/drowdown/SingleDropDown';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import ModalComponent from 'components/modal/ModalComponent';
import { MdEditDocument } from 'react-icons/md';
import { PiStackPlusFill } from 'react-icons/pi';

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

     const { isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
     <div className={`w-full  overflow-x-hidden p-4`}>
      <div className="flex flex-col gap-1 max-w-2xl w-full">
        <p className='text-2xl text-white font-bold'>Read, Absorb, Evolve !</p>
        <p className='text-white'>Are you an author, a book company or someone who wants to compete with other people ? Create the competition now and Read !</p>
     </div>
      
      
      <div className="flex py-4 gap-12">

        <div className="w-56 cursor-pointer h-56 rounded-lg bg-white justify-center items-center flex">
          <input  type="file" name="" className="hidden" id="" />
          <div className="flex w-full flex-col items-center gap-2">
<HiOutlineUpload className="text-5xl text-primary-color" />
          <p className='text-xs text-dark-gray'>Upload Competition&apos;s Logo</p>
          </div>
        </div>

        
<div className="grid max-w-2xl h-fit self-center w-full gap-4 grid-flow-dense xl:grid-cols-2">
            <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Competition Name" type={"dark"} setValue={(value) => {
              console.log(value);
          }} />
          
          <SingleDropDown label='Competition Rules' selectedArray={[]}>
            <SelectItem key={'rule1'}>Rule 1</SelectItem>
             <SelectItem key={'rule2'}>Rule 2</SelectItem>
              <SelectItem key={'rule3'}>Rule 3</SelectItem>
     </SingleDropDown>

        
          <DatePicker labelPlacement='outside'  label={<p className='text-white'>Expiration Date</p>} />
                       
</div>
      


      </div>

      <div className="flex gap-2 flex-col pb-2">
        <p className='text-xl text-white font-semibold'>Detailed Prize</p>
         <SingleDropDown label='Winner Prize' selectedArray={[]}>
            <SelectItem key={'book'}>Book</SelectItem>
             <SelectItem key={'ticket'}>Ticket</SelectItem>
           <SelectItem key={'voucher'}>Voucher</SelectItem>
          <SelectItem key={'money'}>Money</SelectItem>
               <SelectItem key={'money'}>Others</SelectItem>
     </SingleDropDown>


        <div className="grid xl:grid-cols-2 2xl:grid-cols-3 items-center gap-2 max-w-6xl">
          <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Book Title" type={"dark"} setValue={(value) => {
              console.log(value);
            }} />
                        <LabeledInput additionalClasses="max-w-xs w-full p-2" label="BookFreak's DB Reference" type={"dark"} setValue={(value) => {
              console.log(value);
            }} />
                        <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Ticket's Event Name" type={"dark"} setValue={(value) => {
              console.log(value);
          }} />
            <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Ticket's Event Type" type={"dark"} setValue={(value) => {
              console.log(value);
            }} />
                        <LabeledInput additionalClasses="max-w-xs w-full p-2" label="What is the Voucher for" type={"dark"} setValue={(value) => {
              console.log(value);
          }} />
          
                   <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Link  to the Voucher's Prize" type={"dark"} setValue={(value) => {
              console.log(value);
            }} />

                        <LabeledInput additionalClasses="max-w-xs w-full p-2" label='Money Prize' type={'transparent'} setValue={(value) => {
              console.log(value);
          }} />
          
          <div className="flex gap-1 flex-col col-span-full">
             <span className="text-lg text-white font-semibold">Other Prize's Description</span>
      <textarea className=" font-light p-2 max-w-3xl w-full h-80 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
          </div>

        </div> 
      </div>

      <div className="flex flex-col gap-2 pb-2">
        <div className="">
          <p className='text-xl text-white font-semibold'>Additional Conditions</p>
          <p className='text-xs text-gray-400'>You can add additional conditions users have to fullfill in order to join the competition.</p>
        </div>

          <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-52 max-w-2xl  bg-dark-gray py-4 px-2 rounded-lg  h-full">
                              <div className="flex gap-2 items-center bg-secondary-color text-white p-2 rounded-lg justify-between w-full">
                                  <p className='flex-1'>Additional Condition 1</p>
                                  <LabeledInput inputType='number' additionalClasses='max-w-20 w-full p-2' type='transparent' setValue={(value) => {
                                      console.log(value);
                                  }}/>
                              </div>
                              <div className="flex gap-2 items-center bg-secondary-color text-white p-2 rounded-lg justify-between w-full">
                                  <p className='flex-1'>Additional Condition 1</p>
                                  <LabeledInput inputType='number' additionalClasses='max-w-20 w-full p-2' type='transparent' setValue={(value) => {
                                      console.log(value);
                                  }}/>
                              </div>
                              <div className="flex gap-2 items-center bg-secondary-color text-white p-2 rounded-lg justify-between w-full">
                                  <p className='flex-1'>Additional Condition 1</p>
                                  <LabeledInput inputType='number' additionalClasses='max-w-20 w-full p-2' type='transparent' setValue={(value) => {
                                      console.log(value);
                                  }}/>
                              </div>
                              <div className="flex gap-2 items-center bg-secondary-color text-white p-2 rounded-lg justify-between w-full">
                                  <p className='flex-1'>Additional Condition 1</p>
                                  <LabeledInput inputType='number' additionalClasses='max-w-20 w-full p-2' type='transparent' setValue={(value) => {
                                      console.log(value);
                                  }}/>
                              </div>
                              <div className="flex gap-2 items-center bg-secondary-color text-white p-2 rounded-lg justify-between w-full">
                                  <p className='flex-1'>Additional Condition 1</p>
                                  <LabeledInput inputType='number' additionalClasses='max-w-20 w-full p-2' type='transparent' setValue={(value) => {
                                      console.log(value);
                                  }}/>
                              </div>
                              <div className="flex gap-2 items-center bg-secondary-color text-white p-2 rounded-lg justify-between w-full">
                                  <p className='flex-1'>Additional Condition 1</p>
                                  <LabeledInput inputType='number' additionalClasses='max-w-20 w-full p-2' type='transparent' setValue={(value) => {
                                      console.log(value);
                                  }}/>
                              </div>
</div> 

        <Button onClick={onOpen} additionalClasses='w-fit px-4 py-2 flex items-center gap-2' type='blue'>New Condition <PiStackPlusFill /></Button>
        <ModalComponent modalSize='xl' modalFooterContent={<div className='flex gap-3 items-center'>
            <Button type='blue' additionalClasses="w-fit  px-4 py-2">
        Append
      </Button>
 </div>} modalTitle='Additional Conditions' modalBodyContent={<div className='flex flex-col gap-3'>
                                    
          <SingleDropDown label='Type of Rule' selectedArray={[]}>
     <SelectItem key={'rule1'}>Min. Read Pages of Genre</SelectItem>
         <SelectItem key={'rule1'}>Min. Read Books of Genre</SelectItem>
     <SelectItem key={'rule2'}>Min. Read Books Amount</SelectItem>
     <SelectItem key={'rule2'}>Min. Read Pages Amount</SelectItem>
          <SelectItem key={'rule2'}>Peculiar Question</SelectItem>
   </SingleDropDown>
   
  <LabeledInput additionalClasses="max-w-sm w-full p-2" label="Question" type={"dark"} setValue={(value) => {
              console.log(value);
            }} />


           <SingleDropDown label='Answer Accessment' selectedArray={[]}>
     <SelectItem key={'rule1'}>Manual</SelectItem>
         <SelectItem key={'rule1'}>Expected Answers</SelectItem>
   </SingleDropDown>
   
     <textarea placeholder='Enter answers...' className="w-full text-white bg-secondary-color p-2 h-52 overflow-y-auto  resize-none outline-none rounded-md border-2 border-primary-color"  />

                        
                      </div>} isOpen={isOpen} onOpenChange={onOpenChange} />

      </div>

         <label className="flex flex-col gap-3">
          <span className="text-xl text-white font-semibold">Description</span>
      <textarea className=" font-light p-2 max-w-3xl w-full h-80 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
      </label>

      <Button type='blue' additionalClasses="w-fit px-8 py-2 text-lg my-4">
        Insert
      </Button>

    </div>
  );
}

export default CreateCompetition;
