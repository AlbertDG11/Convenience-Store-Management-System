from rest_framework import serializers
from .models import Product, FoodProduct, NonFoodProduct, Inventory

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['product_id','name', 'type', 'discount', 'price', 'price_after_discount']
        
class FoodProductSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

#   def create(self, validated_data):
#       return FoodProduct.objects.create(**validated_data)

    class Meta:
        model = FoodProduct
        # <-- these must exactly match your model field names:
        fields = [
            'product',
            'food_type',
            'storage_condition',
            'expiration_date',
        ]

        
class NonFoodProductSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

#    def create(self, validated_data):
#        return NonFoodProduct.objects.create(**validated_data)
    
    class Meta:
        model = NonFoodProduct
        fields = [
            'product',
            'brand',
            'warranty_period',
        ]
        
class InventorySerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

#    def create(self, validated_data):
#        return Inventory.objects.create(**validated_data)
    
    class Meta:
        model = Inventory
        fields = ['id', 'product', 'location', 'quantity', 'status', 'inventory_id']