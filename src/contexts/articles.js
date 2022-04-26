import {
  collection,
  doc,
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
    console.log(errors);
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
            limit(1)
          )
        )
      ).docs[0]?.data();
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

      await setDoc(docRef, data);
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
        getMostRecent,
        isLoading,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
}
