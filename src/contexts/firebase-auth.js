import "../firebase";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";

const auth = getAuth();
const provider = new GoogleAuthProvider();

const FirebaseAuthContext = createContext(null);

export function useFirebaseAuth() {
  return useContext(FirebaseAuthContext);
}

export function FirebaseAuthProvider({ children }) {
  const [errors, setErrors] = useState([]);
  // Ignore the "photoURL" because it doesn't follow camel-case rules (replace it with user data)
  const [authUserData, isLoadingAuthUser] = useAuthState(auth);
  const { photoURL, ...authUser } = authUserData || {};
  const [userData, isLoadingUserData] = useDocumentData(
    authUser ? doc(getFirestore(), `/users/${authUser.uid}`) : null
  );

  const isLoading = useMemo(
    () => isLoadingAuthUser || isLoadingUserData,
    [isLoadingAuthUser, isLoadingUserData]
  );

  async function login() {
    if (isLoading) return;

    try {
      // setIsLoading(true);
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;

      const user = (
        await getDoc(doc(getFirestore(), `users/${result.user.id}`))
      ).data() || { ...result.user, id: result.user.uid };

      // Save the auth user data if no user exists yet
      await setDoc(
        doc(getFirestore(), `/users/${user.id}`),
        {
          id: user.id,
          displayName: user.displayName,
          photoUrl: user.photoUrl || user.photoURL || "/default-user.jpg",
        },
        { merge: true }
      );
    } catch (error) {
      setErrors([error]);
      // // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // // The email of the user's account used.
      // const email = error.email;
      // // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
    } finally {
      // setIsLoading(false);
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
      // setErrors([error]);
      // return false;
    }
    return true;
  }

  return (
    <FirebaseAuthContext.Provider
      value={{
        currentUser:
          userData && authUser
            ? {
                ...authUser,
                ...userData,
              }
            : null,
        login,
        logout,
        isLoading,
        errors,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
}
