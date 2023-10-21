import "./index.css";

import React from "react";

import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import AuthContextProvider from "./context/AuthContext";
import stored from "./context/Stored";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_DOMAINNAME,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSENDERID,
  appId: process.env.REACT_APP_APPID,
};
// Initialize Firebase

initializeApp(firebaseConfig);

const currentApp = initializeApp(firebaseConfig);

export const database = initializeFirestore(currentApp, {
  experimentalForceLongPolling: true,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <Provider store={stored}>
        <App />
      </Provider>
    </AuthContextProvider>
  </React.StrictMode>
);
