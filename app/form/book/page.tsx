'use client';
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
import { snackbarActions } from '../../../context/SnackBarContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useRealDatabase } from 'hooks/useRealDatabase';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import LabeledInput from 'components/input/LabeledInput';
import { DatePicker, Select, SelectItem } from '@nextui-org/react';
import { bookCategories } from 'assets/CreateVariables';
import BlueButton from 'components/buttons/BlueButton';
import DarkButton from 'components/buttons/WhiteButton';
import BlueDarkGradientButton from 'components/buttons/gradient/BlueDarkGradientButton';
import { FileUpload } from 'primereact/fileupload';


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
      dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]}`, alertType: "error" }));
      setEditCover(null);
      return;
    }

    if (selected === null) {
      dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.selectAnything[selectedLanguage]}`, alertType: "error" }));
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
        dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.emptyMessage[selectedLanguage]}`, alertType: "error" }));
        setIsPending(false);

        return;
      }

      if (book.pagesNumber < usersReadPages) {
        setError(
          alertMessages.notifications.wrong.outOfSpaceReading[selectedLanguage]
        );
        dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.outOfSpaceReading[selectedLanguage]}`, alertType: "error" }));
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
        dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.existsBook[selectedLanguage]}`, alertType: "error" }));
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
        dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.writeLonger[selectedLanguage]}`, alertType: "error" }));
        setError(alertMessages.notifications.wrong.writeLonger[selectedLanguage]);
        return
      }

      if (book.countryOfRelease.trim().length === 0 || !book.dateOfPublishing || !book.publishingHouse) {
        dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.someFieldsEmpty[selectedLanguage]}`, alertType: "error" }));
        return
      }

      if (!book.bookCover) {
        dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.bookCoverReq[selectedLanguage]}`, alertType: "error" }));
        return
      }



      if (book.dateOfPublishing > new Date().getFullYear()) {
        dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.timeTraveler[selectedLanguage]}`, alertType: "error" }));
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


      dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.successfull.create[selectedLanguage]}`, alertType: "success" }));



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

  

  return (
    <div className={`min-h-screen h-full w-full overflow-x-hidden flex flex-col items-center justify-center`}>
      <form action={(formData:FormData)=>console.log(formData)} className=" flex flex-col gap-4 p-4 rounded-xl border bg-dark-gray border-primary-color max-w-7xl w-full">
       <p className='text-white text-2xl font-bold'>Append New Book !</p>
        <div className="flex flex-col gap-2">
          <p className='text-white text-lg font-medium'>General Information</p>
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          <LabeledInput label='Title' setValue={(value) => console.log(value)} />
          <LabeledInput label='Author' setValue={(value) => console.log(value)} />
          <LabeledInput type='number' label='Pages' setValue={(value) => console.log(value)} />
          <Select isRequired 
      placeholder="Select Category"
              labelPlacement="outside"
              className='text-white'
            label="Category"  
      >
          {bookCategories.map((item)=>({key:item, label:item})).map((animal) => (
          <SelectItem key={animal.key}>
            {animal.label}
          </SelectItem>
        ))}
      </Select>
            <DatePicker 
              className='text-white' 
         labelPlacement="outside"
          label="Release Date"
          isRequired
        />
        </div>
       </div>
        <div className="flex flex-col gap-2">
          <p className='text-white text-lg font-medium'>Detailed Information</p>
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <LabeledInput label='ISBN' setValue={(value) => console.log(value)} />
          <LabeledInput label='Publishing House' setValue={(value) => console.log(value)} />
          <div className="flex flex-col gap-1">
            <p className='text-white'>Release Country</p>
              <ReactFlagsSelect selectButtonClassName=' rounded-lg border-2 border-primary-color text-white h-fit' showSelectedLabel  selected={book.countryOfRelease} onSelect={(countryCode:string)=>setBook({...book, countryOfRelease:countryCode})}/>
          </div>
          <div className="flex gap-6 items-center">
                 <div className="flex flex-col gap-1">
            <p className='text-white'>Book Cover</p>
                      <input
  type="file"
  className="file-input max-w-xs w-full bg-primary-color" />
</div>
     </div>
       
      
         
        </div>
</div>

        <div className="flex flex-col gap-2">
          <p className='text-white text-lg font-medium'>Description</p>
          <textarea name="" id="" className='h-48 p-2 rounded-lg border-2 border-primary-color max-w-2xl outline-none w-full resize-none'></textarea>
        </div>


        <BlueDarkGradientButton isSubmit additionalClasses='self-end px-4 py-2 max-w-36 w-full'>
          Append
        </BlueDarkGradientButton>
  </form>
    </div>
  );
}

export default CreateBook;
