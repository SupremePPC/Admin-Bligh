import {
  ref,
  uploadBytes,
  getDownloadURL as getStorageDownloadURL,
} from "firebase/storage";
import { storage } from "./firebase";

export async function uploadFile(uid, file, description) {
  // const sanitizedDescription = description.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const relativePath = `${uid}/${description}`;
  console.log(description, file, relativePath)
  const storageRef = ref(storage, relativePath);

  await uploadBytes(storageRef, file);
  
  return storageRef;  
}

export async function getDownloadURL(relativePath) {
  const storageRef = ref(storage, relativePath);
  const downloadURL = await getStorageDownloadURL(storageRef);
  console.log(relativePath, downloadURL)
  return downloadURL;
}
