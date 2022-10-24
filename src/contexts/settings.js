import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
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

  const [business, isLoadingBusiness] = useDocumentData(
    doc(getFirestore(), `settings/business`)
  );

  const [logo, isLoadingLogo] = useDocumentData(
    doc(getFirestore(), `settings/logo`)
  );

  const [homeBackground, isLoadingHomeBackground] = useDocumentData(
    doc(getFirestore(), `settings/homeBackground`)
  );

  useEffect(() => {
    setIsLoading(isLoadingSoacialLinks || isLoadingBusiness || isLoadingLogo);
  }, [isLoadingSoacialLinks, isLoadingBusiness, isLoadingLogo]);

  useEffect(() => {
    if (errors && errors.length) {
      console.error(errors);
    }
  }, [errors]);

  async function saveLogo(logo) {
    if (
      !currentUser.isAdmin ||
      isLoading ||
      isLoadingLogo ||
      isLoadingHomeBackground
    )
      return;

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

  async function saveHomeBackground(homeBackground) {
    if (
      !currentUser.isAdmin ||
      isLoading ||
      isLoadingLogo ||
      isLoadingHomeBackground
    )
      return;

    try {
      setIsLoading(true);

      await setDoc(
        doc(getFirestore(), `settings/homeBackground`),
        homeBackground
      );
      return homeBackground;
    } catch (error) {
      setErrors([error]);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveBusiness(business) {
    if (!currentUser.isAdmin || isLoading || isLoadingLogo) return;

    try {
      setIsLoading(true);

      await setDoc(doc(getFirestore(), `settings/business`), business);
      return business;
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

      const docRef = socialLink.id
        ? doc(getFirestore(), `settings/social/links/${socialLink.id}`)
        : doc(collection(getFirestore(), `settings/social/links`));

      const data = {
        sortOrder: Math.max(...socialLinks.map((link) => link.sortOrder)) + 1,
        ...socialLink,
        id: docRef.id,
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
    if (
      !currentUser.isAdmin ||
      isLoading ||
      isLoadingSoacialLinks ||
      isLoadingLogo
    )
      return;

    try {
      setIsLoading(true);
      await deleteDoc(
        doc(getFirestore(), `settings/social/links/${socialLink.id}`)
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
        homeBackground,
        business,
        socialLinks: socialLinks
          ? socialLinks.sort((a, b) => a.sortOrder - b.sortOrder)
          : [],
        saveSocialLink,
        saveLogo,
        saveBusiness,
        saveHomeBackground,
        deleteSocialLink,
        uploadFile,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
