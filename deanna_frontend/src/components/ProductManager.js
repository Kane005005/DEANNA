import React, { useState, useEffect } from 'react';
import { getCategories, getProducts, createCategory, createProduct, updateProduct, deleteProduct, deleteCategory } from '../services/api';
import './ProductManager.css';

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newProductData, setNewProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: '',
  });

  const [editingProduct, setEditingProduct] = useState(null);

  const fetchData = async () => {
    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        getCategories(),
        getProducts(),
      ]);
      setCategories(categoriesResponse.data);
      setProducts(productsResponse.data);
      setLoading(false);
    } catch (err) {
      setError("Impossible de charger les données. Veuillez vous reconnecter.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await createCategory({ name: newCategoryName });
      setNewCategoryName('');
      setShowAddCategory(false);
      fetchData();
    } catch (err) {
      alert("Erreur lors de l'ajout de la catégorie.");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productDataToSend = { ...newProductData, category: parseInt(newProductData.category, 10) };
      await createProduct(productDataToSend);
      setNewProductData({ name: '', description: '', price: '', stock_quantity: '', category: '' });
      setShowAddProduct(false);
      fetchData();
    } catch (err) {
      alert("Erreur lors de l'ajout du produit.");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const productDataToSend = { ...editingProduct, category: parseInt(editingProduct.category, 10) };
      await updateProduct(editingProduct.id, productDataToSend);
      setEditingProduct(null);
      setExpandedProduct(null);
      fetchData();
    } catch (err) {
      alert("Erreur lors de la mise à jour du produit.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduct(productId);
        fetchData();
      } catch (err) {
        alert("Erreur lors de la suppression du produit.");
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      try {
        await deleteCategory(categoryId);
        fetchData();
      } catch (err) {
        alert("Erreur lors de la suppression de la catégorie.");
      }
    }
  };

  const toggleProductExpand = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement en cours...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const renderEditProductForm = () => (
    <div className="form-container card">
      <h3>Modifier le produit</h3>
      <form onSubmit={handleUpdateProduct} className="add-form">
        <div className="form-group">
          <label>Nom</label>
          <input type="text" name="name" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Prix (FCFA)</label>
            <input type="number" name="price" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" name="stock_quantity" value={editingProduct.stock_quantity} onChange={(e) => setEditingProduct({...editingProduct, stock_quantity: e.target.value})} required />
          </div>
        </div>
        <div className="form-group">
          <label>Catégorie</label>
          <select name="category" value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} required>
            <option value="">Sélectionner une catégorie</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => setEditingProduct(null)}>Annuler</button>
          <button type="submit" className="btn-primary">Sauvegarder</button>
        </div>
      </form>
    </div>
  );

  const renderAddForms = () => (
    <div className="add-actions">
      {!showAddCategory ? (
        <button 
          className="btn-toggle-form"
          onClick={() => setShowAddCategory(true)}
        >
          + Ajouter une catégorie
        </button>
      ) : (
        <div className="compact-form-container">
          <form onSubmit={handleAddCategory} className="compact-form">
            <input
              type="text"
              placeholder="Nom de la catégorie"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
              autoFocus
            />
            <div className="compact-form-actions">
              <button type="submit" className="btn-compact-primary">Ajouter</button>
              <button 
                type="button" 
                className="btn-compact-secondary"
                onClick={() => setShowAddCategory(false)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {!showAddProduct ? (
        <button 
          className="btn-toggle-form"
          onClick={() => setShowAddProduct(true)}
        >
          + Ajouter un produit
        </button>
      ) : (
        <div className="compact-form-container">
          <form onSubmit={handleAddProduct} className="compact-form">
            <input 
              type="text" 
              placeholder="Nom du produit" 
              value={newProductData.name}
              onChange={(e) => setNewProductData({...newProductData, name: e.target.value})}
              required
              autoFocus
            />
            <div className="form-row">
              <input 
                type="number" 
                placeholder="Prix (FCFA)" 
                value={newProductData.price}
                onChange={(e) => setNewProductData({...newProductData, price: e.target.value})}
                required
              />
              <input 
                type="number" 
                placeholder="Stock" 
                value={newProductData.stock_quantity}
                onChange={(e) => setNewProductData({...newProductData, stock_quantity: e.target.value})}
                required
              />
            </div>
            <select 
              value={newProductData.category}
              onChange={(e) => setNewProductData({...newProductData, category: e.target.value})}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <div className="compact-form-actions">
              <button type="submit" className="btn-compact-primary">Ajouter</button>
              <button 
                type="button" 
                className="btn-compact-secondary"
                onClick={() => setShowAddProduct(false)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <div className="product-manager-container">
      <div className="header-section">
        <h2>Gestion des Rayons & Produits</h2>
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Produits
          </button>
          <button 
            className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Catégories
          </button>
        </div>
      </div>

      {editingProduct ? renderEditProductForm() : (
        <div className="content-section">
          {activeTab === 'products' && (
            <>
              <div className="add-section">
                {renderAddForms()}
              </div>
              <div className="product-section card">
                <h3>Liste des produits</h3>
                <div className="products-grid">
                  {products.map(product => (
                    <div 
                      key={product.id} 
                      className={`product-card ${expandedProduct === product.id ? 'expanded' : ''}`}
                      onClick={() => toggleProductExpand(product.id)}
                    >
                      <div className="product-header">
                        <h4>{product.name}</h4>
                        <span className="product-price">{parseInt(product.price).toLocaleString()} FCFA</span>
                      </div>
                      <div className="product-category">
                        {categories.find(c => c.id === product.category)?.name || 'Non classé'}
                      </div>
                      <div className="product-stock">
                        Stock: {product.stock_quantity}
                      </div>
                      {expandedProduct === product.id && (
                        <div className="product-details">
                          <p className="product-description">{product.description || 'Aucune description disponible'}</p>
                          <div className="product-actions">
                            <button 
                              className="btn-edit" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingProduct(product);
                              }}
                            >
                              Modifier
                            </button>
                            <button 
                              className="btn-delete" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProduct(product.id);
                              }}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'categories' && (
            <div className="category-section card">
              <h3>Liste des catégories</h3>
              <div className="categories-grid">
                {categories.map(category => (
                  <div key={category.id} className="category-card">
                    <span className="category-name">{category.name}</span>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDeleteCategory(category.id)}
                      aria-label={`Supprimer la catégorie ${category.name}`}
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductManager;