from rest_framework import serializers
from .models import Supplier, Supplieraddress

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['supplier_id', 'status', 'name']
        
    

class SupplieraddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplieraddress
        fields = ['id', 'supplier', 'city', 'province', 'street_address', 'postal_code']