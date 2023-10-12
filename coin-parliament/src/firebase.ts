import firebase from "firebase/compat";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getApp } from "firebase/app";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyCue00Wo85m496pIcl6uJJUi0cRgJMk6pw",
  authDomain: "votingparliament.firebaseapp.com",
  databaseURL: "https://votingparliament-default-rtdb.firebaseio.com",
  projectId: "votingparliament",
  storageBucket: "votingparliament.appspot.com",
  messagingSenderId: "839366544010",
  appId: "1:839366544010:web:17ac42a8b2638683037b73",
  measurementId: "G-DHSC2TMRZV"
};

firebase.initializeApp(firebaseConfig);

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