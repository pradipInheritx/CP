import firebase from "firebase/compat";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getApp } from "firebase/app";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  appId: "1:784392547136:web:f626643a0bf3f18c7568a5",
  apiKey: "AIzaSyCuso_D_GR132hnrBPzxbIi66qDA4vuTRM",
  authDomain: "sportparliament-1f167.firebaseapp.com",
  databaseURL: "https://sportparliament-1f167-default-rtdb.firebaseio.com",
  projectId: "sportparliament-1f167",
  storageBucket: "sportparliament-1f167.appspot.com",
  messagingSenderId: "784392547136",
};

const sportParliament = firebase.initializeApp(firebaseConfig, 'sportParliament');

export const messaging = getMessaging();
export const db = getFirestore(sportParliament);
export const auth = getAuth();
export const functions = getFunctions(getApp());
export const storage = getStorage();

export default sportParliament;
