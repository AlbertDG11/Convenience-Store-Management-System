from django.core.validators import MinValueValidator
from django.db import models

from backend.product.models import Product
from backend.supplier.models import Supplier


# Create your models here.

class InventoryPurchase(models.Model):
    """
    Model representing an inventory purchase made from a supplier.
    """
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True)
    purchase_time = models.DateTimeField(auto_now_add=True)
    total_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )

    def __str__(self):
        supplier_name = self.supplier.name
        return f"{supplier_name} x {self.purchase_time}"

    class Meta:
        # Orders the inventory purchases by purchase time in descending order.
        ordering = ['-purchase_time']


class PurchaseItem(models.Model):
    """
    Model representing an item in an inventory purchase.
    """
    product = models.ForeignKey(Product, on_delete=models.RESTRICT, null=False, related_name="purchase_items")
    purchase = models.ForeignKey(InventoryPurchase, on_delete=models.RESTRICT, null=False, related_name="items")
    quantity_purchased = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    def __str__(self):
        product_name = self.product.name
        return f"{product_name} x {self.quantity_purchased}"


