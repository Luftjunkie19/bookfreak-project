import '../stylings/scrollbarStyling.css';
import '../stylings/backgrounds.css';

import { deleteUser, User } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import {
  BiSolidBook,
  BiSolidLike,
} from 'react-icons/bi';
import {
  FaBook,
  FaCommentAlt,
  FaPlusCircle,
  FaStar,
  FaUserAltSlash,
} from 'react-icons/fa';
import {
  FaBookBookmark,
  FaGear,
} from 'react-icons/fa6';
import {
  IoPieChartSharp,
  IoShareSocialSharp,
} from 'react-icons/io5';
import { useSelector } from 'react-redux';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { functions } from '../../firebase';
import translations from '../../../assets/translations/ProfileTranslations.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocument from '../../../hooks/useGetDocument';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useLogout } from '../../../hooks/useLogout';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import useRealtimeDocument from '../../../hooks/useRealtimeDocument';

function Profile({params}:{params:{userId:string}}) {
  const { userId:id } = params;
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const removeAccount=httpsCallable(functions, 'removeAccount');
  const { logout } = useLogout();
  const { getDocument } = useRealtimeDocument();
  const { removeFromDataBase } = useRealDatabase();
  const {document}=useGetDocument('users', id);


const {documents:books}=useGetDocuments('books');
  const {documents: links}= useGetDocuments("links");
  const { documents: favBooks } = useGetDocuments("lovedBooks");
const {documents: readers}=useGetDocuments("bookReaders");

const readerObjects=readers.map((bookReader) => {
  return bookReader.readers;
}).map((obj) => {
  const nestedObject = Object.values(obj);
  return nestedObject;
}).flat();

  const navigate = useNavigate();

  const { user } = useAuthContext();

  const booksFilter = books.map((book) => {
    return { bookId: book.id, pagesNumber: book.pagesNumber };
  });


  
  const readersFiltered = readerObjects.filter((reader:any) => reader.id === id);

  const lovedBooks=books.map((book,i)=>{
    return books.filter((bookItem)=>bookItem.id === favBooks.filter((fav)=>fav.lovedBy===(user as User).uid)[i]?.lovedBookId);
  }).flat();

  const yourFinishedBooks=readersFiltered.map((reader:any)=>{
    return books.filter((bookItem:any)=>bookItem.id === reader?.bookReadingId && reader.pagesRead === bookItem?.pagesNumber);
}).flat();

  const redirectToExistedChat = async (providedId) => {
const providedIdPartOne=providedId.split("-")[0];
const providedIdPartTwo=providedId.split("-")[1];

    const optionOne = await getDocument("usersChats",providedId);
    const secondOption= await getDocument("usersChats", `${providedIdPartTwo}-${providedIdPartOne}`);

    if(optionOne){
      navigate(`/message-to/${providedId}`);
    }
    if(secondOption){
      navigate(`/message-to/${providedIdPartTwo}-${providedIdPartOne}`);
    }else{
      navigate(`/message-to/${providedId}`);
    }


  };

  const removeFiancialAccount = async () => {
    await removeAccount( { accountId: document.stripeAccountData.id });
    removeFromDataBase("users", (user as User).uid);
    await logout();
    await deleteUser(user as User);
  };



  return (
    <div className={`min-h-screen h-full`}>
      {document && (
     <div></div>
      )}
    </div>
  );
}

export default Profile;
