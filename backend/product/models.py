from django.db import models

# Create your models here.



# Table Product
class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    price_after = models.DecimalField(max_digits=5, decimal_places=2)
    
    def __str__(self):
        return f"Prodcuct {self.id}"

#Table Food Product
class Foodproduct(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        primary_key=True
    )
    
    foodtype = models.CharField(max_length=100)
    storage_cond = models.CharField(max_length=100)
    expiration = models.DateField(auto_now=False, auto_now_add=False)
    
    class Meta:
        db_table = 'foodproduct'
        managed = False
        
#Table Non-food Product
class Nonfoodproduct(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        primary_key=True
    )
    
    warranty_period = models.DurationField()
    brand = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'nonfoodproduct'
        managed = False
        
#Table Inventory
class Inventory(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        primary_key=True
    )
    
    location = models.CharField(max_length=255)
    quantity = models.IntegerField(null=False, default=1)
    status = models.CharField(max_length=100, default='')
    inventory_id = models.AutoField()
    
    class Meta:
        db_table = 'inventory'
        managed = False

