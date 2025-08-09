// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Le chemin vers le fichier de style

function HomePage() {
  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <h1 className="title">Bienvenue sur <span className="highlight-text">Déanna</span></h1>
        <p className="slogan">mon commerce en un clic, vendez plus, stressez moins</p>
        <div className="button-container">
          <Link to="/creer-boutique" className="button create-button">Créer ma boutique</Link>
          <Link to="/acceder-boutique" className="button access-button">Accéder à ma boutique</Link>
          <Link to="/visiter-boutiques" className="button visit-button">Visiter les boutiques</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;