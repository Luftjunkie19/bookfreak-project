'use client';
import { HiOutlineUpload } from "react-icons/hi";
import { RiBook2Fill } from "react-icons/ri";

import {
  useCallback,
  useRef,
  useState,
} from 'react';


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
import  Link  from 'next/link';
import uniqid from 'uniqid';

import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
// import { bookCategories } from '../../assets/CreateVariables';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import LabeledInput from 'components/input/LabeledInput';
import { Checkbox, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { bookCategories } from 'assets/CreateVariables';
import { FileUpload } from 'primereact/fileupload';
import AdvertisementBar from 'components/Sidebars/right/AdvertisementBar';
import Button from "components/buttons/Button";
import { FaArrowDown } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import SingleDropDown from "components/drowdown/SingleDropDown";
import { getLocalTimeZone, parseAbsoluteToLocal, parseZonedDateTime, today } from "@internationalized/date";
import MultipleDropDown from "components/drowdown/MultipleDropDown";
import { useForm } from "react-hook-form";
import Image from "next/image";
import toast from "react-hot-toast";
import useStorage from "hooks/storage/useStorage";
import { useRouter } from "next/navigation";
import DropDown from "components/drowdown/rcSelectComponent/DropDown";
import 'react-tailwindcss-select/dist/index.css'
import Select from "react-tailwindcss-select";
import { SelectValue } from "react-tailwindcss-select/dist/components/type";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";



interface coverImage {
  file: File | null,
  url: string | null,
}

interface Book{
  title: string,
  originalTitle:string | null,
  author: string,
  coverImage: File | null,
  bookDescription: string,
  genre: string,
  pages: number,
  isbn: number | null,
  releaseDate: Date | null,
  publishingCycle:string | null,
  publishingHouse: string | null,
  language: string,
  bookFormat: SelectValue,
  termsConsent: boolean,
  volume: string | null,
  volumeNumber: string | null,
  serie:string | null,
}

function CreateBook() {
  const { user } = useAuthContext();
  const [isPending, setIsPending] = useState(false);
  const [editCover, setEditCover] = useState<coverImage | null>(null);
  const [date, setDate] = useState<Date>();
  const router = useRouter();
  const { uploadImage } = useStorage();
  const [bookTypes, setBookTypes] = useState<SelectValue>([]);
  const dispatch = useDispatch();

 
  const { register, setError, handleSubmit, getValues, setValue, clearErrors, getFieldState, formState, reset} = useForm<Book>();
  
  const { isSubmitted, errors } = formState;

  const editorRef = useRef<AvatarEditor>(null);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);

  const handleSelect = (e) => {
    clearErrors('coverImage');
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
        setEditCover({
          file: selected,
          url:fileReader.result as string,
        });
        setValue('coverImage', selected);
      };
          clearErrors('coverImage');
      return;
    }
  };

  const submitForm = async (formData: Book) => {
    const bookId = uniqid();
//  try {

//    if (!user) {
//      toast.error('You are not allowed to add any book.');
//      return;
//    }
   
   
//    if (!formData.coverImage) {
//      setError('coverImage', {
//        'message': 'You have to upload any image as a cover to insert the book item.',
//        type: 'required',
//      });
//      return;
//    }

//    const bookCover = await uploadImage(formData.coverImage, `book-covers/${user.uid}/${bookId}`);
//    console.log(bookCover);


//    await insertTo('books', {
//      bookCover,
//      title: formData.title,
//      author: { id: formData.author, nickname:formData.author},
//      bookDescription: formData.bookDescription,
//      addedBy: user.uid,
//      bookAddedAt: Timestamp.fromDate(new Date()),
//      releaseDate: !formData.releaseDate || isNaN(formData.releaseDate.getDate()) ? new Date().getFullYear() : formData.releaseDate.getFullYear(),
//      fullTitle: formData.originalTitle,
//      publishingHouse: { id: formData.publishingHouse, name: formData.publishingHouse },
//      recensions: [],
//      lovedBy: [],
//      pages: formData.pages,
//      accessibleTypes: formData.bookFormat,
//      volume: formData.volume,
//      volumeNumber: formData.volumeNumber,
//      serie: formData.serie,
//      publishingCycle: formData.publishingCycle,
//      genre: formData.genre,
//      isbn: formData.isbn,
//      language: formData.language,
//    }, bookId);

//    reset();
//    setEditCover(null);
//    toast.success('Successfully inserted Book !');

//    router.push('/');
    
   
//  } catch (error) {
//    console.log(error);
//    toast.error(JSON.stringify(error));
//   }
    
  
    
  };

  const handleSaveCover = async () => {
    // if (editorRef.current) {
      
    //   const editorImg = editorRef.current
    //     .getImageScaledToCanvas()
    //     .toDataURL("image/jpg");
  
    //   const byteCharacters = atob(editorImg.split(",")[1]);
    //   const byteNumbers = new Array(byteCharacters.length);
    //   for (let i = 0; i < byteCharacters.length; i++) {
    //     byteNumbers[i] = byteCharacters.charCodeAt(i);
    //   }
  
    //   const byteArray = new Uint8Array(byteNumbers);
  
    //   const storageRef = ref(
    //     storage,
    //     `bookcovers/${(user as User).uid}/${`book${uniqid()}`
    //     }.jpg`
    //   );
    //   await uploadBytes(storageRef, byteArray);
    //   const url = await getDownloadURL(storageRef);
    //   console.log(url);
  
  
    //   setEditCover(null);
    // }
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerInputFile = () => {
    fileInputRef.current?.click();
  }


  const bookTypesOptions = [
    { value: "Book", label: "📖 Book" },
    { value: "Ebook", label: "📱 Ebook" },
    { value: "Audiobook", label: "🎧 Audiobook" }
  ];
  
  const insertItem = useCallback((values:SelectValue) => {
      setBookTypes(values);
                setValue('bookFormat', bookTypes);
  },[])

  

  return (
    <div className={`px-6 py-4 sm:h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden flex flex-col gap-2 w-full `}>
      <div className="text-white">
      <p className='text-2xl font-bold'>Expand Our Bookish Database !</p>
      <p>Do we lack any book in our Database ? Insert it and help others finding this one !</p>
     </div>
      <form onSubmit={handleSubmit(submitForm, (errors) => {
        console.log(Object.values(getValues()).map((item) => {
          if (item === undefined) {
            return null;
          }
          return item;
        }));
        Object.values(errors).map((item) => (toast.error((item as any).message, {
          'className': 'delay-250 bg-dark-gray text-white border-primary-color border max-w-sm w-full',
        })))
      })}>
      <div className="flex py-2 items-center gap-12">

        <div onClick={triggerInputFile} className="w-52 group cursor-pointer relative top-0 left-0 h-72 overflow-hidden rounded-lg bg-white justify-center items-center flex">
          <input onChange={handleSelect} ref={fileInputRef} type="file"  className="hidden" id="" />
            {editCover && editCover.url ? <>
              <Image width={60} height={60} src={editCover.url} alt="" className="w-full duration-400 transition-all rounded-lg object-cover h-full" /> 
              <div className="h-full flex items-center gap-3 flex-col justify-center group-hover:top-0 duration-500 transition-all w-full absolute bg-dark-gray/50 rounded-lg -top-full left-0">
              <HiOutlineUpload className="text-5xl text-primary-color" />
          <p className='text-xs text-white'>Upload Image</p>
              </div>
            </> : <div className="flex w-full flex-col items-center gap-2">
<HiOutlineUpload className="text-5xl text-primary-color" />
          <p className='text-xs text-dark-gray'>Upload Image</p>
          </div>
       }  
 </div>
        <div className="flex flex-col gap-2 max-w-2xl w-full">
<p className="text-2xl text-white font-semibold flex gap-2 items-center"><RiBook2Fill className="text-4xl"/>  <span>General Book Information</span></p>
<div className="grid gap-4 grid-flow-dense xl:grid-cols-2">
              <LabeledInput {...register('title', {
                required: 'You have to provide the book title in order to insert the book to our database !',
                onChange: (e) => {
                  setValue('title', e.target.value)
                },
                validate: {
                  notEmpty: (value) => value.trim() !== '' || 'The book field cannot be empty !',
                },
              })}  additionalClasses="max-w-xs p-2 w-full" label="Book Title" type={"dark"}  />
              <LabeledInput {...register('originalTitle', {
                           onChange: (e) => {
                  setValue('originalTitle', e.target.value)
                }
                        })} additionalClasses="max-w-xs w-full p-2" label="Original Book Title" type={"dark"} />
              <LabeledInput  {...register('author', {
                                  onChange: (e) => {
                  setValue('author', e.target.value)
                },
                required: 'You have to provide the book title in order to insert the book to our database !',
                validate: {
                  notEmpty: (value) => value.trim() !== '' || 'The author field cannot be empty !',
                },
              })} additionalClasses="max-w-xs w-full p-2" label="Author" type={"dark"} />
              {/* <SingleDropDown {...register('genre', {
              required:'You have to provide the genre to problemlessly insert the book !'
            })} selectedArray={bookCategories} label="Genre">
              {bookCategories.map((item) => (<SelectItem key={item}>{item}</SelectItem>
))}
            </SingleDropDown>    */}
</div>
        </div>


      </div>


        <div className="flex w-full flex-col gap-2">
          <p className="text-xl text-white font-semibold">Detailed Book Information</p>
          <div className="grid xl:grid-cols-2 2xl:grid-cols-3 lg:max-w-2xl 2xl:max-w-6xl w-full gap-4">
          <div className="flex flex-col gap-1">
<p className="text-white">Version Language</p>
              <ReactFlagsSelect {...register('language', {
              required:'You have to pass the language, so there will be no duplicates !'
            })}  searchable showOptionLabel selectButtonClassName='bg-dark-gray text-white border-primary-color font-inherit max-w-xs w-full' selected={getValues('language')}  onSelect={function (countryCode: string): void {

              setValue('language', countryCode);
     
            } }/>
          </div>
            <LabeledInput  {...register('publishingHouse', {
                           onChange: (e) => {
                  setValue('publishingHouse', e.target.value)
                },
            })} additionalClasses="max-w-xs p-2 w-full" label="Publishing House" type={"dark"} />
            
            <div className="flex flex-col gap-1">
              <p className="text-white text-base">Release Date</p>
            <Popover>
      <PopoverTrigger asChild>
        <div className="flex gap-2 items-center text-white bg-dark-gray py-2 px-4 h-fit max-w-xs w-full rounded-lg border-2 border-primary-color"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                     {...register('releaseDate', {
              valueAsDate:true,
            })}
          mode="single"
          selected={date}
          onSelect={setDate}
                
                  
        />
      </PopoverContent>
            </Popover>
</div>
            
   


            <LabeledInput {...register('pages', {
                                     onChange: (e) => {
                  setValue('pages', e.target.value)
                },
              valueAsNumber: true,
              required:'You have to pass the amount of pages, to allow users tracking their progress.'
                                  })} minNumber={1} inputType='number' additionalClasses="max-w-xs p-2 w-full" label="Pages" type={"dark"} />
          
            <div className="flex flex-col gap-1">
              <p className='text-white'>Accessible Book Types</p>
              <Select isMultiple {...register('bookFormat', {
                validate: {
                  noValues: (value) => {
                    if (!value) {
                      return 'You are full of shit !'
                    }
                  }
                },
              })} classNames={{
                'tagItemText': '',
                'tagItemIconContainer': '',
                'list': '',
                'menu': '',
                menuButton: (value)=>'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color'
                
              }} value={bookTypes} primaryColor='' onChange={(values) => {
                insertItem(values);
              }} options={bookTypesOptions} />
          </div>
          
         
         
            {/* <MultipleDropDown {...register('bookFormat', {
              required: 'You have to pass the book format, to allow users tracking their progress.',
              onChange: (e) => {
                setValue('bookFormat', e.target.value.split(','));
              }
          })} label="Accessible Book Types" selectedArray={[]}>
            <SelectItem key={'book'}>Book</SelectItem>
            <SelectItem key={'ebook'}>Ebook</SelectItem>
              <SelectItem key={'audiobook'}>Audiobook</SelectItem>
          </MultipleDropDown> */}
          

        </div>
      </div>

           <label className="flex flex-col gap-1">
          <span className="text-xl text-white font-semibold">Book Description</span>
      <textarea {...register('bookDescription')}  className=" font-light p-2 max-w-3xl w-full h-80 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
      </label>
  

      

         <div className="flex w-full flex-col gap-1">
          <p className="text-2xl text-white font-bold">Detailed Book Information</p>
          <div className="grid xl:grid-cols-2 2xl:grid-cols-3 max-w-6xl w-full gap-2">
            <LabeledInput {...register('isbn', {
                       onChange: (e) => {
                  setValue('isbn', e.target.value)
                },
              valueAsNumber:true
            })} inputType="number" minNumber={0} additionalClasses="max-w-xs p-2 w-full" label="ISBN" type={"dark"}  />
            <LabeledInput  {...register('publishingCycle', {
                            onChange: (e) => {
                  setValue('publishingCycle', e.target.value)
                },
                        })} additionalClasses="max-w-xs p-2 w-full" label="Publishing Cycle" type={"dark"}  />
            <LabeledInput  {...register('serie', {
                          onChange: (e) => {
                  setValue('serie', e.target.value)
                },
                        })} additionalClasses="max-w-xs p-2 w-full" label="Serie" type={"dark"}  />
            <LabeledInput {...register('volume', {
                                onChange: (e) => {
                  setValue('volume', e.target.value)
                },
                        })} additionalClasses="max-w-xs p-2 w-full" label="Volume" type={"dark"}/>

            <LabeledInput inputType="number"  {...register('volumeNumber', {
               onChange: (e) => {
                  setValue('volumeNumber', e.target.value)
                },
              valueAsNumber: true,
              
                                  })} additionalClasses="max-w-xs p-2 w-full" label="Volume Number" type={"dark"}  />
          
        </div>
      </div>

      <div className="flex items-center gap-2 py-3">
        <Checkbox  {...register('termsConsent',  {
          validate: (value) => {
            return value || 'You have to agree for the terms';
          }
        })}/>
        <p className="text-sm text-white max-w-5xl w-full">By clicking this button, you admit BookFreak admnisitration to insert remaining information of the book, in case of lack of those. You allow to
        delete the book from the database if the information will contain obscenities or will be faked or untrue.</p>
      </div>

      <Button isSubmit  type='blue' additionalClasses="w-fit px-6 py-2 text-lg my-4">
        Insert
      </Button>
</form>

    </div>
  );
}

export default CreateBook;
