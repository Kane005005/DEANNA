# deanna_backend/core/urls.py

from django.urls import path
from .views import (
    MerchantRegistrationView,
    CategoryListCreateView,
    CategoryRetrieveUpdateDestroyView,
    ProductListCreateView,
    ProductRetrieveUpdateDestroyView,
    OrderListCreateView,
    OrderRetrieveUpdateView,
    PublicShopListView,
    ShopDetailView,
    PublicProductListView,
    ProductDetailView,
    CreateOrderView,
)

urlpatterns = [
    path('register-merchant/', MerchantRegistrationView.as_view(), name='register_merchant'),
    
    # URLs pour les catégories
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryRetrieveUpdateDestroyView.as_view(), name='category-retrieve-update-destroy'),

    # URLs pour les produits
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductRetrieveUpdateDestroyView.as_view(), name='product-retrieve-update-destroy'),

    # URLs pour les commandes
    path('orders/', OrderListCreateView.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderRetrieveUpdateView.as_view(), name='order-retrieve-update'),

    path('shops/', PublicShopListView.as_view(), name='public-shop-list'),
    path('shops/<int:pk>/', ShopDetailView.as_view(), name='shop-detail'),
    path('shops/<int:shop_id>/products/', PublicProductListView.as_view(), name='public-product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('orders/create/', CreateOrderView.as_view(), name='create-order'),
]