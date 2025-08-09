// deanna_frontend/src/components/ShopDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getShopDetails, getShopProducts } from '../services/api'; // On va créer ces fonctions
import './ShopDetail.css';

function ShopDetail() {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const [shopResponse, productsResponse] = await Promise.all([
          getShopDetails(shopId),
          getShopProducts(shopId),
        ]);
        setShop(shopResponse.data);
        setProducts(productsResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Impossible de charger les détails de la boutique.");
        setLoading(false);
      }
    };

    fetchShopData();
  }, [shopId]);

  if (loading) {
    return <div>Chargement des détails de la boutique...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  const handleAddToCart = (product) => {
      // Logique pour ajouter au panier
      alert(`${product.name} ajouté au panier !`);
  };

  return (
    <div className="shop-detail-container">
      <h2 className="shop-title">Boutique de {shop.owner_username}</h2>
      <p className="shop-category">Catégorie : {shop.category}</p>
      <hr />
      <h3>Nos produits</h3>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <p className="product-price">{product.price} €</p>
            <button onClick={() => handleAddToCart(product)} className="add-to-cart-button">
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopDetail;