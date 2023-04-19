import firebase from "firebase/compat";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getApp } from "firebase/app";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDLKqQ1J-m6YPVLhLYTd_OZFLHUoWu6qSU",
  authDomain: "stockparliament.firebaseapp.com",
  projectId: "stockparliament",
  storageBucket: "stockparliament.appspot.com",
  messagingSenderId: "1057846249810",
  appId: "1:1057846249810:web:86084888813a2ef3c9128b"
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: 'coinparliament.com',
  // databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  // projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
  // storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // measurementId: `G-${process.env.REACT_APP_FIREBASE_MEASUREMENT_ID}`,
};

firebase.initializeApp(firebaseConfig);

export const messaging = getMessaging();
export const db = getFirestore();
export const auth = getAuth();
export const functions = getFunctions(getApp());
export const storage = getStorage();
// if (window.location.hostname === "localhost") {
//   connectFirestoreEmulator(db, "localhost", 8080);
//   connectAuthEmulator(auth, "http://localhost:9099");
//   connectFunctionsEmulator(functions, "localhost", 5001);
//   connectStorageEmulator(storage, "localhost", 9199);
// }

export default firebase;
