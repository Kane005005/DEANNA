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
]