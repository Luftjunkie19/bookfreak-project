import { useState } from 'react';

import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from './useAuthContext';
import { useRealDatabase } from './useRealDatabase';
import useRealtimeDocument from './useRealtimeDocument';

export function useLogin() {
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { getDocument } = useRealtimeDocument();
  const { addToDataBase } = useRealDatabase();

  const context = useAuthContext();

  const { dispatch, user } = context;

  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    setError(null);
    setIsPending(true);

    try {
      const myAuth = getAuth();

      const googleProvider = new GoogleAuthProvider();

      const res = await signInWithPopup(myAuth, googleProvider);

      const documentExistence = await getDocument("users", res.user.uid);

      console.log(documentExistence);

      if (!documentExistence) {
        const uploadPath = `profileImg/uid${res.user.uid}/${res.user.photoURL}`;

        const storage = getStorage();

        const image = ref(storage, uploadPath);

        const snapshot = await uploadBytes(image, res.user.photoURL);
        await getDownloadURL(image);

        addToDataBase("users", res.user.uid, {
          nickname: res.user.displayName,
          email: res.user.email,
          photoURL: res.user.photoURL,
          description: "",
          links: {},
          notifications: {},
          chats: {},
          id: res.user.uid,
        });
      }

      dispatch({ type: "LOGIN", payload: res.user });

      navigate("/");

      setError(null);
      setIsPending(false);
    } catch (error) {
      setIsPending(false);

      setError(error.message);
    }
  };

  const signInWithFacebook = async () => {
    setError(null);
    setIsPending(true);

    try {
      const myAuth = getAuth();

      const facebookProvider = new FacebookAuthProvider();

      const res = await signInWithPopup(myAuth, facebookProvider);

      const documentExistence = await getDocument("users", res.user.uid);

      console.log(documentExistence);

      if (!documentExistence) {
        const uploadPath = `profileImg/uid${res.user.uid}/${res.user.photoURL}`;

        const storage = getStorage();

        const image = ref(storage, uploadPath);

        const snapshot = await uploadBytes(image, res.user.photoURL);
        await getDownloadURL(image);

        addToDataBase("users", res.user.uid, {
          nickname: res.user.displayName,
          email: res.user.email,
          photoURL: res.user.photoURL,
          description: "",
          links: {},
          notifications: {},
          chats: {},
          id: res.user.uid,
        });
      }

      dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);

      navigate("/");
    } catch (error) {
      setIsPending(false);

      setError(error.message);
    }
  };

  const signInWithGithub = async () => {
    setError(null);
    setIsPending(true);

    try {
      const myAuth = getAuth();

      const githubProvider = new GithubAuthProvider();

      const res = await signInWithPopup(myAuth, githubProvider);

      const documentExistence = await getDocument("users", res.user.uid);

      console.log(documentExistence);

      if (!documentExistence) {
        const uploadPath = `profileImg/uid${res.user.uid}/${res.user.photoURL}`;

        const storage = getStorage();

        const image = ref(storage, uploadPath);

        const snapshot = await uploadBytes(image, res.user.photoURL);
        await getDownloadURL(image);

        addToDataBase("users", res.user.uid, {
          nickname: res.user.displayName,
          email: res.user.email,
          photoURL: res.user.photoURL,
          description: "",
          links: {},
          notifications: {},
          chats: {},
          id: res.user.uid,
        });
      }

      dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);

      navigate("/");
    } catch (error) {
      setIsPending(false);

      setError(error.message);
    }
  };

  const signInNormally = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      const myAuth = getAuth();

      const res = await signInWithEmailAndPassword(myAuth, email, password);

      dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);

      navigate("/");
    } catch (error) {
      setIsPending(false);

      setError(error.message);
    }
  };

  const signUpUser = async (email, password, displayName, profileImg) => {
    setError(null);
    setIsPending(true);
    try {
      const myAuth = getAuth();

      const res = await createUserWithEmailAndPassword(myAuth, email, password);

      const storage = getStorage();

      const storageRef = ref(
        storage,
        `profileImg/uid${res.user.uid}/${res.user.displayName}.jpg`
      );

      await uploadBytes(storageRef, profileImg);

      const photoURL = await getDownloadURL(storageRef);

      await updateProfile(res.user, { displayName, photoURL });

      addToDataBase("users", res.user.uid, {
        nickname: res.user.displayName,
        email: res.user.email,
        photoURL: res.user.photoURL,
        description: "",
        links: {},
        notifications: {},
        chats: {},
        id: res.user.uid,
      });

      dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);

      navigate("/");
    } catch (error) {
      setIsPending(false);

      setError(error.message);
    }
  };

  return {
    signInWithGoogle,
    signInWithFacebook,
    signInWithGithub,
    signInNormally,
    signUpUser,
    error,
    isPending,
  };
}
