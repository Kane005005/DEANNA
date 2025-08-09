// deanna_frontend/src/components/CreateShopForm.js
import React, { useState } from 'react';
import { registerMerchant } from '../services/api';
import '../Form.css';

function CreateShopForm() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        category: '',
        username: '',
        password: '',
        confirmPassword: '',
        country: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Séparer "Prénom et nom" en deux champs pour le backend
        const [first_name, last_name] = formData.first_name.split(' ');
        
        if (formData.password !== formData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }

        const dataToSend = {
            username: formData.username,
            first_name: first_name,
            last_name: last_name || '', // Assure-toi que last_name n'est pas undefined
            email: formData.email,
            phone_number: formData.phone_number,
            country: formData.country,
            password: formData.password,
            category: formData.category,
        };

        try {
            const response = await registerMerchant(dataToSend);
            console.log("Réponse de l'API :", response.data);
            alert("Boutique créée avec succès !");
            // Optionnel : Rediriger l'utilisateur après l'inscription
            // navigate('/acceder-boutique');
        } catch (error) {
            console.error("Erreur d'inscription :", error.response.data);
            alert("Erreur lors de la création de la boutique.");
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Créer une boutique</h2>
            <form className="form" onSubmit={handleSubmit}>
                <label className="form-label">
                    Prénom:
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </label>
                    <label className="form-label">
                    Nom:
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </label>
                
                <label className="form-label">
                    Pays:
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </label>
                <label className="form-label">
                    Adresse mail:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </label>
                <label className="form-label">
                    Téléphone:
                    <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </label>
                <label className="form-label">
                    Catégorie de boutique:
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </label>
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
                <label className="form-label">
                    Confirmer le mot de passe:
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </label>
                <button type="submit" className="form-button create-button">Créer ma boutique</button>
            </form>
        </div>
    );
}

export default CreateShopForm;