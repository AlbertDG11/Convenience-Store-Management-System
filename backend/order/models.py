from django.core.validators import MinValueValidator
from django.db import models

from backend.customer.models import Membership
from backend.employee.models import Salesperson
from backend.product.models import Product

class Orders(models.Model):
    order_id = models.AutoField(primary_key=True)
    create_time = models.DateTimeField()
    delivery_address = models.CharField(max_length=200, null=True, blank=True)
    payment_method = models.CharField(max_length=50, null=True, blank=True)
    order_status = models.CharField(max_length=20, null=True, blank=True)
    customer_notes = models.TextField(null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    member = models.ForeignKey(
        Membership, on_delete=models.SET_NULL, null=True, blank=True, db_column='Member_id'
    )
    employee = models.ForeignKey(
        Salesperson, on_delete=models.SET_NULL, null=True, blank=True, db_column='Employee_id'
    )

    class Meta:
        db_table = 'orders'


class OrderItem(models.Model):
    id = models.AutoField(primary_key=True)
    order = models.ForeignKey(
        Orders, on_delete=models.CASCADE, db_column='Order_id'
    )
    item_id = models.IntegerField()
    product = models.ForeignKey(
        Product, on_delete=models.RESTRICT, null=True, blank=True, db_column='Product_id'
    )
    quantity_ordered = models.IntegerField()

    class Meta:
        db_table = 'order_item'
        unique_together = (
            ('order', 'item_id'),
        )














