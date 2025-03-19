
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBapnMz5juPhEOnbZ6nj-FsZhZirJeXdI0",
  authDomain: "note-bot-51ab3.firebaseapp.com",
  projectId: "note-bot-51ab3",
  storageBucket: "note-bot-51ab3.firebasestorage.app",
  messagingSenderId: "930060439970",
  appId: "1:930060439970:web:9e76d6ef45985724c1e2fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
