import {
  getDownloadURL,
  ref,
  uploadBytes,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 as uuid } from "uuid";

const storage = getStorage();

// /** Upload the given `File` object to Firebase Storage and return the download URL. */
export async function uploadFile(file, rawName = false) {
  const storageRef = ref(
    storage,
    rawName ? file.name : `${uuid()}/${file.name}`
  );

  // 'file' comes from the Blob or File API
  // NOTE: Firebase bug prevents `uploadBytes` from working with non-image files
  const snapshot = await uploadBytesResumable(storageRef, file, {});
  return await getDownloadURL(snapshot.ref);
}

/** Upload the given `File` object to Cloudflare Images and return the download URL. */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    process.env.REACT_APP_CLOUDFLARE_IMAGES_API_URL,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  return data.result.variants[data.result.variants.length - 1];
}
