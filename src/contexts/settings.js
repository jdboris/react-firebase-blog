import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { createContext, useContext, useEffect, useState } from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { v4 as uuid } from "uuid";
import "../firebase";
import { uploadFile } from "../utils/files";

const storage = getStorage();

const SettingsContext = createContext(null);

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ useFirebaseAuth, children }) {
  const { currentUser } = useFirebaseAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const [socialLinks, isLoadingSoacialLinks] = useCollectionData(
    collection(getFirestore(), `settings/social/links`)
  );

  const [logo, isLoadingLogo] = useDocumentData(
    doc(getFirestore(), `settings/logo`)
  );

  useEffect(() => {
    setIsLoading(isLoadingSoacialLinks);
  }, [isLoadingSoacialLinks]);

  useEffect(() => {
    if (errors && errors.length) {
      console.error(errors);
    }
  }, [errors]);

  async function saveLogo(logo) {
    if (!currentUser.isAdmin || isLoading || isLoadingLogo) return;

    try {
      setIsLoading(true);

      await setDoc(doc(getFirestore(), `settings/logo`), logo);
      return logo;
    } catch (error) {
      setErrors([error]);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveSocialLink(socialLink) {
    if (!currentUser.isAdmin || isLoading || isLoadingSoacialLinks) return;

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
    if (!currentUser.isAdmin || isLoading || isLoadingSoacialLinks) return;

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
        logo,
        socialLinks: socialLinks || [],
        saveSocialLink,
        saveLogo,
        deleteSocialLink,
        uploadFile,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
