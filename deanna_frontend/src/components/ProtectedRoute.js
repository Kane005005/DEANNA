// deanna_frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // On vérifie si un token d'accès existe dans le localStorage
  const isAuthenticated = localStorage.getItem('access_token');

  // Si l'utilisateur est authentifié, on affiche les enfants (la page demandée)
  if (isAuthenticated) {
    return children;
  }

  // Sinon, on le redirige vers la page de connexion
  return <Navigate to="/acceder-boutique" />;
}

export default ProtectedRoute;