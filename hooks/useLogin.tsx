import { useState } from 'react';


import { useRouter } from 'next/navigation';

import { useAuthContext } from './useAuthContext';

export function useLogin() {
  const [error, setError] = useState<string | null>("");
  const [isPending, setIsPending] = useState(false);
  const context = useAuthContext();

  const { dispatch } = context;

  const navigate = useRouter();

  const signInWithGoogle = async () => {
    setError(null);
    setIsPending(true);

    try {
      const myAuth = getAuth();

      const googleProvider = new GoogleAuthProvider();

      const res = await signInWithPopup(myAuth, googleProvider);

      const documentExistence = await getDocument("users", res.user.uid);

      if (!documentExistence) {
        const uploadPath = `profileImg/uid${res.user.uid}/${res.user.photoURL}`;

        const storage = getStorage();

        const image = ref(storage, uploadPath);

        const snapshot = await uploadBytes(image, res.user.photoURL as unknown as Blob);
        await getDownloadURL(image);

        const accountData={
          accountData: {
            id: res.user.uid,
            nickname: res.user.displayName,
            email: res.user.email,
           }};

           console.log(accountData);

const fetchedObject= await createStripeAccount(accountData);

        const stripeAccountData =  fetchedObject.data;
   
        const accountLinkResponse=await createStripeAccountLink({accountId: (stripeAccountData as any).id});
        console.log(accountLinkResponse);
  
     const accountLinkObject = accountLinkResponse.data;
  
        console.log(accountLinkObject);

        
        console.log(stripeAccountData);

        addToDataBase("users", res.user.uid, {
          nickname: res.user.displayName,
          email: res.user.email,
          photoURL: res.user.photoURL,
          description: "",
          id: res.user.uid,
          creditsAvailable:{ valueInMoney:0, currency:(stripeAccountData as any).default_currency },
          stripeAccountData,
          accountLinkObject:{...(accountLinkObject as any).accountLinkObject}
        });
      }

      dispatch({ type: "LOGIN", payload: res.user });

      navigate.push("/");

      setError(null);
      setIsPending(false);
    } catch (error) {
      setIsPending(false);
console.log(error);
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

        const snapshot = await uploadBytes(image, res.user.photoURL as unknown as Blob);
        await getDownloadURL(image);

        const fetchedObject= await createStripeAccount({
          accountData: {
            id: res.user.uid,
            nickname: res.user.displayName,
            email: res.user.email,
           }});
           console.log(fetchedObject);
        
                const stripeAccountData =  fetchedObject.data;
           
                const accountLinkResponse=await createStripeAccountLink({accountId: (stripeAccountData as any).id});
        
          
             const accountLinkObject = accountLinkResponse.data;
  
        console.log(accountLinkObject);

        
        console.log(stripeAccountData);

        addToDataBase("users", res.user.uid, {
          nickname: res.user.displayName,
          email: res.user.email,
          photoURL: res.user.photoURL,
          description: "",
          id: res.user.uid,
          stripeAccountData,
          accountLinkObject:{...(accountLinkObject as any).accountLinkObject},
           creditsAvailable:{ valueInMoney:0, currency:(stripeAccountData as any).default_currency },
        });
      }

      dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);

      navigate.push("/");
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

        const snapshot = await uploadBytes(image, res.user.photoURL as unknown as Blob);
        await getDownloadURL(image);

        const fetchedObject= await createStripeAccount({
          accountData: {
            id: res.user.uid,
            nickname: res.user.displayName,
            email: res.user.email,
           }});
        
          const stripeAccountData =  fetchedObject.data;
           
          const accountLinkResponse=await createStripeAccountLink({accountId: (stripeAccountData as any).id});
        
          
        const {accountLinkObject} = (accountLinkResponse as any).data;
  
        console.log(accountLinkObject,accountLinkResponse);

        
        console.log(stripeAccountData, fetchedObject);

        addToDataBase("users", res.user.uid, {
          nickname: res.user.displayName,
          email: res.user.email,
          photoURL: res.user.photoURL,
          description: "",
           creditsAvailable:{ valueInMoney:0, currency:(stripeAccountData as any).default_currency },
          id: res.user.uid,
          stripeAccountData,
           accountLinkObject:{...accountLinkObject.accountLinkObject},
        });
      }

      dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);

      navigate.push("/");
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

      navigate.push("/");
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

      const fetchedObject= await createStripeAccount({
        accountData: {
          id: res.user.uid,
          nickname: res.user.displayName,
          email: res.user.email,
         }});
      
              const stripeAccountData =  fetchedObject.data;
         
              const accountLinkResponse=await createStripeAccountLink({accountId: (stripeAccountData as any).id});
      
        
           const accountLinkObject = accountLinkResponse.data;
        
        console.log(stripeAccountData);
      
      addToDataBase("users", res.user.uid, {
        nickname: res.user.displayName,
        email: res.user.email,
        photoURL: res.user.photoURL,
        description: "",
         creditsAvailable:{ valueInMoney:0, currency:(stripeAccountData as any).default_currency},
        id: res.user.uid,
        accountLinkObject: { ...(accountLinkObject as any).accountLinkObject },
        stripeAccountData,
        
      });

      dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);

      navigate.push("/");
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
