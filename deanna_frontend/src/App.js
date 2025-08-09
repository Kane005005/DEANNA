// deanna_frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateShopForm from './components/CreateShopForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProductManager from './components/ProductManager';
import OrderManager from './components/OrderManager'; // <-- Importe le nouveau composant
import './App.css';
import './Form.css';

// deanna_frontend/src/App.js
// ... (imports existants)
import ShopList from './components/ShopList'; // Importe le nouveau composant
import ShopDetail from './components/ShopDetail'; // Importe le nouveau composant

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/creer-boutique" element={<CreateShopForm />} />
        <Route path="/acceder-boutique" element={<LoginForm />} />
        <Route path="/visiter-boutiques" element={<ShopList />} />
        <Route path="/boutique/:shopId" element={<ShopDetail />} /> {/* Route dynamique */}

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<h2>Bienvenue, Commerçant !</h2>} />
          <Route path="products" element={<ProductManager />} />
          <Route path="orders" element={<OrderManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;