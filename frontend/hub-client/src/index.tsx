// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // <-- 1. IMPORT IT
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter> {/* <-- 2. WRAP YOUR APP WITH IT */}
        <App />
      </BrowserRouter> {/* <-- 3. END WRAPPER */}
    </AuthProvider>
  </React.StrictMode>
);