// /app/services/firebase.service.js
import { initializeApp } from "firebase/app";
import { doc, GeoPoint, getFirestore, updateDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

// IMPORTANT: Replace this with your actual Firebase Web App config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};

// Initialize Firebase Client App
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const db = getFirestore(app);

// Export necessary tools for other services
export { db, doc, functions, GeoPoint, httpsCallable, updateDoc };
