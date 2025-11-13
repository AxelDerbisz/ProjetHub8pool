// functions/src/index.ts

import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

admin.initializeApp();

/**
 * Se déclenche à la création d'un nouvel utilisateur Firebase Auth.
 * Crée un document 'user' correspondant dans Firestore.
 */
export const onCreateUser = functions.auth.user().onCreate(async (user) => {
  const { uid, email } = user;

  const userProfile = {
    uid,
    email,
    role: 'member', // Rôle par défaut
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    await admin.firestore().collection('users').doc(uid).set(userProfile);
    console.log(`Profil utilisateur créé dans Firestore pour ${uid}`);
  } catch (error) {
    console.error(`Erreur création Firestore pour ${uid}:`, error);
  }
});
