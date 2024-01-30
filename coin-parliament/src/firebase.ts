import firebase from "firebase/compat/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getApp, initializeApp } from "firebase/app";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `coin-parliament-staging.firebaseapp.com`,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: `G-${process.env.REACT_APP_FIREBASE_MEASUREMENT_ID}`,
};

firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);

export const messaging = (async () => {
  try {
    const isSupportedBrowser = await isSupported();
    console.log(isSupportedBrowser, 'token');
    if (isSupportedBrowser) {
      return getMessaging();
    }
    console.log('Firebase not supported this browser');
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
})();
export const firestore = getFirestore(app);
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