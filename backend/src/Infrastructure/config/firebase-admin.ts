import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

const app = initializeApp({
  credential: applicationDefault(),
})

export const db: Firestore = getFirestore(app);
export const firebaseAuth: Auth = getAuth(app);
export const firestoreDB: Firestore = getFirestore(app);
