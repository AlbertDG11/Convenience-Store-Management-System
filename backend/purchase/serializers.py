from backend.product.models import Inventory
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

    items = PurchaseItemSerializer(source='purchaseitem_set', many=True)
    class Meta:
        model = InventoryPurchase
        fields = ['purchase_id', 'supplier', 'purchase_time', 'total_cost', 'items', 'supplier_name', 'employee']
        read_only_fields = ['purchase_id', 'purchase_time', 'total_cost', 'supplier_name','employee']


    def create(self, validated_data):
        """
        create a new InventoryPurchase instance with its items, and update stock
        """
        items_data = validated_data.pop('items')
        total_cost = 0
        from django.db import transaction
        with transaction.atomic():
            inventory_purchase = InventoryPurchase.objects.create(**validated_data)
            for item in items_data:
                product = item['product']
                quantity = item['quantity_purchased']
                price = product.price
                total_cost += price * quantity
                PurchaseItem.objects.create(purchase=inventory_purchase, product=product, quantity=quantity)
                inv = Inventory.objects.filter(product=product).first()
                inv.quantity = str(int(inv.quantity) + PurchaseItem.quantity_purchased)
                inv.save()
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
                for old_item in instance.purchaseitem_set.all():

                    inv = Inventory.objects.filter(product=old_item.product).first()
                    inv.quantity = str(int(inv.quantity) - old_item.quantity_purchased)
                    inv.save()

                instance.purchaseitem_set.all().delete()
            total_cost = 0
            for item in items_data:
                product = item['product']
                quantity = item['quantity_purchased']
                price = product.price
                total_cost += price * quantity
                PurchaseItem.objects.create(purchase=instance, product=product, quantity_purchased=quantity)
                inv = Inventory.objects.filter(product=PurchaseItem.product).first()
                inv.quantity = str(int(inv.quantity) + PurchaseItem.quantity_purchased)
                inv.save()

            instance.total_cost = total_cost

            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()
        return instance








