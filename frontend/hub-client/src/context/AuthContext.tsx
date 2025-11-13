// src/context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, getIdToken } from 'firebase/auth';
import { auth } from '../firebase-client';

interface AuthContextType {
  user: User | null; // L'objet User de Firebase
  loading: boolean;
  getToken: () => Promise<string | null>; // Fonction pour récupérer le JWT 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] =useState(true);

  // Écoute les changements d'état de connexion
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe; // Nettoyage au démontage
  }, []);

  // Fonction pour obtenir le Token JWT de l'utilisateur
  const getToken = async (): Promise<string | null> => {
    if (!user) return null;
    return await getIdToken(user);
  };

  const value = { user, loading, getToken };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour accéder facilement au contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};