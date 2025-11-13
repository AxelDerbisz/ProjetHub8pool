// src/components/Inscription.tsx

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-client'; // Importez votre auth Firebase
import { Link, useNavigate } from 'react-router-dom';

const Inscription = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Ajout d'une validation simple du mot de passe
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    try {
      // 1. Crée l'utilisateur dans Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);

      // 2. Votre Cloud Function 'onCreateUser' est automatiquement
      //    déclenchée en arrière-plan pour créer le profil Firestore.

      setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      
      // Optionnel : redirige automatiquement après 2 secondes
      setTimeout(() => {
        navigate('/connexion');
      }, 2000);

    } catch (err: any) {
      // Gère les erreurs
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé.');
      } else {
        setError('Une erreur est survenue lors de la création du compte.');
      }
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
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
        <button type="submit">S'inscrire</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <p>Déjà un compte ? <Link to="/connexion">Connectez-vous</Link></p>
    </div>
  );
};

export default Inscription;