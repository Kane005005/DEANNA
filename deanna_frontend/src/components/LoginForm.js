// src/components/LoginForm.js
import React, { useState } from 'react';
import { login } from '../services/api'; 
import { useNavigate } from 'react-router-dom'; // <-- Ajoute cette ligne pour la redirection
import '../Form.css';

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate(); // <-- Initialise la fonction de navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({
        username: formData.username,
        password: formData.password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      console.log("Connexion réussie ! Tokens stockés.");
      alert("Connexion réussie !");

      // Rediriger l'utilisateur vers le tableau de bord
      navigate('/dashboard'); // <-- Appelle navigate pour rediriger

    } catch (error) {
      console.error("Erreur de connexion :", error.response.data);
      alert("Erreur de connexion : vérifiez vos identifiants.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Accéder à ma boutique</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
          Nom d'utilisateur:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>
        <label className="form-label">
          Mot de passe:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>
        <button type="submit" className="form-button access-button">Se connecter</button>
      </form>
    </div>
  );
}

export default LoginForm;