import { 
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from './firebase.js';

// تسجيل مستخدم جديد
export async function signUp(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await addUserToDatabase(userCredential.user.uid, username, email);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

// تسجيل الدخول
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

// تسجيل الخروج
export async function logout() {
  await signOut(auth);
}

// مراقبة حالة المستخدم
export function onAuthStateChangedListener(callback) {
  return onAuthStateChanged(auth, callback);
}

// إضافة مستخدم إلى قاعدة البيانات
async function addUserToDatabase(uid, username, email) {
  await setDoc(doc(db, "users", uid), {
    username,
    email,
    createdAt: new Date(),
    lastLogin: new Date()
  });
}
