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
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from './useAuthContext';

export function useLogin() {
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const context = useAuthContext();

  const { dispatch, user } = context;

  console.log(user);

  const navigate = useNavigate();

  const firestore = getFirestore();

  const signInWithGoogle = async () => {
    setError(null);
    setIsPending(true);

    try {
      const myAuth = getAuth();

      const googleProvider = new GoogleAuthProvider();

      const res = await signInWithPopup(myAuth, googleProvider);

      const document = doc(firestore, "users", res.user.uid);

      const userToAdd = await getDoc(document);

      if (!userToAdd.exists()) {
        const uploadPath = `profileImg/uid${res.user.uid}/${res.user.photoURL}`;

        const storage = getStorage();

        const image = ref(storage, uploadPath);

        const snapshot = await uploadBytes(image, res.user.photoURL);
        await getDownloadURL(image);

        await setDoc(document, {
          nickname: res.user.displayName,
          email: res.user.email,
          photoURL: res.user.photoURL,
          description: "",
          id: res.user.uid,
        });
      }

      dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);

      navigate("/");
    } catch (error) {
      setIsPending(false);

      if (
        error.message ===
        "Firebase: Error (auth/account-exists-with-different-credential)."
      ) {
        setError("There is already an user with such an credentials");
      }

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

      const document = doc(firestore, "users", res.user.uid);

      const userToAdd = await getDoc(document);

      if (!userToAdd.exists()) {
        const uploadPath = `profileImg/uid${res.user.uid}/${res.user.photoURL}`;

        const storage = getStorage();

        const image = ref(storage, uploadPath);

        const snapshot = await uploadBytes(image, res.user.photoURL);
        await getDownloadURL(image);

        await setDoc(document, {
          nickname: res.user.displayName,
          email: res.user.email,
          photoURL: res.user.photoURL,
          description: "",
          id: res.user.uid,
        });
      }

      dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);

      navigate("/");
    } catch (error) {
      setIsPending(false);

      if (
        error.message ===
        "Firebase: Error (auth/account-exists-with-different-credential)."
      ) {
        setError("There is already an user with such an credentials");
      }

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

      const document = doc(firestore, "users", res.user.uid);
      const userToAdd = await getDoc(document);

      console.log(userToAdd);

      if (!userToAdd.exists()) {
        const uploadPath = `profileImg/uid${res.user.uid}/${res.user.photoURL}`;

        const storage = getStorage();

        const image = ref(storage, uploadPath);

        const snapshot = await uploadBytes(image, res.user.photoURL);
        await getDownloadURL(image);

        await setDoc(document, {
          nickname: res.user.displayName,
          email: res.user.email,
          photoURL: res.user.photoURL,
          description: "",
          id: res.user.uid,
        });
      }

      dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);

      navigate("/");
    } catch (error) {
      setIsPending(false);

      if (
        error.message ===
        "Firebase: Error (auth/account-exists-with-different-credential)."
      ) {
        setError("There is already an user with such an credentials");
      }

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

      if (
        error.message ===
        "Firebase: Error (auth/account-exists-with-different-credential)."
      ) {
        setError("There is already an user with such an credentials");
      }

      setError(error.message);
    }
  };

  const signUpUser = async (email, password, displayName, profileImg) => {
    setError(null);
    setIsPending(true);
    try {
      const myAuth = getAuth();

      const res = await createUserWithEmailAndPassword(myAuth, email, password);

      const uploadPath = `profileImg/uid${res.user.uid}/${profileImg.name}`;

      const storage = getStorage();

      const image = ref(storage, uploadPath);

      const snapshot = await uploadBytes(image, profileImg);
      const photoURL = await getDownloadURL(image);

      await updateProfile(res.user, { displayName, photoURL });

      const document = doc(firestore, "users", res.user.uid);

      await setDoc(document, {
        nickname: res.user.displayName,
        email,
        photoURL,
        description: "",
        id: res.user.uid,
      });

      console.log(res.user);
      dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);

      navigate("/");
    } catch (error) {
      setIsPending(false);

      if (
        error.message ===
        "Firebase: Error (auth/account-exists-with-different-credential)."
      ) {
        setError("There is already an user with such an credentials");
      }

      setError(error.message);
      console.log(error.message);
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
