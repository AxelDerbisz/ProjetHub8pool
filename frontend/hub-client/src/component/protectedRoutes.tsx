// src/components/ProtectedRoute.tsx  (Nouveau fichier)

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importez votre hook

const ProtectedRoute = () => {
  const { user, loading } = useAuth(); // Récupère l'utilisateur et l'état de chargement

  // 1. Si on charge encore l'état de l'utilisateur, on patiente
  if (loading) {
    return <div>Chargement de l'authentification...</div>;
  }

  // 2. Si l'utilisateur n'est PAS connecté, on le redirige
  if (!user) {
    // replace: évite de pouvoir faire "retour" à la page protégée
    return <Navigate to="/connexion" replace />; 
  }

  // 3. Si l'utilisateur EST connecté, on affiche le composant enfant
  // <Outlet /> est un composant de React Router qui dit:
  // "Affiche le composant de la route enfant" (dans notre cas, Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;