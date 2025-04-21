from rest_framework import serializers
from .models import Orders, OrderItem
from backend.product.models import Product
from backend.customer.models import Membership
from django.db import transaction


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for an Order item
    """

    product_name = serializers.ReadOnlyField(source='product.name')
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity_ordered', 'product_name']
        read_only_fields = ['id', 'product_name']


    def validate(self, data):
        """
        Validate that sufficient stock is provided
        """

        product = data.get('product')
        quantity = data.get('quantity')

        if product and quantity:
            if product.stock < quantity:
                raise serializers.ValidationError(f"Insufficient stock for Product '{product.name}'. Available: {product.stock}, requested: {quantity}.")

        return data

class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer for an Order
    """
    items = OrderItemSerializer(many=True)
    class Meta:
        fields = ['id', 'delivery_address', 'create_time', 'payment_method', 'status', 'customer_notes', 'total_amount', 'items']
        read_only_fields = ['create_time', 'payment_method', 'status']

    def create(self, validated_data):
        """
        Create an Order with nested OrderItems.
        Decrement the product stock accordingly and calculate the total amount.
        """
        # Extract nested Order items data
        items = validated_data.pop('items')
        total_amount = 0  # to accumulate total Order amount

        with transaction.atomic():
            # Create the Order record
            order_instance = Orders.objects.create(**validated_data)
            for item in items:
                pro = item['product']
                quantity = item['quantity']
                price = pro.price
                total_amount += quantity * price

                # Create the OrderItem record
                OrderItem.objects.create(order=order_instance, product=pro, quantity=quantity, price=price)
                # Update Product stock
                pro.stock -= quantity
                pro.save()

            # Update Order total amount
            order_instance.total_amount = total_amount
            order_instance.save()
        return order_instance

    def update(self, instance, validated_data):
        """
        Update an existing Order and update inventory stock
        If the order is canceled, restore stock.
        If new items are provided, remove old items and re-add new ones.
        """

        items = validated_data.pop('items')

        if validated_data.get('status') == 'Canceled' and items is not None:
            raise serializers.ValidationError(f"Order '{instance.order}' has been canceled.")

        # Use a transaction to ensure data integrity if any stock checks fail.
        with transaction.atomic():
            if 'status' in validated_data and validated_data['status'] == 'Canceled' and instance.status != 'Canceled':
                for old_item in instance.items.all():
                    # Add back the stock.
                    old_item.product.stock += old_item.quantity
                    old_item.product.save()

            # If new items are provided, replace the old items.
            if items is not None:
                # First, restore the stock from existing items.
                for old_item in instance.items.all():
                    old_product = old_item.product
                    old_quantity = old_item.quantity
                    old_product.stock += old_quantity
                    old_product.save()

                # Remove all old items.
                instance.items.all().delete()

                # Recalculate total with new items.
                new_total_amount = 0
                for item in items:
                    pro = item['product']
                    quantity = item['quantity']
                    price = pro.price
                    new_total_amount += quantity * price

                    OrderItem.objects.create(order=instance, product=pro, quantity=quantity, price=price)
                    pro.stock -= quantity
                    pro.save()

                instance.total_amount = new_total_amount

            # Update other fields (besides items).
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()
        return instance
















