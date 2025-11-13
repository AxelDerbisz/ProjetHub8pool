// src/components/BookingForm.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Notre hook d'authentification

// L'URL de votre API Cloud Run (celle du fichier Dashboard.tsx)
const API_URL = 'https://ledorat-api-586097458870.europe-west1.run.app';

const BookingForm = () => {
  // Récupère les fonctions d'authentification
  const { getToken } = useAuth();

  // États du formulaire
  const [billiardId, setBilliardId] = useState('billiard_1'); // Ex: 'billiard_1', 'billiard_2'
  const [startTime, setStartTime] = useState(''); // Le 'T' est important pour le format
  const [endTime, setEndTime] = useState('');
  const [companions, setCompanions] = useState(''); // On stocke comme un string séparé par des virgules
  const [comment, setComment] = useState('');

  // États pour la communication
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // 1. Récupérer le token JWT de l'utilisateur
      const token = await getToken();
      if (!token) {
        throw new Error('Utilisateur non authentifié.');
      }

      // 2. Préparer les données
      const bookingData = {
        billiardId,
        startTime: new Date(startTime).toISOString(), // Convertit en format ISO
        endTime: new Date(endTime).toISOString(),
        companions: companions.split(',').filter(name => name.trim() !== ''), // Convertit le string en tableau
        comment,
      };

      await axios.post(`${API_URL}/api/bookings`, bookingData, {
        headers: {
          'Authorization': `Bearer ${token}`, // Envoie le token pour l'authentification
        },
      });

      setSuccess('Votre demande de réservation a été envoyée. Elle est en attente de validation.');
      setStartTime('');
      setEndTime('');
      setCompanions('');
      setComment('');

    } catch (err: any) {
      console.error('Erreur lors de la réservation:', err);
      setError(err.response?.data || err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Demander une réservation</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="billiardId">Billard:</label>
          <select 
            id="billiardId" 
            value={billiardId} 
            onChange={(e) => setBilliardId(e.target.value)}
          >
            <option value="billiard_1">Billard 1 (Compétition)</option>
            <option value="billiard_2">Billard 2 (Loisir)</option>
          </select>
        </div>

        <div>
          <label htmlFor="startTime">Début:</label>
          <input 
            type="datetime-local" 
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="endTime">Fin:</label>
          <input 
            type="datetime-local" 
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="companions">Accompagnants (séparés par une virgule):</label>
          <input 
            type="text" 
            id="companions"
            value={companions}
            onChange={(e) => setCompanions(e.target.value)}
            placeholder="Ex: Jean Dupont, Marie Durand"
          />
        </div>

        <div>
          <label htmlFor="comment">Commentaire (optionnel):</label>
          <textarea 
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Envoi...' : 'Envoyer la demande'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
};

export default BookingForm;