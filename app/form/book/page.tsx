'use client';
import { HiOutlineUpload } from "react-icons/hi";
import { RiBook2Fill } from "react-icons/ri";

import {
  useRef,
  useState,
} from 'react';
import '../../../stylings/primereact-custom/stepper.css'
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import AvatarEditor from 'react-avatar-editor';
import ReactFlagsSelect from 'react-flags-select';
import {
  FaBook,
  FaImage,
  FaWindowClose,
} from 'react-icons/fa';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router';
import  Link  from 'next/link';
import uniqid from 'uniqid';

import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';

import { storage } from '../../firebase';
// import { bookCategories } from '../../assets/CreateVariables';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useRealDatabase } from 'hooks/useRealDatabase';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import LabeledInput from 'components/input/LabeledInput';
import { Checkbox, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem } from '@nextui-org/react';
import { bookCategories } from 'assets/CreateVariables';
import { FileUpload } from 'primereact/fileupload';
import AdvertisementBar from 'components/Sidebars/right/AdvertisementBar';
import Button from "components/buttons/Button";
import { FaArrowDown } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import SingleDropDown from "components/drowdown/SingleDropDown";
import { parseZonedDateTime } from "@internationalized/date";
import MultipleDropDown from "components/drowdown/MultipleDropDown";
import useGetCollection from "hooks/firestore/useGetCollection";
import { useForm } from "react-hook-form";


