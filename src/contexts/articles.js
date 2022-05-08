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

function datesFirestoreToJs(article) {
  return { ...article, date: article.date.toDate() };
}

function datesJsonToJs(article) {
  return { ...article, date: new Date(article.date) };
}

export function ArticleProvider({ useFirebaseAuth, children }) {
  const { user } = useFirebaseAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [draft, setDraft] = useState(
    datesJsonToJs(JSON.parse(localStorage.getItem("articleDraft")))
  );

  function saveDraft(article) {
    setDraft(article);
    return localStorage.setItem("articleDraft", JSON.stringify(article));
  }

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
      ).docs.map((snapshot) => datesFirestoreToJs(snapshot.data()));
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

      return datesFirestoreToJs(
        (await getDoc(doc(getFirestore(), `articles/${uid}`))).data()
      );
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
        draft,
        saveDraft,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
}
