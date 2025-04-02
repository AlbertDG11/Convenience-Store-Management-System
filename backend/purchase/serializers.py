from backend.purchase.models import InventoryPurchase, PurchaseItem
from rest_framework import serializers

class PurchaseItemSerializer(serializers.ModelSerializer):
    """
    serializer for purchase items
    """

    # Include product name for readability in responses
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = PurchaseItem
        fields = ['id', 'purchase', 'product', 'quantity_purchased', 'product_name']

class InventoryPurchaseSerializer(serializers.ModelSerializer):
    """
    serializer for inventory purchases
    """
    # Include supplier name for convenience in responses
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)

    items = PurchaseItemSerializer()
    class Meta:
        model = InventoryPurchase
        fields = ['id', 'supplier', 'purchase_time', 'total_cost', 'items', 'supplier_name']
        read_only_fields = ['id', 'purchase_time', 'total_cost', 'supplier_name']


    def create(self, validated_data):
        """
        create a new InventoryPurchase instance with its items, and update stock
        """
        items_data = validated_data.pop('items')
        total_cost = 0
        from django.db import transaction
        with transaction.atomic():
            inventory_purchase = PurchaseItem.objects.create(**validated_data)
            for item in items_data:
                product = item['product']
                quantity = item['quantity_purchased']
                price = product.price
                total_cost += price * quantity
                PurchaseItem.objects.create(purchase=inventory_purchase, product=product, quantity=quantity)
                product.stock += quantity
                product.save()
            inventory_purchase.total_cost = total_cost
            inventory_purchase.save()
        return inventory_purchase

    def update(self, instance, validated_data):
        """
        Update an existing InventoryPurchase instance, adjusting stock
        """
        items_data = validated_data.pop('items')
        from django.db import transaction
        with transaction.atomic():
            if items_data is not None:
                for old_item in instance.items.all():
                    old_product = old_item.product
                    old_quantity = old_item.quantity

                    old_product.stock -= old_quantity
                    old_product.save()

                instance.items.all().delete()
            total_cost = 0
            for item in items_data:
                product = item['product']
                quantity = item['quantity_purchased']
                price = product.price
                total_cost += price * quantity
                PurchaseItem.objects.create(purchase=instance, product=product, quantity=quantity)
                product.stock += quantity
                product.save()

            instance.total_cost = total_cost

            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()
        return instance








