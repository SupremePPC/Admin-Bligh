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
  apiKey: "AIzaSyAhzx8fwClp6CyRA6WvuTGyGTaAS96-Tzs",
  authDomain: "account-db-3a21d.firebaseapp.com",
  projectId: "account-db-3a21d",
  storageBucket: "account-db-3a21d.appspot.com",
  messagingSenderId: "1007794138620",
  appId: "1:1007794138620:web:99f3137c6df04983e99679",
  measurementId: "G-CKT5MSTPPK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 
export const storage = getStorage(app);