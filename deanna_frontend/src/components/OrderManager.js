// deanna_frontend/src/components/OrderManager.js
import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/api';
import './OrderManager.css'; // On va créer ce fichier de style

function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError("Impossible de charger les commandes. Veuillez vous reconnecter.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Chargement des commandes...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="order-manager-container">
      <h2>Gestion des Commandes</h2>
      {orders.length === 0 ? (
        <p>Aucune commande en attente pour le moment.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID Commande</th>
              <th>Client</th>
              <th>Statut</th>
              <th>Date de la commande</th>
              <th>Articles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer_username}</td>
                <td>{order.status}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <ul>
                    {order.items.map(item => (
                      <li key={item.id}>{item.quantity} x {item.product_name} ({item.price} €)</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button>Voir le détail</button>
                  <button>Mettre à jour le statut</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderManager;