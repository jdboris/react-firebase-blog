import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { v4 as uuid } from "uuid";
import "../firebase";

const storage = getStorage();

const SettingsContext = createContext(null);

export function useSettings() {
  return useContext(SettingsContext);
}

// Upload the given `File` object and return the download URL.
export async function uploadIcon(file) {
  const storageRef = ref(storage, `${uuid()}/${file.name}`);

  // 'file' comes from the Blob or File API
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
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
        uploadIcon,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
