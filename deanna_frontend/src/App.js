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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/creer-boutique" element={<CreateShopForm />} />
        <Route path="/acceder-boutique" element={<LoginForm />} />

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
          <Route path="orders" element={<OrderManager />} /> {/* <-- Ajoute la nouvelle route */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;