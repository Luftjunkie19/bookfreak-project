import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { useAuthContext } from './hooks/useAuthContext';
import AddLink from './pages/AddLink';
import Book from './pages/Book';
import Create from './pages/Create';
import EditBook from './pages/EditBook';
import EditProfile from './pages/EditProfile';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import LogInWithPhone from './pages/LogInWithPhone';
import MessagesHolder from './pages/MessagesHolder';
import Profile from './pages/Profile';
import SignInWithPhone from './pages/SignInWithPhone';
import SignUp from './pages/SignUp';
import YourChats from './pages/YourChats.jsx';

function App() {
  const { user, userIsReady } = useAuthContext();

  console.log(user, userIsReady);

  return (
    <div className="App">
      {userIsReady && (
        <>
          <BrowserRouter>
            <Navbar />
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
                  path="/user/profile/:id"
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
                  element={<MessagesHolder />}
                />

                <Route path="/your-chats/*" element={<YourChats />} />

                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route
                  path="/sign-in-with-phone"
                  element={<SignInWithPhone />}
                />

                <Route path="/login-with-phone" element={<LogInWithPhone />} />
              </Routes>
            </div>
            <Footer />
          </BrowserRouter>
          <ToastContainer />
        </>
      )}
    </div>
  );
}

export default App;
