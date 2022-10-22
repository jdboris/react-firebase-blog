import {
  getDownloadURL,
  ref,
  uploadBytes,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 as uuid } from "uuid";

const storage = getStorage();

/** Upload the given `File` object and return the download URL. */
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
