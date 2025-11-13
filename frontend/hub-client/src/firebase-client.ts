// src/firebase-client.ts

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// !! IMPORTANT !!
// Remplacez par votre configuration Firebase (depuis la console)
const firebaseConfig = {
  apiKey: "AIzaSyD29XApBPSxoeLIPAoMyIXOOIQT0yNaQ7g",
  authDomain: "hubproject-15527.firebaseapp.com",
  projectId: "hubproject-15527",
  storageBucket: "hubproject-15527.firebasestorage.app",
  messagingSenderId: "586097458870",
  appId: "1:586097458870:web:024cfdd9758951783c7017",
  measurementId: "G-K8664XSJTB"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter les services dont vous avez besoin
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider(); // Pour la connexion Google [cite: 37]