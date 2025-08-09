# deanna_project/core/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

# On crée un modèle User personnalisé qui étend AbstractUser de Django
class User(AbstractUser):
    # Les champs par défaut sont déjà inclus : username, password, email, first_name, last_name, etc.
    # On ajoute des champs pour le commerçant
    country = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    # Le champ 'username' est déjà géré par AbstractUser

    # On peut aussi ajouter d'autres champs si besoin
    # Par exemple, pour les statistiques et les rôles (commerçant, client, admin)
    is_merchant = models.BooleanField(default=False)
    is_client = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.username


# deanna_project/core/models.py
# ... (le code du modèle User est au-dessus)

class Shop(models.Model):
    # Le nom de la boutique sera son nom d'utilisateur dans notre cas
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=255, blank=True, null=True)
    # Ici, on peut ajouter d'autres champs de la boutique, par exemple:
    # slogan = models.CharField(max_length=255, blank=True, null=True)
    # logo = models.ImageField(upload_to='shop_logos/', blank=True, null=True)

    def __str__(self):
        return f"Boutique de {self.owner.username}"
    
# deanna_backend/core/models.py

# ... (les modèles User et Shop sont au-dessus)

class Category(models.Model):
    name = models.CharField(max_length=255)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='categories')
    # Ajoute un lien vers la boutique pour que chaque catégorie appartienne à une boutique spécifique
    # On utilise CASCADE pour que si une boutique est supprimée, ses catégories le soient aussi.

    def __str__(self):
        return f"{self.name} de la boutique de {self.shop.owner.username}"

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, related_name='products', null=True)
    # Lier le produit à une catégorie. Si une catégorie est supprimée, les produits ne sont pas supprimés, mais leur catégorie devient nulle.
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='products')
    # Lier le produit à la boutique pour un accès plus facile.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.shop.owner.username})"
    

# deanna_backend/core/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

# ... (les modèles User, Shop, Category, Product sont au-dessus)

class Order(models.Model):
    """
    Représente une commande passée par un client.
    """
    # L'utilisateur qui a passé la commande. On le lie au modèle User, mais en supposant que l'utilisateur est un client.
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='orders')
    
    # La boutique où la commande a été passée
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='orders')
    
    # Le statut de la commande (ex: 'En attente', 'En cours de traitement', 'Expédiée', 'Annulée')
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('processing', 'En cours de traitement'),
        ('shipped', 'Expédiée'),
        ('delivered', 'Livrée'),
        ('canceled', 'Annulée'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Date et heure de la commande
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Commande #{self.id} de {self.customer.username} pour {self.shop.owner.username}"

class OrderItem(models.Model):
    """
    Représente un article individuel dans une commande.
    """
    # La commande à laquelle cet article appartient
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    
    # Le produit commandé
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    
    # Le prix du produit au moment de la commande
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # La quantité commandée
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"# deanna_backend/core/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

# ... (les modèles User, Shop, Category, Product sont au-dessus)

class Order(models.Model):
    """
    Représente une commande passée par un client.
    """
    # L'utilisateur qui a passé la commande. On le lie au modèle User, mais en supposant que l'utilisateur est un client.
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='orders')
    
    # La boutique où la commande a été passée
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='orders')
    
    # Le statut de la commande (ex: 'En attente', 'En cours de traitement', 'Expédiée', 'Annulée')
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('processing', 'En cours de traitement'),
        ('shipped', 'Expédiée'),
        ('delivered', 'Livrée'),
        ('canceled', 'Annulée'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Date et heure de la commande
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Commande #{self.id} de {self.customer.username} pour {self.shop.owner.username}"

class OrderItem(models.Model):
    """
    Représente un article individuel dans une commande.
    """
    # La commande à laquelle cet article appartient
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    
    # Le produit commandé
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    
    # Le prix du produit au moment de la commande
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # La quantité commandée
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"