
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "movie-booking-app-16792.firebaseapp.com",
  projectId: "movie-booking-app-16792",
  storageBucket: "movie-booking-app-16792.firebasestorage.app",
  messagingSenderId: "642087407626",
  appId: "1:642087407626:web:185ffb223e029783064ff3",
  measurementId: "G-ECNXMYFF51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);