// src/config/firebase-admin.ts

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

/**
 * Initialise le SDK Admin.
 * Sur Cloud Run, il n'y a pas besoin de fichier de clé JSON.
 * Il utilise automatiquement les credentials du service.
 */
const app = initializeApp({
  credential: applicationDefault(),
});

export const firebaseAuth: Auth = getAuth(app);
export const firestoreDB: Firestore = getFirestore(app);
