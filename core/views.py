# deanna_project/core/views.py
from rest_framework import generics
from .models import User, Shop
from .serializers import UserSerializer, ShopSerializer

class MerchantRegistrationView(generics.CreateAPIView):
    """
    Vue pour l'inscription d'un nouveau commerçant.
    Elle gère la création de l'utilisateur et de la boutique associée.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        # On enregistre d'abord l'utilisateur
        user = serializer.save()
        # Ensuite, on crée la boutique pour cet utilisateur
        Shop.objects.create(owner=user, category=self.request.data.get('category'))

# deanna_backend/core/views.py

from rest_framework import generics, permissions # <-- Ajoute 'permissions'
from .models import User, Shop, Category, Product # <-- Ajoute les nouveaux modèles
from .serializers import UserSerializer, ShopSerializer, CategorySerializer, ProductSerializer # <-- Ajoute les nouveaux serializers

# ... (la vue MerchantRegistrationView est au-dessus)

class CategoryListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister et créer les catégories d'une boutique.
    Seuls les commerçants peuvent y accéder.
    """
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # On ne veut voir que les catégories de la boutique de l'utilisateur connecté
        return Category.objects.filter(shop__owner=self.request.user)
    
    def perform_create(self, serializer):
        # On définit automatiquement la boutique à partir de l'utilisateur
        shop = self.request.user.shop # On suppose que chaque commerçant a une boutique
        serializer.save(shop=shop)

class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, mettre à jour ou supprimer une catégorie spécifique.
    """
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Category.objects.filter(shop__owner=self.request.user)

class ProductListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister et créer les produits d'une boutique.
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # On ne veut voir que les produits de la boutique de l'utilisateur connecté
        return Product.objects.filter(shop__owner=self.request.user)

    def perform_create(self, serializer):
        shop = self.request.user.shop
        serializer.save(shop=shop)

class ProductRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, mettre à jour ou supprimer un produit spécifique.
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(shop__owner=self.request.user)
    

# deanna_backend/core/views.py

from rest_framework import generics, permissions
from .models import User, Shop, Category, Product, Order, OrderItem # <-- Ajoute les nouveaux modèles
from .serializers import (
    UserSerializer, ShopSerializer, CategorySerializer, ProductSerializer,
    OrderSerializer # <-- Ajoute les nouveaux serializers
)

# ... (les vues existantes sont au-dessus)

class OrderListCreateView(generics.ListAPIView):
    """
    Vue pour lister les commandes d'un commerçant.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # On ne veut voir que les commandes de la boutique de l'utilisateur connecté
        return Order.objects.filter(shop__owner=self.request.user).order_by('-created_at')

class OrderRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    """
    Vue pour récupérer ou mettre à jour une commande spécifique.
    Le commerçant peut seulement mettre à jour le statut.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # On s'assure que le commerçant ne peut accéder qu'aux commandes de sa propre boutique
        return Order.objects.filter(shop__owner=self.request.user)