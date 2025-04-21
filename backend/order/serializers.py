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
        inv = Inventory.objects.filter(product=product).first()
        if inv and int(inv.quantity) < qty:
            raise serializers.ValidationError(
                f"Insufficient stock for '{product.name}': have {inv.quantity}, want {qty}."
            )
        return data


class OrderSerializer(serializers.ModelSerializer):
    # This tells DRF to serialize via orderitem_set, but input still comes in as "items"
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

    def create(self, validated_data):
        # Pop nested items before creating Orders
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
                inv = Inventory.objects.filter(product=prod).first()
                inv.quantity = str(int(inv.quantity) - qty)
                inv.save()

            order.total_price = total
            order.save()
        return order

    def update(self, instance, validated_data):
        items_data = validated_data.pop('orderitem_set', None)

        # Handle cancellation stock return
        if (
            'order_status' in validated_data
            and validated_data['order_status'] == 'Canceled'
            and instance.order_status != 'Canceled'
        ):
            with transaction.atomic():
                for old in instance.orderitem_set.all():
                    inv = Inventory.objects.filter(product=old.product).first()
                    inv.quantity = str(int(inv.quantity) + old.quantity_ordered)
                    inv.save()
                instance.order_status = 'Canceled'

        # If new items provided, replace old ones
        if items_data is not None:
            with transaction.atomic():
                # First restore stock of old
                for old in instance.orderitem_set.all():
                    inv = Inventory.objects.filter(product=old.product).first()
                    inv.quantity = str(int(inv.quantity) + old.quantity_ordered)
                    inv.save()
                instance.orderitem_set.all().delete()

                # Then create new and deduct stock
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
                    inv = Inventory.objects.filter(product=prod).first()
                    inv.quantity = str(int(inv.quantity) - qty)
                    inv.save()

                instance.total_price = new_total

        # Update other fields
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        return instance
