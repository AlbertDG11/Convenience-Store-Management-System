from django.core.validators import MinValueValidator
from django.db import models

from backend.customer.models import Membership
from backend.employee.models import Salesperson
from backend.product.models import Product

class Order(models.Model):
    """
    Represents an Order
    An Order can contain multiple Order items
    """

    membership = models.ForeignKey(Membership, on_delete=models.SET_NULL, null=True, blank=True)
    salesperson = models.ForeignKey(Salesperson, on_delete=models.SET_NULL, null=True, blank=True)

    create_time = models.DateTimeField(auto_now_add=True)
    delivery_address = models.CharField(max_length=100)
    payment_method = models.CharField(max_length=50)
    Order_status_choice = [('Pending', 'Pending'),('Completed', 'Completed'),('Cancelled', 'Cancelled')]
    status = models.CharField(max_length=100, choices=Order_status_choice, default='Pending')
    customer_notes = models.TextField(blank=True, null=True)

    total_amount = models.DecimalField(max_digits=10, decimal_places=2,default=0)

    def __str__(self):
        return f"Order {self.pk}"

    class Meta:
        # Orders should be listed from newest to oldest
        ordering = ['-create_time']

class OrderItem(models.Model):
    """
    Represents an Order item
    """

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.RESTRICT)

    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)]) # At least 1

    def __str__(self):
        return f"{self.product.name} x {self.quantity} (Order #{self.order.id})"















