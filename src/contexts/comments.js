import {
  addDoc,
  collection,
  doc,
  getFirestore,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import "../firebase";
import { idAndDateConverter } from "../utils/firestore";
import { addTypes, parseTypes } from "../utils/json";

const CommentContext = createContext(null);

export function useComments() {
  return useContext(CommentContext);
}

export function CommentProvider({ useFirebaseAuth, children }) {
  const { user } = useFirebaseAuth();

  const [errors, setErrors] = useState([]);

  async function newThread() {
    return await addDoc(collection(getFirestore(), `commentThreads`), {
      commentCount: 0,
    });
  }

  function useThread(id) {
    const [isLoading, setIsLoading] = useState(false);
    const [thread, isLoadingThread] = useDocumentData(
      doc(getFirestore(), `commentThreads/${id}`).withConverter(
        idAndDateConverter
      )
    );

    const [comments, isLoadingComments] = useCollectionData(
      query(
        collection(getFirestore(), `commentThreads/${id}/comments`),
        orderBy("date", "desc"),
        limit(50)
      ).withConverter(idAndDateConverter)
    );

    const [draft, setDraft] = useState(
      JSON.parse(
        localStorage.getItem(`commentDrafts[${id}]`),
        parseTypes([Date])
      )
    );

    function saveDraft(article) {
      setDraft(article);
      localStorage.setItem(
        `commentDrafts[${id}]`,
        JSON.stringify(article, addTypes([Date]))
      );
    }

    async function saveComment(comment) {
      if (isLoading) return;

      try {
        setIsLoading(true);

        await addDoc(
          collection(getFirestore(), `commentThreads/${id}/comments`),
          comment
        );

        return comment;
      } catch (error) {
        setErrors([error]);
      } finally {
        setIsLoading(false);
      }
    }

    return {
      thread: thread && comments && { ...thread, comments },
      isLoading: isLoading || isLoadingThread || isLoadingComments,
      draft,
      saveDraft,
      saveComment,
    };
  }

  useEffect(() => {
    if (errors && errors.length) {
      console.error(errors);
    }
  }, [errors]);

  return (
    <CommentContext.Provider
      value={{
        useThread,
        newThread,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
}
