import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import { v4 as uuid } from "uuid";

const storage = getStorage();

/** Upload the given `File` object and return the download URL. */
export async function uploadFile(file) {
  const storageRef = ref(storage, `${uuid()}/${file.name}`);

  // 'file' comes from the Blob or File API
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}
