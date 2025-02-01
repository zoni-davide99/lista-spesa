// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// La configurazione che trovi nel tuo Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDNMUdmRGnQl7uEh31Qp9bxqDEqWIHrJiA",
  authDomain: "listaspesa-2cb48.firebaseapp.com",
  projectId: "listaspesa-2cb48",
  storageBucket: "listaspesa-2cb48.firebasestorage.app",
  messagingSenderId: "106552038593",
  appId: "1:106552038593:web:9c65ed4e5c2c8fd3f07040"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Esporta Firestore e i metodi necessari
export { db, collection, addDoc, getDocs };
