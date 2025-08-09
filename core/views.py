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


# deanna_backend/core/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, Shop, Category, Product, Order, OrderItem
from .serializers import (
    UserSerializer, ShopSerializer, CategorySerializer, ProductSerializer,
    OrderSerializer, OrderItemSerializer
)

# ... (les vues existantes sont au-dessus)

class PublicShopListView(generics.ListAPIView):
    """
    Vue pour lister toutes les boutiques (accès public).
    """
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

class ShopDetailView(generics.RetrieveAPIView):
    """
    Vue pour voir les détails d'une boutique spécifique (accès public).
    """
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

class PublicProductListView(generics.ListAPIView):
    """
    Vue pour lister les produits d'une boutique spécifique (accès public).
    """
    serializer_class = ProductSerializer

    def get_queryset(self):
        shop_id = self.kwargs['shop_id']
        return Product.objects.filter(shop_id=shop_id)

class ProductDetailView(generics.RetrieveAPIView):
    """
    Vue pour voir les détails d'un produit spécifique (accès public).
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# deanna_backend/core/views.py
# ... (le reste des imports et des vues)

class CreateOrderView(APIView):
    """
    Vue pour permettre à un client de passer une commande.
    C'est une vue publique (pas de permission nécessaire).
    """
    def post(self, request, *args, **kwargs):
        # On va d'abord récupérer les données du corps de la requête
        data = request.data
        username = data.get('username')
        shop_id = data.get('shop_id')
        items_data = data.get('items')
        
        # On vérifie si l'utilisateur existe, sinon on le crée
        user, created = User.objects.get_or_create(username=username, is_client=True)
        
        # On vérifie si la boutique existe
        try:
            shop = Shop.objects.get(id=shop_id)
        except Shop.DoesNotExist:
            return Response({"detail": "Boutique introuvable."}, status=404)

        # On crée la commande
        order = Order.objects.create(customer=user, shop=shop, status='pending')

        # On crée les articles de la commande
        for item_data in items_data:
            product = Product.objects.get(id=item_data['product_id'])
            OrderItem.objects.create(
                order=order,
                product=product,
                price=product.price,
                quantity=item_data['quantity']
            )

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=201)