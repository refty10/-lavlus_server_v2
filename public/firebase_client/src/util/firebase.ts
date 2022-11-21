// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQOdv6KZ8hoHMCAaPs4SpJLx58a75u8NY",
  authDomain: "lavlus.firebaseapp.com",
  projectId: "lavlus",
  storageBucket: "lavlus.appspot.com",
  messagingSenderId: "687722612491",
  appId: "1:687722612491:web:9b1ecd644ad5d2d969040e",
  measurementId: "G-C6ZTCVMF64",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);
