import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import './pages/stylings/scrollbarStyling.css';

import { useDetectAdBlock } from 'adblock-detect-react';
import { useSelector } from 'react-redux';
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';
import { StepsProvider } from 'react-step-builder';
import { ToastContainer } from 'react-toastify';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Footer from './components/Footer';
import HamburgerMenu from './components/Navbar&MenuComponents/HamburgerMenu';
import HamburgerMenuUnlogged
  from './components/Navbar&MenuComponents/HamburgerMenuUnlogged';
import Navbar from './components/Navbar&MenuComponents/Navbar';
import NotificationViewer
  from './components/Navbar&MenuComponents/NotificationViewer';
import UnloggedNavbar from './components/Navbar&MenuComponents/UnloggedNavbar';
import AdblockAlert from './components/WarningsComponents/AdblockAlert';
import LanguageSelection
  from './components/WarningsComponents/LanguageSelection';
import Warning from './components/WarningsComponents/Warning';
import { useAuthContext } from './hooks/useAuthContext';
import Login from './pages/AuthorizationForms/Login';
import LogInWithPhone from './pages/AuthorizationForms/LogInWithPhone';
import SignInWithPhone from './pages/AuthorizationForms/SignInWithPhone';
import SignUp from './pages/AuthorizationForms/SignUp';
import MessagesHolder from './pages/ChatPages/MessagesHolder';
import YourChats from './pages/ChatPages/YourChats';
import Books from './pages/CollectionsPages/Books';
import Clubs from './pages/CollectionsPages/Clubs';
import Competitions from './pages/CollectionsPages/Competitions';
import Tests from './pages/CollectionsPages/TestsCollection.jsx';
import GeneralInfo from './pages/CommunitySubPages/GeneralInfo';
import OverallClub from './pages/CommunitySubPages/OverallClub';
import CreateBook from './pages/CreateForms/CreateBook.jsx';
import CreateClub from './pages/CreateForms/CreateClub.jsx';
import CreateCompetition from './pages/CreateForms/CreateCompetition.jsx';
import CreateTests from './pages/CreateForms/CreateTests.jsx';
import AddLink from './pages/Forms&FormsPages/AddLink';
import EditClub from './pages/Forms&FormsPages/EditClub';
import EditCompetition from './pages/Forms&FormsPages/EditCompetition';
import EditProfile from './pages/Forms&FormsPages/EditProfile';
import EditTest from './pages/Forms&FormsPages/EditTest.jsx';
import ForgotPassword from './pages/Forms&FormsPages/ForgotPassword.jsx';
import PaymentForm from './pages/Forms&FormsPages/PaymentForm.jsx';
import Home from './pages/Home';
import SearchFor from './pages/SearchPages/SearchFor';
import SearchOption from './pages/SearchPages/SearchOption';
import AboutUs from './pages/SinglePages/AboutUs.jsx';
import AuthorProfile from './pages/SinglePages/AuthorProfile.jsx';
import Book from './pages/SinglePages/Book';
import Club from './pages/SinglePages/Club';
import Competition from './pages/SinglePages/Competition.jsx';
import ContactPage from './pages/SinglePages/ContactPage.jsx';
import Profile from './pages/SinglePages/Profile';
import TestMainPage from './pages/TestPages/TestMainPage';
import TestStartedPage from './pages/TestPages/TestStartedPage';

