// deanna_frontend/src/components/ShopList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getShops } from '../services/api'; // On va créer cette fonction
import './ShopList.css'; // On va créer ce fichier de style

function ShopList() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await getShops();
        setShops(response.data);
        setLoading(false);
      } catch (err) {
        setError("Impossible de charger les boutiques.");
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  if (loading) {
    return <div>Chargement des boutiques...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="shop-list-container">
      <h2 className="page-title">Nos boutiques</h2>
      <div className="shop-grid">
        {shops.map(shop => (
          <div key={shop.id} className="shop-card">
            <h3>{shop.owner_username}'s Boutique</h3>
            <p>Catégorie : {shop.category}</p>
            <Link to={`/boutique/${shop.id}`} className="view-shop-button">
              Visiter la boutique
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopList;