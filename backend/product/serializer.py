from rest_framework import serializers
from .models import *

class ProductSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(required=False, allow_null=True)
    name = serializers.CharField(required=False, allow_null=True)
    type = serializers.CharField(required=False, allow_null=True)
    discount = serializers.FloatField(required=False, allow_null=True)
    price = serializers.FloatField(required=False, allow_null=True)
    price_after_discount = serializers.FloatField(required=False, allow_null=True)

    #food
    food_type = serializers.CharField(required=False, allow_null=True)
    storage_condition = serializers.CharField(required=False, allow_null=True)
    expiration_date = serializers.DateField(required=False, allow_null=True)
    #nonfood
    warranty_period = serializers.CharField(required=False, allow_null=True)
    brand = serializers.CharField(required=False, allow_null=True)
    
    class Meta:
        model = Product
        fields = [
            'product_id','name','type',
            'discount','price','price_after_discount',
            'food_type','storage_condition','expiration_date',
            'warranty_period','brand',
        ]
    
    def create(self, validated_data):
        # Pop off subtype data so it doesn't get passed to Product.objects.create()
        food_data = {
            'food_type':         validated_data.pop('food_type', None),
            'storage_condition': validated_data.pop('storage_condition', None),
            'expiration_date':   validated_data.pop('expiration_date', None),
        }
        nonfood_data = {
            'warranty_period':   validated_data.pop('warranty_period', None),
            'brand':             validated_data.pop('brand', None),
        }

        # Create the base Product
        prod = Product.objects.create(**validated_data)

        # Create the matching subtype record
        if prod.type == 'food':
            FoodProduct.objects.create(product=prod, **food_data)
        elif prod.type == 'nonfood':
            NonFoodProduct.objects.create(product=prod, **nonfood_data)

        return prod

    def update(self, instance, validated_data):
        # Extract subtype data
        food_data = {
            'food_type':         validated_data.pop('food_type', None),
            'storage_condition': validated_data.pop('storage_condition', None),
            'expiration_date':   validated_data.pop('expiration_date', None),
        }
        nonfood_data = {
            'warranty_period':   validated_data.pop('warranty_period', None),
            'brand':             validated_data.pop('brand', None),
        }

        # Update base Product fields
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()

        # Sync subtype tables (delete old if switching)
        if instance.type == 'food':
            NonFoodProduct.objects.filter(product=instance).delete()
            FoodProduct.objects.update_or_create(product=instance, defaults=food_data)
        elif instance.type == 'nonfood':
            FoodProduct.objects.filter(product=instance).delete()
            NonFoodProduct.objects.update_or_create(product=instance, defaults=nonfood_data)

        return instance
    
    def to_representation(self, instance):
        """
        Override the default representation to *inject* real values
        from the one-to-one tables into our flat JSON.
        """
        ret = super().to_representation(instance)

        # Pull from foodproduct if it exists
        try:
            fp = instance.foodproduct
            ret['food_type']         = fp.food_type
            ret['storage_condition'] = fp.storage_condition
            ret['expiration_date']   = fp.expiration_date.isoformat() if fp.expiration_date else None
        except FoodProduct.DoesNotExist:
            ret['food_type']         = None
            ret['storage_condition'] = None
            ret['expiration_date']   = None

        # Pull from nonfoodproduct if it exists
        try:
            nfp = instance.nonfoodproduct
            ret['warranty_period'] = nfp.warranty_period
            ret['brand']           = nfp.brand
        except NonFoodProduct.DoesNotExist:
            ret['warranty_period'] = None
            ret['brand']           = None

        return ret

class FoodProductSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.product_id', read_only=True)

    class Meta:
        model = FoodProduct
        fields = ['product_id', 'food_type', 'storage_condition', 'expiration_date']


class NonFoodProductSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.product_id', read_only=True)

    class Meta:
        model = NonFoodProduct
        fields = ['product_id', 'warranty_period', 'brand']
#class ProductSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = Product
#        fields = ['product_id','name', 'type', 'discount', 'price', 'price_after_discount']
        
#class FoodProductSerializer(serializers.ModelSerializer):
#    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

#   def create(self, validated_data):
#       return FoodProduct.objects.create(**validated_data)

#    class Meta:
#        model = FoodProduct
#        # <-- these must exactly match your model field names:
#        fields = [   'product', 'food_type', 'expiration_date',  ]

        
#class NonFoodProductSerializer(serializers.ModelSerializer):
#    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

#    def create(self, validated_data):
#        return NonFoodProduct.objects.create(**validated_data)
    
#    class Meta:
#        model = NonFoodProduct
#        fields = [  'product','brand',  'warranty_period',]
        
class InventorySerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

#    def create(self, validated_data):
#        return Inventory.objects.create(**validated_data)
    
    class Meta:
        model = Inventory
        fields = ['id', 'product', 'location', 'quantity', 'status', 'inventory_id']