from rest_framework import serializers
from .models import Orders, OrderItem

from django.db import transaction
from backend.product.models import Inventory





class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for an Order item
    """

    product_name = serializers.ReadOnlyField(source='product.name')
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity_ordered', 'product_name']
        read_only_fields = ['id', 'product_name', 'order']


    def validate(self, data):
        """
        Validate that sufficient stock is provided
        """

        product = data.get('product')
        quantity = data.get('quantity_ordered')

        qs = Inventory.objects.filter(product=product).first()
        available = int(qs.quantity)


        if product and quantity:
            if available < quantity:
                raise serializers.ValidationError(f"Insufficient stock for Product '{product.name}'. Available: {available}, requested: {quantity}.")

        return data

class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer for an Order
    """
    items = OrderItemSerializer(source='orderitem_set',many=True)
    class Meta:
        model = Orders
        fields = ['order_id', 'delivery_address', 'create_time', 'payment_method', 'order_status', 'customer_notes', 'total_price', 'items', 'employee','member']
        read_only_fields = ['create_time', 'payment_method', 'total_price', 'employee', 'order_id']

    def create(self, validated_data):
        """
        Create an Order with nested OrderItems.
        Decrement the product stock accordingly and calculate the total amount.
        """
        request = self.context.get('request')
        salesperson = request.user.salesperson

        # Extract nested Order items data
        items = validated_data.pop('items', [])
        total_amount = 0  # to accumulate total Order amount

        with transaction.atomic():
            # Create the Order record
            order_instance = Orders.objects.create(employee = salesperson, **validated_data)
            for idx, item in enumerate(items, start=1):
                pro = item['product']
                quantity = item['quantity_ordered']
                price = pro.price
                total_amount += quantity * price

                # Create the OrderItem record

                OrderItem.objects.create(item_id = idx, order=order_instance, product=pro, quantity_ordered=quantity)
                # Update Product stock
                inv = Inventory.objects.filter(product=pro).first()
                inv.quantity = str(int(inv.quantity) - quantity)
                inv.save()

            # Update Order total amount
            order_instance.total_price = total_amount
            order_instance.save()
        return order_instance

    def update(self, instance, validated_data):
        """
        Update an existing Order and update inventory stock
        If the order is canceled, restore stock.
        If new items are provided, remove old items and re-add new ones.
        """

        items = validated_data.pop('items', None)

        if validated_data.get('order_status') == 'Canceled' and items is not None:
            raise serializers.ValidationError(f"Order '{instance.order_id}' has been canceled.")

        validated_data.pop('employee', None)

        # Use a transaction to ensure data integrity if any stock checks fail.
        with transaction.atomic():
            if 'order_status' in validated_data and validated_data['order_status'] == 'Canceled' and instance.order_status != 'Canceled':
                for old_item in instance.orderitem_set.all():
                    # Add back the stock.
                    inv = Inventory.objects.filter(product=old_item.product).first()
                    inv.quantity = str(int(inv.quantity) + old_item.quantity_ordered)
                    inv.save()

            # If new items are provided, replace the old items.
            if items is not None:
                # First, restore the stock from existing items.
                for old_item in instance.orderitem_set.all():

                    inv = Inventory.objects.filter(product=old_item.product).first()
                    inv.quantity = str(int(inv.quantity) + old_item.quantity_ordered)
                    inv.save()


                # Remove all old items.
                instance.orderitem_set.all().delete()

                # Recalculate total with new items.
                new_total_amount = 0
                for idx, item in enumerate(items, start=1):
                    pro = item['product']
                    quantity = item['quantity_ordered']
                    price = pro.price
                    new_total_amount += quantity * price

                    OrderItem.objects.create(item_id = idx, order=instance, product=pro, quantity_ordered=quantity)

                    inv = Inventory.objects.filter(product=pro).first()
                    inv.quantity = str(int(inv.quantity) - quantity)
                    inv.save()

                instance.total_price = new_total_amount

            # Update other fields (besides items).
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()
        return instance
















