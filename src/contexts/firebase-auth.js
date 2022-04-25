import "../firebase";
import { createContext, useContext, useState } from "react";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

const FirebaseAuthContext = createContext(null);

export function useFirebaseAuth() {
  return useContext(FirebaseAuthContext);
}

export function FirebaseAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);

  async function login() {
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // The signed-in user info.
      setUser(result.user);
    } catch (error) {
      setErrors([errors]);
      return false;
      // // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // // The email of the user's account used.
      // const email = error.email;
      // // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
    }

    return true;
  }

  async function logout() {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      setErrors([errors]);
      return false;
    }
    return true;
  }

  return (
    <FirebaseAuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
}
