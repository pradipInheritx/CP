import firebase from "firebase/compat";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getApp } from "firebase/app";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyApt5BFOa4BBoUizrB16chWY8MuVWClfE4",
//   authDomain: "coin-parliament-staging.firebaseapp.com",
//   databaseURL: "https://coin-parliament-staging-default-rtdb.firebaseio.com",
//   projectId: "coin-parliament-staging",
//   storageBucket: "coin-parliament-staging.appspot.com",
//   messagingSenderId: "950952702753",
//   appId: "1:950952702753:web:2b6c0fb79b5d54bdb2c460",
//   measurementId: "G-SZJ13ERGR5"
// };

const firebaseConfig = {
  apiKey: "AIzaSyDZvpoggvWLqqr-QUhOxOyq4n5aaoiWMXk",
  authDomain: "coinparliament-51ae1.firebaseapp.com",
  databaseURL: "https://coinparliament-51ae1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "coinparliament-51ae1",
  storageBucket: "coinparliament-51ae1.appspot.com",
  messagingSenderId: "742294999580",
  appId: "1:742294999580:web:f3eb1c39c3e6115cf7c5d9",
  measurementId: "G-P1FFENZFSM"
};


const coinParliament = firebase.initializeApp(firebaseConfig, 'coinParliament');

export const messaging = (async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging();
    }
    console.log('SportFirebase not supported this browser');
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
})();
export const db = getFirestore(coinParliament);
export const auth = getAuth();
export const functions = getFunctions(getApp());
export const storage = getStorage();

export default coinParliament;
