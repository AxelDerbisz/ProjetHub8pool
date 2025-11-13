// src/routes/booking.controller.ts

import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js'; // Importez votre type
import { firestoreDB } from '../config/firebase-admin.js'; // Importez la BDD admin

/**
 * Crée une nouvelle demande de réservation (status: 'pending')
 */
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    // 1. Récupérer l'ID de l'utilisateur (grâce au middleware) [cite: 51]
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).send('Authentification invalide.');
    }

    // 2. Récupérer les données du corps de la requête
    const { billiardId, startTime, endTime, companions, comment } = req.body;

    // 3. Validation simple (à améliorer)
    if (!billiardId || !startTime || !endTime) {
      return res.status(400).send('Données de réservation manquantes.');
    }

    //
    // --- ICI: LOGIQUE MÉTIER  ---
    //
    // TODO: Vérifier la règle des 24h [cite: 52]
    // TODO: Vérifier la disponibilité (pas de collision) [cite: 53]
    // TODO: Vérifier les créneaux bloqués (ex: mardi soir) [cite: 54]
    //
    // Pour l'instant, nous allons créer la réservation directement
    
    // 4. Préparer le document de réservation
    const newBooking = {
      userId: userId,
      billiardId: billiardId,
      startTime: startTime,
      endTime: endTime,
      companions: companions || [],
      comment: comment || '',
      status: 'pending', // La réservation est en attente de validation [cite: 55]
      createdAt: new Date().toISOString(), // Timestamp de la demande
    };

    // 5. Enregistrer dans Firestore
    const docRef = await firestoreDB.collection('bookings').add(newBooking);

    // 6. Répondre au client
    res.status(201).send({ id: docRef.id, ...newBooking });

  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    res.status(500).send('Erreur serveur lors de la création de la réservation.');
  }
};