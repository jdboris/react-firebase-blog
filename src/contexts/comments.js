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
import "../firebase";
import { addTypes, parseTypes } from "../utils/json";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { idConverter } from "../utils/firestore";

const CommentContext = createContext(null);

export function useComments() {
  return useContext(CommentContext);
}

function datesFirestoreToJs(thread) {
  return thread.comments
    ? {
        ...thread,
        comments: thread.comments.map(
          (comment) =>
            comment && {
              ...comment,
              ...(comment.date ? { date: comment.date.toDate() } : {}),
            }
        ),
      }
    : thread;
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
      doc(getFirestore(), `commentThreads/${id}`).withConverter(idConverter)
    );

    const [comments, isLoadingComments] = useCollectionData(
      query(
        collection(getFirestore(), `commentThreads/${id}/comments`),
        orderBy("date", "desc"),
        limit(50)
      ).withConverter(idConverter)
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
