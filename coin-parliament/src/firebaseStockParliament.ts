import firebase from "firebase/compat";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getApp } from "firebase/app";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDLKqQ1J-m6YPVLhLYTd_OZFLHUoWu6qSU",
  authDomain: "stockparliament.firebaseapp.com",
  databaseURL: "https://stockparliament-default-rtdb.firebaseio.com",
  projectId: "stockparliament",
  storageBucket: "stockparliament.appspot.com",
  messagingSenderId: "1057846249810",
  appId: "1:1057846249810:web:86084888813a2ef3c9128b",
  measurementId: "G-MYEEBYEMGN"
};



const stockParliament = firebase.initializeApp(firebaseConfig, 'stockParliament');

export const messaging = (async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging();
    }
    console.log('StockFirebase not supported this browser');
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
})();
export const db = getFirestore(stockParliament);
export const auth = getAuth();
export const functions = getFunctions(getApp());
export const storage = getStorage();

export default stockParliament;
