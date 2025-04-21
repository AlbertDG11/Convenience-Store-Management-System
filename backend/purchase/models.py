from django.core.validators import MinValueValidator
from django.db import models

from backend.employee.models import PurchasePerson
from backend.product.models import Product
from backend.supplier.models import Supplier


# Create your models here.

class InventoryPurchase(models.Model):
    purchase_id = models.AutoField(primary_key=True)
    purchase_time = models.DateTimeField(auto_now_add=True)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    supplier = models.ForeignKey(
        Supplier, on_delete=models.SET_NULL, null=True, blank=True, db_column='Supplier_id'
    )
    employee = models.ForeignKey(
        PurchasePerson, on_delete=models.SET_NULL, null=True, blank=True, db_column='Employee_id'
    )

    class Meta:
        db_table = 'inventory_purchase'


class PurchaseItem(models.Model):
    id = models.AutoField(primary_key=True)
    purchase = models.ForeignKey(
        InventoryPurchase, on_delete=models.CASCADE, db_column='Purchase_id'
    )
    item_id = models.IntegerField()
    product = models.ForeignKey(
        Product, on_delete=models.RESTRICT, null=True, blank=True, db_column='Product_id'
    )
    quantity_purchased = models.IntegerField()

    class Meta:
        db_table = 'purchase_item'
        unique_together = (
            ('purchase', 'item_id'),
        )
