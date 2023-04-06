import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import UnderNav from "./components/UnderNav";
import { useAuthContext } from "./hooks/useAuthContext";
import AddLink from "./pages/AddLink";
import Book from "./pages/Book";
import Books from "./pages/Books";
import Club from "./pages/Club";
import Clubs from "./pages/Clubs";
import Competition from "./pages/Competition.jsx";
import Competitions from "./pages/Competitions";
import Create from "./pages/Create";
import EditBook from "./pages/EditBook";
import EditClub from "./pages/EditClub";
import EditCompetition from "./pages/EditCompetition";
import EditProfile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LogInWithPhone from "./pages/LogInWithPhone";
import MessagesHolder from "./pages/MessagesHolder";
import Profile from "./pages/Profile";
import Recensions from "./pages/Recensions";
import SearchFor from "./pages/SearchFor";
import SearchOption from "./pages/SearchOption";
import SignInWithPhone from "./pages/SignInWithPhone";
import SignUp from "./pages/SignUp";
import YourChats from "./pages/YourChats.jsx";

function App() {
  const { user, userIsReady } = useAuthContext();

  console.log(user, userIsReady);

  console.log(navigator.onLine);

  return (
    <div className="App">
      <>
        {userIsReady && (
          <>
            <BrowserRouter>
              <Navbar />
              {user && <UnderNav />}
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
                    element={(user && <EditProfile />) || (!user && <SignUp />)}
                  />

                  <Route
                    path="/add-link"
                    element={(!user && <SignUp />) || (user && <AddLink />)}
                  />

                  <Route
                    path="/edit-book/:id"
                    element={(user && <EditBook />) || (!user && <SignUp />)}
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

                  <Route path="/forgot-password" element={<ForgotPassword />} />

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
                    path="/competition/:id/*"
                    element={(user && <Competition />) || (!user && <SignUp />)}
                  />

                  <Route
                    path="/recensions"
                    element={(user && <Recensions />) || (!user && <SignUp />)}
                  />

                  <Route
                    path="/readers-clubs"
                    element={(user && <Clubs />) || (!user && <SignUp />)}
                  />

                  <Route
                    path="/readers-clubs/:id/*"
                    element={(user && <Club />) || (!user && <SignUp />)}
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
              <Footer />
            </BrowserRouter>
            <ToastContainer />
          </>
        )}
      </>
    </div>
  );
}

export default App;
