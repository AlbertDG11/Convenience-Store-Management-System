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

    Membership = models.ForeignKey(Membership, on_delete=models.SET_NULL, null=True)
    Salesperson = models.ForeignKey(Salesperson, on_delete=models.SET_NULL, null=True)

    create_time = models.DateTimeField(auto_now_add=True)
    delivery_address = models.CharField(max_length=100)
    payment_method_choices = ['Cash', 'Card']
    payment_method = models.CharField(max_length=10, choices=payment_method_choices)
    Order_status_choice = ['Placed', 'Canceled']
    status = models.CharField(max_length=100, choices=Order_status_choice, default='Placed')
    customer_notes = models.TextField()

    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order {self.id}"

class OrderItem(models.Model):
    """
    Represents an Order item
    """

    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.RESTRICT)

    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)]) # At least 1

    def __str__(self):
        return f"{self.product.name} x {self.quantity} (Order #{self.order.id})"















