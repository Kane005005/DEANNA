# deanna_project/core/serializers.py
from rest_framework import serializers
from .models import User, Shop

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'country', 'phone_number', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # On crée un utilisateur avec les données validées
        # La fonction set_password permet de hacher le mot de passe
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            country=validated_data.get('country'),
            phone_number=validated_data.get('phone_number'),
            is_merchant=True, # On définit l'utilisateur comme un commerçant
            is_client=False
        )
        return user

class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ('owner', 'category')

# deanna_backend/core/serializers.py

from rest_framework import serializers
from .models import User, Shop, Category, Product # <-- Ajoute les nouveaux modèles

# ... (les serializers User et Shop sont au-dessus)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'shop']
        read_only_fields = ['shop'] # On ne veut pas que le commerçant puisse modifier la boutique

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock_quantity', 'category', 'shop', 'created_at']
        read_only_fields = ['shop', 'created_at'] # Le commerçant ne peut pas modifier la boutique ou la date de création


# deanna_backend/core/serializers.py

from rest_framework import serializers
from .models import User, Shop, Category, Product, Order, OrderItem # <-- Ajoute les nouveaux modèles

# ... (les serializers existants sont au-dessus)

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'price', 'quantity']
        read_only_fields = ['id', 'product', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_username = serializers.ReadOnlyField(source='customer.username')

    class Meta:
        model = Order
        fields = ['id', 'customer', 'customer_username', 'shop', 'status', 'created_at', 'updated_at', 'items']
        read_only_fields = ['id', 'customer', 'shop', 'created_at', 'updated_at', 'items']

# deanna_backend/core/serializers.py

from rest_framework import serializers
from .models import User, Shop, Category, Product, Order, OrderItem

# ... (les serializers existants sont au-dessus)

class PublicProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'category_name', 'shop']
        read_only_fields = fields

class PublicShopSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    products = PublicProductSerializer(many=True, read_only=True)
    class Meta:
        model = Shop
        fields = ['id', 'owner_username', 'category', 'products']
        read_only_fields = fields