// src/components/Connexion.tsx

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-client'; // Importez votre auth Firebase
import { useNavigate } from 'react-router-dom'; // Pour la redirection

const Connexion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Pour afficher les erreurs
  const navigate = useNavigate(); // Hook pour la redirection

  // Gère la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(null); // Réinitialise les erreurs

    try {
      // Tente de connecter l'utilisateur avec Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      // Si la connexion réussit:
      // L'AuthProvider (dans AuthContext) détectera
      // automatiquement le changement et mettra à jour l'état.
      
      // Redirige l'utilisateur vers le tableau de bord
      navigate('/dashboard');

    } catch (err: any) {
      // Gère les erreurs de Firebase
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email ou mot de passe incorrect.');
      } else {
        setError('Une erreur est survenue lors de la connexion.');
      }
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>

      {/* Affiche un message d'erreur s'il y en a un */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Optionnel: Lien vers la page d'inscription */}
      {/* <p>Pas encore de compte ? <Link to="/inscription">Inscrivez-vous</Link></p> */}
    </div>
  );
};

export default Connexion;