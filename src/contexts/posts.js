import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { createContext, useContext, useState } from "react";
import "../firebase";

const PostContext = createContext(null);

export function usePosts() {
  return useContext(PostContext);
}

export function PostProvider({ children, user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  async function save(post) {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const docRef = post.uid
        ? doc(getFirestore(), `posts/${post.uid}`)
        : doc(collection(getFirestore(), `posts`));

      await setDoc(docRef, { ...post, uid: docRef.id });

      return { ...post, uid: docRef.id };
    } catch (error) {
      console.error(error);
      setErrors([errors]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PostContext.Provider
      value={{
        save,
        isLoading,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
