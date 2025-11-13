// Dans un composant React (ex: Dashboard.tsx)

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Notre hook
import axios from 'axios';
import BookingForm from './BookingForm';

// L'URL de votre API sur Cloud Run (ou http://localhost:8080 en local)
const API_URL = 'https://ledorat-api-586097458870.europe-west1.run.app';

const Dashboard = () => {
  const { user, getToken } = useAuth();
  const [message, setMessage] = useState('Chargement...');

  useEffect(() => {
    if (!user) return; // Ne rien faire si l'utilisateur n'est pas connecté

    const fetchProtectedData = async () => {
      try {
        // 1. Récupérer le Token JWT de l'utilisateur 
        const token = await getToken();
        if (!token) throw new Error('Pas de token');

        // 2. Appeler l'API avec le token dans l'en-tête 
        const response = await axios.get(`${API_URL}/api/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // 3. Afficher la réponse de l'API sécurisée
        setMessage(response.data); // ex: "Bonjour, utilisateur@email.com..."
      } catch (error) {
        console.error(error);
        setMessage('Accès refusé ou erreur API');
      }
    };

    fetchProtectedData();
  }, [user, getToken]);

  if (!user) return <div>Veuillez vous connecter.</div>;

  return (
    <div>
      <h2>Tableau de Bord (Route Protégée)</h2>
      <p>Message de l'API: <strong>{message}</strong></p>

      <hr /> {/* Séparateur */}

      {/* 2. Ajoutez le formulaire */}
      <BookingForm />

    </div>
  );
};

export default Dashboard;