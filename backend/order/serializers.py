from rest_framework import serializers
from .models import Order, OrderItem
from backend.product.models import Product
from backend.customer.models import Membership


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for an Order item
    """

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity']


    def validated(self, data):
        """
        Validate that sufficient stock is provided
        """

        product = data.get('Product')
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
        fields = ['id', 'Delivery_address', 'create_time', 'payment_method', 'status', 'Customer_notes', 'total_amount']
        read_only_fields = ['create_time', 'payment_method', 'status']

    def create(self, validated_data):
        """
        Create an Order and update inventory stock
        """
        # Extract nested Order items data
        items = validated_data.pop('items')
        total_amount = 0  # to accumulate total Order amount
        from django.db import transaction
        with transaction.atomic():
            # Create the Order record
            Ord = Order.objects.create(**validated_data)
            for item in items:
                pro = item['Product']
                quantity = item['quantity']
                price = pro.price
                total_amount += quantity * price

                # Create the OrderItem record
                OrderItem.objects.create(order=Ord, product=Product, quantity=quantity, price=price)
                # Update Product stock
                pro.stock -= quantity
                pro.save()

            # Update Order total amount
            Ord.total_amount = total_amount
            Ord.save()
        return Ord












