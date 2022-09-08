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
import { idAndDateConverter } from "../utils/firestore";
import { addTypes, parseTypes } from "../utils/json";

const ArticleContext = createContext(null);

export function useArticles() {
  return useContext(ArticleContext);
}

export function ArticleProvider({ useFirebaseAuth, useComments, children }) {
  const { user } = useFirebaseAuth();
  const { newThread } = useComments();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const [draft, setDraft] = useState(
    JSON.parse(localStorage.getItem("articleDraft"), parseTypes([Date]))
  );

  function saveDraft(article) {
    setDraft(article);
    localStorage.setItem(
      "articleDraft",
      JSON.stringify(article, addTypes([Date]))
    );
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
          ).withConverter(idAndDateConverter)
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

      return (
        await getDoc(
          doc(getFirestore(), `articles/${uid}`).withConverter(
            idAndDateConverter
          )
        )
      ).data();
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

      const thread = await newThread();

      const docRef = article.uid
        ? doc(getFirestore(), `articles/${article.uid}`)
        : doc(collection(getFirestore(), `articles`));

      const articleData = {
        ...article,
        authorName: user.displayName,
        commentThreadId: thread.id,
        uid: docRef.id,
        id: docRef.id,
      };
      await setDoc(docRef, articleData, { merge: true });

      return articleData;
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
