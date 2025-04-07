from django.db import models

# Create your models here.
class Supplier(models.Model):
    supplier_id = models.AutoField(primary_key=True)
    status = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'supplier'
        managed = False
    
    def __str__(self):
        return self.name
    
class Supplieraddress(models.Model):
    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.CASCADE
    )
    province = models.CharField(max_length=20)
    city = models.CharField(max_length=20)
    street_address = models.CharField(max_length=255)
    post_code = models.CharField(max_length=7)

    class Meta:
        unique_together = ('employee', 'province', 'city', 'street_address', 'post_code')
        db_table = 'supplier_address'
        managed = False
