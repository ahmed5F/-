import { db } from './firebase.js';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// إضافة منشور جديد
export async function addPost(userId, content, imageUrl = null) {
  const postRef = doc(collection(db, "posts"));
  await setDoc(postRef, {
    userId,
    content,
    imageUrl,
    likes: [],
    comments: [],
    createdAt: new Date()
  });
  return postRef.id;
}

// الحصول على المنشورات
export function getPosts(callback) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    callback(posts);
  });
}

// إضافة تعليق
export async function addComment(postId, userId, comment) {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    comments: arrayUnion({
      userId,
      comment,
      createdAt: new Date()
    })
  });
}

// إعجاب بالمنشور
export async function likePost(postId, userId) {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likes: arrayUnion(userId)
  });
}
