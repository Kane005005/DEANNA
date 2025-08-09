import React from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
    alert("Vous êtes déconnecté !");
  };

  // Vérifie si un lien est actif
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-header">
          <h2 className="dashboard-title">Mon tableau de bord</h2>
          <div className="user-profile">
            <div className="user-avatar">AD</div>
            <span className="user-name">Admin</span>
          </div>
        </div>
        
        <ul className="dashboard-menu">
          <li>
            <Link 
              to="/dashboard" 
              className={`dashboard-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              <i className="icon-home"></i>
              <span>Accueil</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/products" 
              className={`dashboard-link ${isActive('/dashboard/products') ? 'active' : ''}`}
            >
              <i className="icon-products"></i>
              <span>Rayons & Produits</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/orders" 
              className={`dashboard-link ${isActive('/dashboard/orders') ? 'active' : ''}`}
            >
              <i className="icon-orders"></i>
              <span>Commandes</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/payments" 
              className={`dashboard-link ${isActive('/dashboard/payments') ? 'active' : ''}`}
            >
              <i className="icon-payments"></i>
              <span>Paiements</span>
            </Link>
          </li>
        </ul>
        
        <button onClick={handleLogout} className="logout-button">
          <i className="icon-logout"></i>
          <span>Déconnexion</span>
        </button>
      </nav>
      
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;