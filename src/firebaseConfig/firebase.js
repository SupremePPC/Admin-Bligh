// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB30EGSrAKggO5cdmgfdA-2vQ8ED-JbK5g",
  authDomain: "bligh-db.firebaseapp.com",
  projectId: "bligh-db",
  storageBucket: "bligh-db.appspot.com",
  messagingSenderId: "815890595279",
  appId: "1:815890595279:web:649a277f31fa0e1810a6ba",
  measurementId: "G-HR9ES4164Y"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 
export const storage = getStorage(app);