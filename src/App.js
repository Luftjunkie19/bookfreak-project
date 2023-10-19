import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import "./components/stylings/effects.css";

import { useEffect } from "react";

import { useDetectAdBlock } from "adblock-detect-react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Footer from "./components/Footer";
import HamburgerMenu from "./components/Navbar&MenuComponents/HamburgerMenu";
import HamburgerMenuUnlogged from "./components/Navbar&MenuComponents/HamburgerMenuUnlogged";
import Navbar from "./components/Navbar&MenuComponents/Navbar";
import NotificationViewer from "./components/Navbar&MenuComponents/NotificationViewer";
import UnloggedNavbar from "./components/Navbar&MenuComponents/UnloggedNavbar";
import AdblockAlert from "./components/WarningsComponents/AdblockAlert";
import Warning from "./components/WarningsComponents/Warning";
import { useAuthContext } from "./hooks/useAuthContext";
import Login from "./pages/AuthorizationForms/Login";
import LogInWithPhone from "./pages/AuthorizationForms/LogInWithPhone";
import SignInWithPhone from "./pages/AuthorizationForms/SignInWithPhone";
import SignUp from "./pages/AuthorizationForms/SignUp";
import MessagesHolder from "./pages/ChatPages/MessagesHolder";
import YourChats from "./pages/ChatPages/YourChats";
import Books from "./pages/CollectionsPages/Books";
import Clubs from "./pages/CollectionsPages/Clubs";
import Competitions from "./pages/CollectionsPages/Competitions";
import Recensions from "./pages/CollectionsPages/Recensions";
import GeneralInfo from "./pages/CommunitySubPages/GeneralInfo";
import OverallClub from "./pages/CommunitySubPages/OverallClub";
import Create from "./pages/Create";
import AddLink from "./pages/Forms&FormsPages/AddLink";
import EditClub from "./pages/Forms&FormsPages/EditClub";
import EditCompetition from "./pages/Forms&FormsPages/EditCompetition";
import EditProfile from "./pages/Forms&FormsPages/EditProfile";
import ForgotPassword from "./pages/Forms&FormsPages/ForgotPassword.jsx";
import Home from "./pages/Home";
import SearchFor from "./pages/SearchPages/SearchFor";
import SearchOption from "./pages/SearchPages/SearchOption";
import Book from "./pages/SinglePages/Book";
import Club from "./pages/SinglePages/Club";
import Competition from "./pages/SinglePages/Competition.jsx";
import Profile from "./pages/SinglePages/Profile";

function App() {
  const { user, userIsReady } = useAuthContext();

  const isUsingAdblock = useDetectAdBlock();

  useEffect(() => {
    if (isUsingAdblock) {
      console.log("NAUGHTY, NAUGHTY BOI !");
    } else {
      console.log("GOOOD BOI !");
    }
  }, [isUsingAdblock]);

  const dispatch = useDispatch();
  const isDarkmode = useSelector((state) => state.mode.isDarkMode);

  const warningVisibility = useSelector(
    (state) => state.warning.isWarningVisible
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="w-full min-h-screen h-full">
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
                <div className="container">
                  <Routes>
                    <Route
                      path="/"
                      element={(user && <Home />) || (!user && <SignUp />)}
                    />
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
                      path="/create"
                      element={(user && <Create />) || (!user && <SignUp />)}
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
                      path="/recensions"
                      element={
                        (user && <Recensions />) || (!user && <SignUp />)
                      }
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
                  </Routes>
                </div>

                {isUsingAdblock && <AdblockAlert />}

                <Footer />
              </BrowserRouter>
              <ToastContainer />
            </>
          )}
        </>
      </div>
    </LocalizationProvider>
  );
}

export default App;
