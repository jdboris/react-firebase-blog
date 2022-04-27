import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import "../firebase";

const ArticleContext = createContext(null);

export function useArticles() {
  return useContext(ArticleContext);
}

export function ArticleProvider({ useFirebaseAuth, children }) {
  const { user } = useFirebaseAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (errors && errors.length) {
      console.error(errors);
    }
  }, [errors]);

  async function getMostRecent() {
    if (isLoading) return;

    try {
      setIsLoading(true);

      return (
        await getDocs(
          query(
            collection(getFirestore(), "articles"),
            orderBy("date", "desc"),
            limit(6)
          )
        )
      ).docs.map((snapshot) => snapshot.data());
    } catch (error) {
      setErrors([error]);
    } finally {
      setIsLoading(false);
    }
  }

  async function get(uid) {
    if (isLoading) return;

    try {
      setIsLoading(true);

      return (await getDoc(doc(getFirestore(), `articles/${uid}`))).data();
    } catch (error) {
      setErrors([error]);
    } finally {
      setIsLoading(false);
    }
  }

  async function save(article) {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const docRef = article.uid
        ? doc(getFirestore(), `articles/${article.uid}`)
        : doc(collection(getFirestore(), `articles`));

      const data = {
        ...article,
        authorName: user.displayName,
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

  return (
    <ArticleContext.Provider
      value={{
        save,
        get,
        getMostRecent,
        isLoading,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
}
