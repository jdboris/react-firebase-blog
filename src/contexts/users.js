import { createContext, useContext, useEffect, useState } from "react";
import "../firebase";

import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

const UserContext = createContext(null);

export function useUsers() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (errors && errors.length) {
      console.error(errors);
    }
  }, [errors]);

  function useUser(id) {
    const [user] = useDocumentData(doc(getFirestore(), `users/${id}`));
    return { user: user || null };
  }

  async function saveUser(user) {
    // if (isLoading) return;

    try {
      // setIsLoading(true);

      await updateDoc(doc(getFirestore(), `users/${user.id}`), user);

      return user;
    } catch (error) {
      setErrors([error]);
    } finally {
      // setIsLoading(false);
    }
  }

  return (
    <UserContext.Provider
      value={{
        useUser,
        saveUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
