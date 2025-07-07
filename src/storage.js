import { storage } from './firebase.js';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// رفع صورة
export async function uploadImage(file, userId) {
  const storageRef = ref(storage, `images/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// رفع فيديو
export async function uploadVideo(file, userId) {
  const storageRef = ref(storage, `videos/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// رفع ملف صوتي
export async function uploadAudio(file, userId) {
  const storageRef = ref(storage, `audio/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
