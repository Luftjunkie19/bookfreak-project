import "./index.css";

import React from "react";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import ReactDOM from "react-dom/client";

import App from "./App";
import AuthContextProvider from "./context/AuthContext";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7yEQgwGTcxadl5UrZaOD_NCaSWRKugMU",
  authDomain: "bookfreak-3bd4e.firebaseapp.com",
  projectId: "bookfreak-3bd4e",
  storageBucket: "bookfreak-3bd4e.appspot.com",
  messagingSenderId: "243358621147",
  appId: "1:243358621147:web:356d73d02a7bbb10479bfe",
};

// Initialize Firebase

initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
