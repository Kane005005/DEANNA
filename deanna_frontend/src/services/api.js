// deanna_frontend/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Crée une instance d'Axios avec l'URL de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'accès à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fonctions pour les appels API
export const registerMerchant = (userData) => {
  return api.post('/register-merchant/', userData);
};

export const login = (credentials) => {
  return api.post('/token/', credentials);
};

// Fonctions pour les catégories
export const getCategories = () => api.get('/categories/');
export const createCategory = (data) => api.post('/categories/', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}/`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}/`);

// Fonctions pour les produits
export const getProducts = () => api.get('/products/');
export const createProduct = (data) => api.post('/products/', data);
export const updateProduct = (id, data) => api.put(`/products/${id}/`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}/`);

// <-- AJOUTE CES FONCTIONS POUR LES COMMANDES -->
export const getOrders = () => api.get('/orders/');
export const getOrder = (id) => api.get(`/orders/${id}/`);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/`, { status: status });
export const getShops = () => api.get('/shops/');
export const getShopDetails = (shopId) => api.get(`/shops/${shopId}/`);
export const getShopProducts = (shopId) => api.get(`/shops/${shopId}/products/`);
export const createOrder = (orderData) => api.post('/orders/create/', orderData);

export default api;