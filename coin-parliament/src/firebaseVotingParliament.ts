import firebase from "firebase/compat/app";
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


const votingParliament = firebase.initializeApp(firebaseConfig, 'votingParliament');

export const messaging = (async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging();
    }
    console.log('votingFirebase not supported this browser');
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
})();
export const db = getFirestore(votingParliament);
export const auth = getAuth();
export const functions = getFunctions(getApp());
export const storage = getStorage();

export default votingParliament;
