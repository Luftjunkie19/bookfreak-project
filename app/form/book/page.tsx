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
import { DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem } from '@nextui-org/react';
import { bookCategories } from 'assets/CreateVariables';
import { FileUpload } from 'primereact/fileupload';
import AdvertisementBar from 'components/Sidebars/right/AdvertisementBar';
import Button from "components/buttons/Button";
import { FaArrowDown } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import SingleDropDown from "components/drowdown/SingleDropDown";
import { parseZonedDateTime } from "@internationalized/date";
import MultipleDropDown from "components/drowdown/MultipleDropDown";


function CreateBook() {
  const { user } = useAuthContext();
  const [error, setError] = useState<string | null>("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [editCover, setEditCover] = useState<string | null>(null);
  const { addToDataBase } = useRealDatabase();
  const router = useRouter();

  const [hasStarted, setHasStarted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [radius, setRadius] = useState(0);
  const [link, setLink] = useState(null);
  const [selected, setSelected] = useState("");
  const dispatch = useDispatch();
  const { documents: availableBooks } = useGetDocuments("books");
 
  
  
  const stepperRef = useRef(null);
  

  const [book, setBook] = useState<{
    author: string,
    title: string,
    pagesNumber: number,
    category: null | string,
    bookCover: null | string,
    description: string,
    dateOfPublishing: null | number,
    countryOfRelease: string,
    publishingHouse: null | string,
  }>({
    author: "",
    title: "",
    pagesNumber: 1,
    category: null,
    bookCover: null,
    description: "",
    dateOfPublishing: null,
    countryOfRelease: "",
    publishingHouse: null,
  });
  const editorRef = useRef<AvatarEditor>(null);

  const [usersReadPages, setUsersReadPages] = useState(0);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);

  const handleSelect = (e) => {
    setError(null);
    setEditCover(null);
    setIsPending(false);

    let selected = e.target.files[0];

    if (selected?.size > 200000) {
      setError(alertMessages.notifications.wrong.tooBigFile[selectedLanguage]);
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
      setError(
        alertMessages.notifications.wrong.selectAnything[selectedLanguage]
      );

      setEditCover(null);
      return;
    }

    if (selected.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setEditCover(fileReader.result as string);
      };
      setError(null);
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const uniqueId = uniqid();

      if (book.category && book.category.trim() === "") {
        setError(
          alertMessages.notifications.wrong.emptyMessage[selectedLanguage]
        );
        //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.emptyMessage[selectedLanguage]}`, alertType: "error" }));
        setIsPending(false);

        return;
      }

      if (book.pagesNumber < usersReadPages) {
        setError(
          alertMessages.notifications.wrong.outOfSpaceReading[selectedLanguage]
        );
        //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.outOfSpaceReading[selectedLanguage]}`, alertType: "error" }));
        return;
      }

      if (
        availableBooks.find(
          (doc) =>
            doc.title.toLowerCase().includes(book.title.toLowerCase()) &&
            doc.author.toLowerCase().includes(book.author.toLowerCase()) &&
            doc.countryOfRelease.toLowerCase().includes(book.countryOfRelease.toLowerCase())
        )
      ) {
        //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.existsBook[selectedLanguage]}`, alertType: "error" }));
        setError(alertMessages.notifications.wrong.existsBook[selectedLanguage]);
        setLink(
          availableBooks.find(
            (doc) =>
              doc.title.toLowerCase().includes(book.title.toLowerCase()) &&
              doc.author.toLowerCase().includes(book.author.toLowerCase()) &&
              doc.countryOfRelease.toLowerCase().includes(book.countryOfRelease.toLowerCase())
          ).id
        );
        return;
      }

      if (book.description.trim().length < 20) {
        //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.writeLonger[selectedLanguage]}`, alertType: "error" }));
        setError(alertMessages.notifications.wrong.writeLonger[selectedLanguage]);
        return
      }

      if (book.countryOfRelease.trim().length === 0 || !book.dateOfPublishing || !book.publishingHouse) {
        //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.someFieldsEmpty[selectedLanguage]}`, alertType: "error" }));
        return
      }

      if (!book.bookCover) {
        //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.bookCoverReq[selectedLanguage]}`, alertType: "error" }));
        return
      }



      if (book.dateOfPublishing > new Date().getFullYear()) {
        //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.timeTraveler[selectedLanguage]}`, alertType: "error" }));
        return
      }


      const bookElement = {
        ...book,
        author: book.author,
        title: book.title,
        pagesNumber: book.pagesNumber,
        photoURL: book.bookCover,
        category: book.category,
        createdBy: {
          displayName: (user as User).displayName,
          email: (user as User).email,
          photoURL: (user as User).photoURL,
          createdAt: new Date(),
          id: (user as User).uid,
        },
        id: uniqueId,
      };

      console.log(bookElement);

      addToDataBase("books", uniqueId, bookElement);
      addToDataBase("likesData", uniqueId, {
        likesAmount: 0,
      });

      addToDataBase("bookReaders", uniqueId, {
        id: uniqueId,
        readers: {
          [(user as User).uid]: {
            displayName: (user as User).displayName,
            email: (user as User).email,
            photoURL: (user as User).photoURL,
            startedReading: hasStarted,
            hasFinished: usersReadPages === book.pagesNumber,
            pagesRead: usersReadPages,
            bookRate: 0,
            dateOfFinish: isCompleted ? new Date().getTime() : null,
            recension: "",
            id: (user as User).uid,

            bookReadingId: uniqueId,
          },
        },
      });

      addToDataBase("bookRecensions", uniqueId, {
        averageRate: 0,
        recensions: {},
      });


      //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.successfull.create[selectedLanguage]}`, alertType: "success" }));



      setIsPending(false);
      setError(null);
      router.push("/");
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
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
        `book-covers/${(user as User).uid}/${book.title ? book.title : `book${uniqid()}`
        }.jpg`
      );
      await uploadBytes(storageRef, byteArray);
      const url = await getDownloadURL(storageRef);
      console.log(url);
  
      setBook((book:any) => {
        book.bookCover = url;
        return book;
      });
  
      setEditCover(null);
    }
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerInputFile = () => {
    fileInputRef.current?.click();
  }

  

  return (
    <div className={`min-h-screen px-6 py-4 h-full overflow-x-hidden flex flex-col gap-2 w-full `}>
      <div className="text-white">
      <p className='text-2xl font-bold'>Expand Our Bookish Database !</p>
      <p>Do we lack any book in our Database ? Insert it and help others finding this one !</p>
     </div>

      <div className="flex py-2 items-center gap-12">

        <div onClick={triggerInputFile} className="w-52 cursor-pointer h-72 rounded-lg bg-white justify-center items-center flex">
          <input ref={fileInputRef} type="file" name="" className="hidden" id="" />
          <div className="flex w-full flex-col items-center gap-2">
<HiOutlineUpload className="text-5xl text-primary-color" />
          <p className='text-xs text-dark-gray'>Upload Image</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 max-w-2xl w-full">
<p className="text-2xl text-white font-semibold flex gap-2 items-center"><RiBook2Fill className="text-4xl"/>  <span>General Book Information</span></p>
<div className="grid gap-4 grid-flow-dense xl:grid-cols-2">
            <LabeledInput additionalClasses="max-w-xs w-full" label="Book Title" type={"dark"} setValue={(value) => {
              console.log(value);
            }} />
                        <LabeledInput additionalClasses="max-w-xs w-full" label="Original Book Title" type={"dark"} setValue={(value) => {
              console.log(value);
            }} />
                        <LabeledInput additionalClasses="max-w-xs w-full" label="Author" type={"dark"} setValue={(value) => {
              console.log(value);
            }} />
            <SingleDropDown selectedArray={bookCategories} label="Genre">
              {bookCategories.map((item) => (<DropdownItem key={item}>{item}</DropdownItem>
))}
            </SingleDropDown>   
</div>
        </div>


      </div>


        <div className="flex w-full flex-col gap-2">
          <p className="text-xl text-white font-semibold">Detailed Book Information</p>
          <div className="grid xl:grid-cols-2 2xl:grid-cols-3 lg:max-w-2xl 2xl:max-w-6xl w-full gap-4">
          <div className="flex flex-col gap-1">
<p className="text-white">Release Country</p>
            <ReactFlagsSelect searchable showOptionLabel selectButtonClassName='bg-dark-gray text-white border-primary-color font-inherit max-w-xs w-full' selected={"PL"}  onSelect={function (countryCode: string): void {
              console.log(countryCode)
            } }/>
          </div>
                        <LabeledInput additionalClasses="max-w-xs w-full" label="Publishing House" type={"dark"} setValue={(value) => {
              console.log(value);
            }} />
                   <DatePicker
        label="Date Of Release"
            className="max-w-xs w-full text-white"
            classNames={{
              'helperWrapper':'bg-dark-gray active:bg-dark-gray focus:bg-dark-gray hover:bg-dark-gray text-white',
                input: 'bg-dark-gray active:bg-dark-gray focus:bg-dark-gray hover:bg-dark-gray text-white',
              'innerWrapper': "bg-dark-gray active:bg-dark-gray focus:bg-dark-gray hover:bg-dark-gray text-white",
              'segment': 'bg-dark-gray active:bg-dark-gray focus:bg-dark-gray hover:bg-dark-gray text-white',
              'description':'bg-dark-gray active:bg-dark-gray focus:bg-dark-gray hover:bg-dark-gray text-white',
              label:'text-white',
              'inputWrapper':'border-2 border-primary-color bg-dark-gray active:bg-dark-gray focus:bg-dark-gray hover:bg-dark-gray text-white rounded-lg'
            }}
            dateInputClassNames={{
                 'helperWrapper':'bg-dark-gray active:bg-dark-gray focus:bg-dark-gray hover:bg-dark-gray text-white',
              input: 'bg-dark-gray active:bg-dark-gray focus:bg-dark-gray hover:bg-dark-gray text-white',
              'innerWrapper': "bg-dark-gray active:bg-dark-gray focus:bg-dark-gray hover:bg-dark-gray text-white",
              'segment': 'bg-dark-gray active:bg-dark-gray focus:bg-dark-gray hover:bg-dark-gray text-white',
              'description':'bg-dark-gray active:bg-dark-gray focus:bg-dark-gray hover:bg-dark-gray text-white',
              label:'text-white',
              'inputWrapper':'border-2 border-primary-color bg-dark-gray active:bg-dark-gray focus:bg-dark-gray hover:bg-dark-gray text-white rounded-lg'
            }}
        defaultValue={parseZonedDateTime("2022-11-07T00:45[America/Los_Angeles]")}
        labelPlacement="outside"
      />
                        <LabeledInput additionalClasses="max-w-xs w-full" label="Label" type={"dark"} setValue={(value) => {
              console.log(value);
          }} />


                                <LabeledInput additionalClasses="max-w-xs w-full" label="Pages" type={"dark"} setValue={(value) => {
              console.log(value);
          }} />
          
          <MultipleDropDown label="Accessible Book Types" selectedArray={[]}>
            <DropdownItem key={'book'}>Book</DropdownItem>
            <DropdownItem key={'ebook'}>Ebook</DropdownItem>
              <DropdownItem key={'audiobook'}>Audiobook</DropdownItem>
          </MultipleDropDown>
          

        </div>
      </div>

           <label className="flex flex-col gap-1">
          <span className="text-xl text-white font-semibold">Book Description</span>
      <textarea className=" font-light p-2 max-w-3xl w-full h-80 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
      </label>
  

      

         <div className="flex w-full flex-col gap-1">
          <p className="text-2xl text-white font-bold">Detailed Book Information</p>
          <div className="grid xl:grid-cols-2 2xl:grid-cols-3 max-w-6xl w-full gap-2">
            <LabeledInput additionalClasses="max-w-xs w-full" label="Label" type={"dark"} setValue={(value) => {
              console.log(value);
            }} />
                        <LabeledInput additionalClasses="max-w-xs w-full" label="Label" type={"dark"} setValue={(value) => {
              console.log(value);
            }} />
                        <LabeledInput additionalClasses="max-w-xs w-full" label="Label" type={"dark"} setValue={(value) => {
              console.log(value);
            }} />
                        <LabeledInput additionalClasses="max-w-xs w-full" label="Label" type={"dark"} setValue={(value) => {
              console.log(value);
          }} />

                                  <LabeledInput additionalClasses="max-w-xs w-full" label="Label" type={"dark"} setValue={(value) => {
              console.log(value);
          }} />
          
                                  <LabeledInput additionalClasses="max-w-xs w-full" label="Label" type={"dark"} setValue={(value) => {
              console.log(value);
          }} />
          
 


        </div>
      </div>

      <Button type='blue' additionalClasses="w-fit px-6 py-2 text-lg my-4">
        Insert
      </Button>

    </div>
  );
}

export default CreateBook;
