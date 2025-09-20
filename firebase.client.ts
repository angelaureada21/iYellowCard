// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBB5kDqjDgbUJIvp2hRmYTAsiYOCWHzQ4A",
  authDomain: "iyellowcardv2.firebaseapp.com",
  projectId: "iyellowcardv2",
  storageBucket: "iyellowcardv2.appspot.com", // ✅ corrected domain
  messagingSenderId: "150799392919",
  appId: "1:150799392919:web:acd0f586d098c4b47549d2",
  measurementId: "G-GN8L7CDT17"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ Firestore ready
export const storage = getStorage(app); // ✅ Storage ready
