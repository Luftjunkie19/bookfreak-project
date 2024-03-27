import '../stylings/scrollbarStyling.css';
import '../stylings/backgrounds.css';

import { deleteUser } from 'firebase/auth';
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
  Route,
  Routes,
  useParams,
} from 'react-router';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { functions } from '../../';
import translations from '../../assets/translations/ProfileTranslations.json';
import ChatsPage from '../../components/ProfileComonents/ChatsPage';
import FavouriteBooks from '../../components/ProfileComonents/FavouriteBooks';
import FullyReadBooks from '../../components/ProfileComonents/FullyReadBooks';
import Links from '../../components/ProfileComonents/Links';
import OwnedBooks from '../../components/ProfileComonents/OwnedBooks';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useLogout } from '../../hooks/useLogout';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';

function Profile() {
  const { id } = useParams();
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
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


  
  const readersFiltered = readerObjects.filter((reader) => reader.id === id);

  const lovedBooks=books.map((book,i)=>{
    return books.filter((bookItem)=>bookItem.id === favBooks.filter((fav)=>fav.lovedBy===user.uid)[i]?.lovedBookId);
  }).flat();

  const yourFinishedBooks=readersFiltered.map((reader)=>{
    return books.filter((bookItem)=>bookItem.id === reader?.bookReadingId && reader.pagesRead === bookItem?.pagesNumber);
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
    removeFromDataBase("users", user.uid);
    await logout();
    await deleteUser(user);
  };



  return (
    <div className={`min-h-screen h-full ${!isDarkModed && 'pattern-bg'}`}>
      {document && (
        <>
          <div className="grid xl:grid-cols-2 sm:grid-cols-1 gap-2">
            <div className="p-2 sm:border-b-4 sm:border-white xl:border-none bg-userColumnBgCol xl:rounded-b-lg">
              <div className="flex xl:justify-start sm:justify-center p-2">
                <div className="avatar">
                  <div className="w-48 rounded-full ring border-accColor ring-offset-base-100 ring-offset-2">
                    <img
                      src={document.photoURL}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center lg:flex-row sm:flex-col">
                <p className={`${isDarkModed ? "text-white" : "text-black"} font-bold text-3xl tracking-wide py-3`}>
                  {document.nickname}
                </p>
           
              </div>

              {document.id === user.uid && (
                <>
                  {document.creditsAvailable.balance ? (
                    Object.values(document.creditsAvailable.balance).map(
                      (doc, i) => (
                        <p key={i} className="text-white text-lg font-semibold">
                          {doc.amount / 100}{" "}
                          <span className="text-xl text-green-400">
                            {doc.currency.toUpperCase()}
                          </span>
                        </p>
                      )
                    )
                  ) : (
                    <p className="text-xl font-medium text-green-400">
                      {document.creditsAvailable.valueInMoney}{" "}
                      <span className="text-xl font-medium text-green-400">
                        {document.stripeAccountData.default_currency.toUpperCase()}
                      </span>
                    </p>
                  )}
                </>
              )}

              {document &&
                links.filter((link) => link.belongsTo === document.id).length >
                  0 && (
                  <div>
                    <p className="text-2xl text-white flex gap-2 items-center">
                      <IoShareSocialSharp />
                      {
                        translations.featuresButtons.socialMediaButton[
                          selectedLanguage
                        ]
                      }
                      :
                    </p>

                    <Links
                      links={links && links}
                      ownerId={document && document.id}
                      userId={user && user.uid}
                    />
                  </div>
                )}

              <div className="flex-w-full justify-center items-center">
                <div className="stats w-full stats-vertical 2xl:stats-horizontal shadow my-3">
                  <div className="stat">
                    <div className="stat-figure text-accColor text-4xl">
                      <BiSolidBook />
                    </div>
                    <div className="stat-title">
                      {translations.stats.booksRead[selectedLanguage]}
                    </div>
                    <div className="stat-value">
                    {yourFinishedBooks.length}
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-accColor text-4xl">
                      <FaBookBookmark />
                    </div>
                    <div className="stat-title">
                      {translations.stats.addedBooks[selectedLanguage]}
                    </div>
                    <div className="stat-value">
                      {
                        books.filter(
                          (book) => book.createdBy.id === document.id
                        ).length
                      }
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-accColor text-4xl">
                      <BiSolidLike />
                    </div>
                    <div className="stat-title">
                      {translations.stats.likedBooks[selectedLanguage]}
                    </div>
                    <div className="stat-value">
                      {
                        lovedBooks.length
                      }
                    </div>
                  </div>
                </div>
              </div>

              {document.id === user.uid && (
                <>
                  <div className="py-3 flex flex-wrap gap-3 items-center">
                    <Link
                      className="btn text-white group border-none bg-blue-500 hover:bg-blue-900 flex gap-2"
                      to="/edit-profile"
                    >
                      {
                        translations.managmentButtons.editButton[
                          selectedLanguage
                        ]
                      }{" "}
                      <FaGear className="text-base group-hover:rotate-180 transition-all" />
                    </Link>

                    <Link
                      className="btn text-white border-none bg-accColor hover:bg-green-950 flex gap-2"
                      to="/add-link"
                    >
                      {
                        translations.managmentButtons.addLinkButton[
                          selectedLanguage
                        ]
                      }
                      <FaPlusCircle className="text-base" />
                    </Link>

                    <button
                      className="btn bg-red-600 text-white border-none hover:bg-darkRed flex gap-2"
                      onClick={removeFiancialAccount}
                    >
                      {
                        translations.managmentButtons.removeUserButton[
                          selectedLanguage
                        ]
                      }
                      <FaUserAltSlash className="text-base" />
                    </button>
                  </div>
                </>
              )}

              {document.description && document.description.trim() !== "" ? (
                <div class={`flex flex-col ${isDarkModed ? "text-white" : "text-black"}  p-3 w-full`}>
                  <h2 class="text-3xl font-bold pb-2">
                    {translations.description.title[selectedLanguage]}:
                  </h2>
                  <p className="overflow-y-scroll overflow-x-hidden h-40 py-2 pr-4">
                    {document.description}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col text-white">
                  <h2>{translations.description.title[selectedLanguage]}:</h2>
                  <p>{translations.description.vacancy[selectedLanguage]}.</p>
                </div>
              )}

              {document.id !== user.uid && (
                <>
                  <div className="contact-user">
                    <button
                      onClick={() =>
                        redirectToExistedChat(`${document.id}-${user.uid}`)
                      }
                      className="btn bg-accColor text-white"
                    >
                      <FaCommentAlt />{" "}
                      {translations.messageBtn[selectedLanguage]}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col">
              <div className="sm:grid sm:grid-flow-col sm:auto-cols-[53%] gap-4 pt-3 snap-inline overflow-x-auto md:flex md:justify-around md:items-center">
                <Link
                  to="owned-books"
                  className="btn bg-accColor border-none snap-start text-white"
                >
                  {translations.featuresButtons.booksButton[selectedLanguage]}
                  <FaBook />
                </Link>
                <Link
                  to="read-books"
                  className="btn bg-accColor border-none snap-start text-white"
                >
                  {translations.featuresButtons.readBooksBtn[selectedLanguage]}
                  <FaBookBookmark />
                </Link>
                <Link
                  to="users-fav"
                  className="btn bg-accColor border-none snap-start text-yellow-400"
                >
                  {
                    translations.featuresButtons.favouritesButton[
                      selectedLanguage
                    ]
                  }
                  <FaStar />
                </Link>
                {document.id === user.uid && (
                  <Link
                    to="your-stats"
                    className="btn bg-accColor border-none snap-start text-white"
                  >
                    Statistics
                    <IoPieChartSharp />
                  </Link>
                )}
              </div>

              <div className="flex justify-center items-center py-4">
                <Routes>
                  <Route
                    path="owned-books"
                    element={
                      <OwnedBooks ownedBooks={books} ownerId={document.id} />
                    }
                  />

                  <Route
                    path="read-books"
                    element={
                      <FullyReadBooks
                        readBooks={yourFinishedBooks}
                        usersReadPages={yourFinishedBooks}
                      />
                    }
                  />

<Route
  path="users-fav"
  element={<FavouriteBooks favBooks={lovedBooks} />}
/>

                  {document.id === user.uid && (
                    <Route
                      path="your-stats"
                      element={
                        <ChatsPage
                          readerObjects={readersFiltered}
                          bookObjects={books}
                        />
                      }
                    />
                  )}
                </Routes>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
