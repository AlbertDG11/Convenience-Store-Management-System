from rest_framework import serializers
from .models import Supplier, SupplierAddress

class SupplierAddressSerializer(serializers.ModelSerializer):
    supplier_id = serializers.PrimaryKeyRelatedField(read_only=True, source='supplier')

    class Meta:
        model = SupplierAddress
        fields = [
            'id',
            'supplier_id',
            'province',
            'city',
            'street_address',
            'postal_code',
        ]

class SupplierSerializer(serializers.ModelSerializer):
    addresses = SupplierAddressSerializer(many=True, read_only=True)
    class Meta:
        model = Supplier
        fields = [
            'supplier_id',
            'supplier_name',
            'supplier_status',
            'contact_name',
            'contact_email',
            'phone_number',
            'addresses',  # Include related addresses
        ]