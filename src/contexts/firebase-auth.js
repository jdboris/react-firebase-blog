import "../firebase";
import { createContext, useContext, useState } from "react";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";

const auth = getAuth();
const provider = new GoogleAuthProvider();

const FirebaseAuthContext = createContext(null);

export function useFirebaseAuth() {
  return useContext(FirebaseAuthContext);
}

export function FirebaseAuthProvider({ children }) {
  const [authUser, isLoadingAuthUser] = useAuthState(auth);
  const [userData, isLoadingUserData] = useDocumentData(
    authUser ? doc(getFirestore(), `/users/${authUser.uid}`) : null
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  async function login() {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;

      await setDoc(doc(getFirestore(), `/users/${result.user.uid}`), {
        uid: result.user.uid,
      });
    } catch (error) {
      setErrors([errors]);
      // // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // // The email of the user's account used.
      // const email = error.email;
      // // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
      setErrors([errors]);
      return false;
    }
    return true;
  }

  return (
    <FirebaseAuthContext.Provider
      value={{
        user: userData && authUser ? { ...userData, ...authUser } : null,
        login,
        logout,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
}
