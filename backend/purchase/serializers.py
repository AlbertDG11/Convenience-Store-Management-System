# backend/purchase/serializers.py
from rest_framework import serializers
from django.db import transaction
from backend.product.models import Inventory
from .models import InventoryPurchase, PurchaseItem

class PurchaseItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = PurchaseItem
        fields = ['id', 'purchase', 'product', 'quantity_purchased', 'product_name']
        read_only_fields = ['id', 'product_name', 'purchase']

class InventoryPurchaseSerializer(serializers.ModelSerializer):
    supplier_name = serializers.ReadOnlyField(source='supplier.name')
    items = PurchaseItemSerializer(source='purchaseitem_set', many=True)

    class Meta:
        model = InventoryPurchase
        fields = [
            'purchase_id', 'supplier', 'purchase_time',
            'total_cost', 'items', 'supplier_name', 'employee'
        ]
        read_only_fields = [
            'purchase_id', 'purchase_time',
            'total_cost', 'supplier_name', 'employee'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('purchaseitem_set', [])
        total_cost = 0
        with transaction.atomic():
            invp = InventoryPurchase.objects.create(**validated_data)
            for idx, it in enumerate(items_data, start=1):
                prod = it['product']
                qty = it['quantity_purchased']
                total_cost += prod.price * qty

                PurchaseItem.objects.create(
                    purchase=invp,
                    item_id=idx,
                    product=prod,
                    quantity_purchased=qty
                )
                inv = Inventory.objects.filter(product=prod).first()
                inv.quantity = str(int(inv.quantity) + qty)
                inv.save()

            invp.total_cost = total_cost
            invp.save()
        return invp

    def update(self, instance, validated_data):
        items_data = validated_data.pop('purchaseitem_set', None)
        with transaction.atomic():
            if items_data is not None:

                for old in instance.purchaseitem_set.all():
                    inv = Inventory.objects.filter(product=old.product).first()
                    inv.quantity = str(int(inv.quantity) - old.quantity_purchased)
                    inv.save()
                instance.purchaseitem_set.all().delete()


                total_cost = 0
                for idx, it in enumerate(items_data, start=1):
                    prod = it['product']
                    qty = it['quantity_purchased']
                    total_cost += prod.price * qty

                    PurchaseItem.objects.create(
                        purchase=instance,
                        item_id=idx,
                        product=prod,
                        quantity_purchased=qty
                    )
                    inv = Inventory.objects.filter(product=prod).first()
                    inv.quantity = str(int(inv.quantity) + qty)
                    inv.save()
                instance.total_cost = total_cost


            for k, v in validated_data.items():
                setattr(instance, k, v)
            instance.save()
        return instance
