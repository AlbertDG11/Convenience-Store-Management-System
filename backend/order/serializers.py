# backend/order/serializers.py

from rest_framework import serializers
from django.db import transaction
from backend.product.models import Inventory
from ..employee.models import Employee, Salesperson
from .models import Orders, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity_ordered', 'product_name']
        read_only_fields = ['id', 'order', 'product_name']

    def validate(self, data):
        product = data.get('product')
        qty = data.get('quantity_ordered')
        # Check total available across all inventories
        total_available = sum(int(inv.quantity) for inv in Inventory.objects.filter(product=product))
        if total_available < qty:
            raise serializers.ValidationError(
                f"Insufficient total stock for '{product.name}': have {total_available}, want {qty}."
            )
        return data

class OrderSerializer(serializers.ModelSerializer):
    # Nested items come in as 'items', map to orderitem_set
    items = OrderItemSerializer(source='orderitem_set', many=True)

    class Meta:
        model = Orders
        fields = [
            'order_id', 'delivery_address', 'create_time',
            'payment_method', 'order_status', 'customer_notes',
            'total_price', 'items', 'employee', 'member'
        ]
        read_only_fields = [
            'order_id', 'create_time',
            'payment_method', 'total_price', 'employee'
        ]

    def _deduct_inventory(self, product, qty):
        """
        Deduct quantity from multiple Inventory records until fulfilled.
        """
        needed = qty
        inventories = Inventory.objects.filter(product=product).order_by('id')
        for inv in inventories:
            available = int(inv.quantity)
            if available >= needed:
                inv.quantity = str(available - needed)
                inv.save()
                needed = 0
                break
            else:
                inv.quantity = '0'
                inv.save()
                needed -= available
        if needed > 0:
            raise serializers.ValidationError(f"Insufficient inventory for '{product.name}'")

    def create(self, validated_data):
        items_data = validated_data.pop('orderitem_set', [])
        request = self.context['request']
        emp = Employee.objects.filter(employee_id=request.user.id).first()
        salesperson = Salesperson.objects.filter(employee=emp).first()

        total = 0
        with transaction.atomic():
            order = Orders.objects.create(employee=salesperson, **validated_data)
            for idx, it in enumerate(items_data, start=1):
                prod = it['product']
                qty = it['quantity_ordered']
                total += prod.price * qty

                OrderItem.objects.create(
                    item_id=idx,
                    order=order,
                    product=prod,
                    quantity_ordered=qty
                )
                # Deduct from multiple inventory records
                self._deduct_inventory(prod, qty)

            order.total_price = total
            order.save()
        return order

    def update(self, instance, validated_data):
        items_data = validated_data.pop('orderitem_set', None)

        # Handle cancellation: return stock
        if (
            'order_status' in validated_data
            and validated_data['order_status'] == 'Canceled'
            and instance.order_status != 'Canceled'
        ):
            with transaction.atomic():
                for old in instance.orderitem_set.all():
                    inv = Inventory.objects.filter(product=old.product).first()
                    if inv:
                        inv.quantity = str(int(inv.quantity) + old.quantity_ordered)
                        inv.save()
                instance.order_status = 'Canceled'

        # If new items provided, replace old ones
        if items_data is not None:
            with transaction.atomic():
                # Restore stock of old items
                for old in instance.orderitem_set.all():
                    inv = Inventory.objects.filter(product=old.product).first()
                    if inv:
                        inv.quantity = str(int(inv.quantity) + old.quantity_ordered)
                        inv.save()
                instance.orderitem_set.all().delete()

                # Create new items and deduct stock
                new_total = 0
                for idx, it in enumerate(items_data, start=1):
                    prod = it['product']
                    qty = it['quantity_ordered']
                    new_total += prod.price * qty

                    OrderItem.objects.create(
                        item_id=idx,
                        order=instance,
                        product=prod,
                        quantity_ordered=qty
                    )
                    self._deduct_inventory(prod, qty)

                instance.total_price = new_total

        # Update other fields
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        return instance