function App() {
  const { user, userIsReady } = useAuthContext();

  const isUsingAdblock = useDetectAdBlock();

  const isDarkmode = useSelector((state) => state.mode.isDarkMode);
  const warningVisibility = useSelector(
    (state) => state.warning.isWarningVisible
  );

  return (
    <StepsProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div
          className={`w-full min-h-screen h-full `}
          data-theme={`${isDarkmode ? "dark" : "acid"}`}
        >
          <>
            {userIsReady && (
              <>
                <BrowserRouter>
                  {user && <Navbar user={user} />}
                  {!user && <UnloggedNavbar />}
                  {!user && <HamburgerMenuUnlogged />}
                  {user && <NotificationViewer />}
                  {warningVisibility && user && <Warning />}
                  {user && <HamburgerMenu />}

                  <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/about-us" element={<AboutUs />} />

                    <Route
                      path="/login"
                      element={(!user && <Login />) || (user && <Home />)}
                    />
                    <Route
                      path="/sign-up"
                      element={(!user && <SignUp />) || (user && <Home />)}
                    />
                    <Route
                      path="/book/:id"
                      element={(user && <Book />) || (!user && <SignUp />)}
                    />

                    <Route
                      path="/author/:authorName"
                      element={<AuthorProfile />}
                    />

                    <Route path="/edit-test/:testId" element={<EditTest />} />

                    <Route
                      path="/test/:testId"
                      element={
                        (user && <TestMainPage />) || (!user && <SignUp />)
                      }
                    />

                    <Route
                      path="/test/:testId/play/:startTime/:attemptId"
                      element={
                        (user && <TestStartedPage />) || (!user && <SignUp />)
                      }
                    />

                    <Route
                      path="/create/book"
                      element={
                        (user && <CreateBook />) || (!user && <SignUp />)
                      }
                    />

                    <Route
                      path="/create/club"
                      element={
                        (user && <CreateClub />) || (!user && <SignUp />)
                      }
                    />

                    <Route
                      path="/create/competition"
                      element={
                        (user && <CreateCompetition />) || (!user && <SignUp />)
                      }
                    />

                    <Route
                      path="/create/test"
                      element={
                        (user && <CreateTests />) || (!user && <SignUp />)
                      }
                    />

                    <Route
                      path="/profile/:id/*"
                      element={(!user && <SignUp />) || (user && <Profile />)}
                    />

                    <Route
                      path="/user/profile/:id/*"
                      element={(!user && <SignUp />) || (user && <Profile />)}
                    />

                    <Route
                      path="/edit-profile"
                      element={
                        (user && <EditProfile />) || (!user && <SignUp />)
                      }
                    />

                    <Route
                      path="/add-link"
                      element={(!user && <SignUp />) || (user && <AddLink />)}
                    />

                    <Route
                      path="/message-to/:chatId"
                      element={
                        (user && <MessagesHolder />) || (!user && <SignUp />)
                      }
                    />

                    <Route
                      path="/your-chats/*"
                      element={(user && <YourChats />) || (!user && <SignUp />)}
                    />

                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />

                    <Route
                      path="/sign-in-with-phone"
                      element={
                        (!user && <SignInWithPhone />) || (user && <Home />)
                      }
                    />

                    <Route
                      path="/login-with-phone"
                      element={
                        (!user && <LogInWithPhone />) || (user && <Home />)
                      }
                    />

                    <Route
                      path="/paymentForm/:paymentId/:sessionId"
                      element={
                        (!user && <SignUp />) || (user && <PaymentForm />)
                      }
                    />

                    <Route
                      path="/search"
                      element={
                        (user && <SearchOption />) || (!user && <SignUp />)
                      }
                    />

                    <Route
                      path="/search/:id"
                      element={(user && <SearchFor />) || (!user && <SignUp />)}
                    />

                    <Route
                      path="/competitions"
                      element={
                        (user && <Competitions />) || (!user && <SignUp />)
                      }
                    />

                    <Route
                      path="/competition/:id"
                      element={
                        (user && <Competition />) || (!user && <SignUp />)
                      }
                    />

                    <Route
                      path="/competition/:id/overall"
                      element={
                        (user && <GeneralInfo />) || (!user && <SignUp />)
                      }
                    />

                    <Route
                      path="/tests"
                      element={(user && <Tests />) || (!user && <SignUp />)}
                    />

                    <Route
                      path="/readers-clubs"
                      element={(user && <Clubs />) || (!user && <SignUp />)}
                    />

                    <Route
                      path="/readers-clubs/:id"
                      element={(user && <Club />) || (!user && <SignUp />)}
                    />

                    <Route
                      path="/readers-clubs/:id/overall"
                      element={
                        (user && <OverallClub />) || (!user && <SignUp />)
                      }
                    />

                    <Route
                      path="/edit-competition/:id"
                      element={
                        (user && <EditCompetition />) || (!user && <SignUp />)
                      }
                    />

                    <Route
                      path="/edit-club/:id"
                      element={(user && <EditClub />) || (!user && <SignUp />)}
                    />

                    <Route
                      path="/books"
                      element={(user && <Books />) || (!user && <SignUp />)}
                    />

                    <Route path="/contact" element={<ContactPage />} />
                  </Routes>

                  {isUsingAdblock && <AdblockAlert />}

                  {user && <LanguageSelection />}

                  <Footer />
                </BrowserRouter>
                <ToastContainer />
              </>
            )}
          </>
        </div>
      </LocalizationProvider>
    </StepsProvider>
  );
}

export default App;