function CreateBook() {
  const { user } = useAuthContext();
  const [isPending, setIsPending] = useState(false);
  const [editCover, setEditCover] = useState<string | null>(null);
  const { addToDataBase } = useRealDatabase();
  const router = useRouter();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [radius, setRadius] = useState(0);
  const [link, setLink] = useState(null);
  const [selected, setSelected] = useState("");
  const dispatch = useDispatch();
  const { documents: availableBooks } = useGetCollection("books");
 
  const { register, setError, handleSubmit} = useForm();

  const editorRef = useRef<AvatarEditor>(null);

  const [usersReadPages, setUsersReadPages] = useState(0);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);

  const handleSelect = (e) => {
    setEditCover(null);
    setIsPending(false);

    let selected = e.target.files[0];

    if (selected?.size > 200000) {
      setEditCover(null);
      return;
    }

    if (!selected.type.includes("image")) {
      //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]}`, alertType: "error" }));
      setEditCover(null);
      return;
    }

    if (selected === null) {
      //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.selectAnything[selectedLanguage]}`, alertType: "error" }));


      setEditCover(null);
      return;
    }

    if (selected.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setEditCover(fileReader.result as string);
      };
      return;
    }
  };

  const submitForm = async () => {
   
  };

  const handleSaveCover = async () => {
    if (editorRef.current) {
      
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
        `bookcovers/${(user as User).uid}/${`book${uniqid()}`
        }.jpg`
      );
      await uploadBytes(storageRef, byteArray);
      const url = await getDownloadURL(storageRef);
      console.log(url);
  
  
      setEditCover(null);
    }
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerInputFile = () => {
    fileInputRef.current?.click();
  }

  

  return (
    <div className={`px-6 py-4 sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden flex flex-col gap-2 w-full `}>
      <div className="text-white">
      <p className='text-2xl font-bold'>Expand Our Bookish Database !</p>
      <p>Do we lack any book in our Database ? Insert it and help others finding this one !</p>
     </div>
      <form onSubmit={handleSubmit(submitForm)}>
      <div className="flex py-2 items-center gap-12">

        <div onClick={triggerInputFile} className="w-52 cursor-pointer h-72 rounded-lg bg-white justify-center items-center flex">
          <input ref={fileInputRef} type="file"  className="hidden" id="" />
          <div className="flex w-full flex-col items-center gap-2">
<HiOutlineUpload className="text-5xl text-primary-color" />
          <p className='text-xs text-dark-gray'>Upload Image</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 max-w-2xl w-full">
<p className="text-2xl text-white font-semibold flex gap-2 items-center"><RiBook2Fill className="text-4xl"/>  <span>General Book Information</span></p>
<div className="grid gap-4 grid-flow-dense xl:grid-cols-2">
            <LabeledInput {...register('title')}  additionalClasses="max-w-xs p-2 w-full" label="Book Title" type={"dark"}  />
                        <LabeledInput {...register('originalTitle')} additionalClasses="max-w-xs w-full p-2" label="Original Book Title" type={"dark"} />
                        <LabeledInput  {...register('author')} additionalClasses="max-w-xs w-full p-2" label="Author" type={"dark"} />
            <SingleDropDown selectedArray={bookCategories} label="Genre">
              {bookCategories.map((item) => (<SelectItem key={item}>{item}</SelectItem>
))}
            </SingleDropDown>   
</div>
        </div>


      </div>


        <div className="flex w-full flex-col gap-2">
          <p className="text-xl text-white font-semibold">Detailed Book Information</p>
          <div className="grid xl:grid-cols-2 2xl:grid-cols-3 lg:max-w-2xl 2xl:max-w-6xl w-full gap-4">
          <div className="flex flex-col gap-1">
<p className="text-white">Version Language</p>
            <ReactFlagsSelect  searchable showOptionLabel selectButtonClassName='bg-dark-gray text-white border-primary-color font-inherit max-w-xs w-full' selected={"PL"}  onSelect={function (countryCode: string): void {
              console.log(countryCode)
            } }/>
          </div>
                        <LabeledInput  {...register('publishingHouse')} additionalClasses="max-w-xs p-2 w-full" label="Publishing House" type={"dark"} />
          <DatePicker
            
                   name="releaseDate"
       label={<p className='text-white'>Date of Release</p>}
            className="max-w-xs w-full text-white"
            classNames={{
       base:"",
   label: "",
   calendar:"text-white bg-dark-gray",
   selectorButton:"",
   selectorIcon:"",
   popoverContent:"text-white bg-dark-gray",
   calendarContent : 'bg-dark-gray text-white',
   inputWrapper: "text-white bg-dark-gray",
   input: "text-white bg-dark-gray",
   segment: "bg-primary-color",
   helperWrapper: "text-white bg-dark-gray",
   description: "",
   errorMessage: "",
            }}
     
        defaultValue={parseZonedDateTime("2022-11-07T00:45[America/Los_Angeles]")}
        labelPlacement="outside"
      />
  


                                <LabeledInput {...register('pages')} minNumber={1} inputType='number' additionalClasses="max-w-xs p-2 w-full" label="Pages" type={"dark"} />
          
          <MultipleDropDown name="bookTypes" label="Accessible Book Types" selectedArray={[]}>
            <SelectItem key={'book'}>Book</SelectItem>
            <SelectItem key={'ebook'}>Ebook</SelectItem>
              <SelectItem key={'audiobook'}>Audiobook</SelectItem>
          </MultipleDropDown>
          

        </div>
      </div>

           <label className="flex flex-col gap-1">
          <span className="text-xl text-white font-semibold">Book Description</span>
      <textarea {...register('bookDescription')}  className=" font-light p-2 max-w-3xl w-full h-80 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
      </label>
  

      

         <div className="flex w-full flex-col gap-1">
          <p className="text-2xl text-white font-bold">Detailed Book Information</p>
          <div className="grid xl:grid-cols-2 2xl:grid-cols-3 max-w-6xl w-full gap-2">
            <LabeledInput {...register('isbn')} inputType="number" minNumber={0} additionalClasses="max-w-xs p-2 w-full" label="ISBN" type={"dark"}  />
                        <LabeledInput  {...register('publishingCycle')} additionalClasses="max-w-xs p-2 w-full" label="Publishing Cycle" type={"dark"}  />
                        <LabeledInput  {...register('serie')} additionalClasses="max-w-xs p-2 w-full" label="Serie" type={"dark"}  />
                        <LabeledInput {...register('volume')} additionalClasses="max-w-xs p-2 w-full" label="Volume" type={"dark"}/>

                                  <LabeledInput  {...register('volumeNumber')} additionalClasses="max-w-xs p-2 w-full" label="Volume Number" type={"dark"}  />
          
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox  {...register('termsConsent'), {
          validate: (value) => {
            return value || 'You have to agree for the terms';
          }
        }}/>
        <p>By clicking this button, you admit BookFreak admnisitration to insert remaining information of the book, in case of lack of those. You allow to
        delete the book from the database if the information will contain obscenities or will be faked or untrue.</p>
      </div>

      <Button type='blue' additionalClasses="w-fit px-6 py-2 text-lg my-4">
        Insert
      </Button>
</form>

    </div>
  );
}

export default CreateBook;
