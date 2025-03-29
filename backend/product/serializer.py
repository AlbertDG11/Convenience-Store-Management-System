from rest_framework import serializers
from .models import Product, Foodproduct, Nonfoodproduct, Inventory

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'discount', 'price', 'price_after']
        
class FoodproductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Foodproduct
        fields = ['foodtype', 'storage_cond', 'expiration']
        
class NonfoodproductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nonfoodproduct
        fields = ['warranty_period', 'brand']
        
class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['location', 'quantity', 'status', 'inventory_id']