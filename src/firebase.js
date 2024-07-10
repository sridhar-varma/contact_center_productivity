// firebase.js

import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
    apiKey: "AIzaSyClqLfYqW-_r0L_JNkp4Wt9Lwn5m0KFvCA",
    authDomain: "netflix-clone-4d7a9.firebaseapp.com",
    projectId: "netflix-clone-4d7a9",
    storageBucket: "netflix-clone-4d7a9.appspot.com",
    messagingSenderId: "481917738325",
    appId: "1:481917738325:web:8936d5c60b2836cd47e3dc"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (error) {
    console.error("Error signing up:", error.message);
    toast.error(error.message);
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error logging in:", error.message);
    toast.error(error.message);
  }
};

const logout = () => {
  signOut(auth);
};

export { auth, db, signup, login, logout };
