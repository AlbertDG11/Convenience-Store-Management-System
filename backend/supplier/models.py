from django.db import models

# Create your models here.
class Supplier(models.Model):
    supplier_id = models.AutoField(primary_key=True)
    supplier_name = models.CharField(max_length=100)
    supplier_status = models.CharField(max_length=100, null=True, blank=True)
    contact_name = models.CharField(max_length=100, null=True, blank=True)
    contact_email = models.EmailField(max_length=255, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        db_table = 'supplier'


class SupplierAddress(models.Model):
    id = models.AutoField(primary_key=True)
    supplier = models.ForeignKey(
        Supplier, on_delete=models.CASCADE, db_column='Supplier_id', related_name='addresses'
    )
    city = models.CharField(max_length=50)
    province = models.CharField(max_length=50)
    street_address = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)

    class Meta:
        db_table = 'supplier_address'
        unique_together = (
            ('supplier', 'city', 'province', 'street_address', 'postal_code'),
        )


