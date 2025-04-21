from django.db import models

class Product(models.Model):
    product_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=20)
    type = models.CharField(max_length=50, null=True, blank=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_after_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = 'product'
        
    @property
    def id(self):
        return self.product_id


class FoodProduct(models.Model):
    product = models.OneToOneField(
        Product, on_delete=models.CASCADE, primary_key=True, db_column='Product_id'
    )
    expiration_date = models.DateField(null=True, blank=True)
    storage_condition = models.CharField(max_length=50, null=True, blank=True)
    food_type = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'food_product'


class NonFoodProduct(models.Model):
    product = models.OneToOneField(
        Product, on_delete=models.CASCADE, primary_key=True, db_column='Product_id'
    )
    brand = models.CharField(max_length=99, null=True, blank=True)
    warranty_period = models.CharField(max_length=99, null=True, blank=True)

    class Meta:
        db_table = 'non_food_product'


class Inventory(models.Model):
    id = models.AutoField(primary_key=True)
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, db_column='Product_id'
    )
    inventory_id = models.IntegerField()
    status = models.CharField(max_length=50, null=True, blank=True)
    location = models.CharField(max_length=50, null=True, blank=True)
    quantity = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'inventory'
        unique_together = (
            ('product', 'inventory_id'),
        )
