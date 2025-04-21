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
    addresses = SupplierAddressSerializer(many=True)
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
        

    def create(self, validated_data):
        addresses_data = validated_data.pop('addresses', [])
        # create the supplier
        supplier = Supplier.objects.create(**validated_data)
        # create all the addresses
        for addr in addresses_data:
            SupplierAddress.objects.create(supplier=supplier, **addr)
        return supplier

    def update(self, instance, validated_data):
        addresses_data = validated_data.pop('addresses', None)

        # update basic supplier fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if addresses_data is not None:
            # simple strategy: delete old addresses, then re-create
            instance.addresses.all().delete()
            for addr in addresses_data:
                SupplierAddress.objects.create(supplier=instance, **addr)

        return instance