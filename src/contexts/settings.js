import {
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "../firebase";

const SettingsContext = createContext(null);

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ useFirebaseAuth, children }) {
  const { user } = useFirebaseAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const [socialLinks, isLoadingSoacialLinks] = useCollectionData(
    collection(getFirestore(), `settings/social/links`)
  );

  useEffect(() => {
    setIsLoading(isLoadingSoacialLinks);
  }, [isLoadingSoacialLinks]);

  useEffect(() => {
    if (errors && errors.length) {
      console.error(errors);
    }
  }, [errors]);

  async function saveSocialLink(socialLink) {
    if (!user.isAdmin || isLoading || isLoadingSoacialLinks) return;

    try {
      setIsLoading(true);

      const docRef = socialLink.uid
        ? doc(getFirestore(), `settings/social/links/${socialLink.uid}`)
        : doc(collection(getFirestore(), `settings/social/links`));

      const data = {
        // Default
        sortOrder: socialLinks.length + 1,
        ...socialLink,
        uid: docRef.id,
      };

      await setDoc(docRef, data, { merge: true });
      return data;
    } catch (error) {
      setErrors([error]);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteSocialLink(socialLink) {
    if (!user.isAdmin || isLoading || isLoadingSoacialLinks) return;

    try {
      setIsLoading(true);
      await deleteDoc(
        doc(getFirestore(), `settings/social/links/${socialLink.uid}`)
      );
      return true;
    } catch (error) {
      setErrors([error]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        isLoading,
        socialLinks: socialLinks || [],
        saveSocialLink,
        deleteSocialLink,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
