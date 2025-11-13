// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importez vos composants/pages
import Dashboard from './component/dashboard'; // Votre composant dashboard
import ProtectedRoute from './component/protectedRoutes'; // Votre gardien
import Connexion from './component/connexion'; // Votre page de connexion
import Register from './component/register'
import Inscription from './component/register';
// import Inscription from './components/Inscription';
// import PageAccueil from './components/PageAccueil';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* --- Routes Publiques --- */}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} /> {/* <-- 2. Ajoutez la route */}

        {/* --- Routes Protégées --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;