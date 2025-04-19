from django.db import models

# Create your models here.
# Table Employee
from django.db import models

class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    phone_number = models.CharField(max_length=20)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    login_password = models.CharField(max_length=255, null=True, blank=True)
    role = models.PositiveSmallIntegerField(
        choices=[
            (0, 'Salesperson'),
            (1, 'Purchaseperson'),
            (2, 'Manager')
        ],
        default=0
    )
    supervisor = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='Supervisor_id',
        related_name='subordinates'
    )

    class Meta:
        db_table = 'employee'


class EmployeeAddress(models.Model):
    id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(
        Employee, on_delete=models.CASCADE, db_column='Employee_id',
    )
    province = models.CharField(max_length=20)
    city = models.CharField(max_length=20)
    street_address = models.CharField(max_length=255)
    post_code = models.CharField(max_length=7)

    class Meta:
        db_table = 'employee_address'
        unique_together = (
            ('employee', 'province', 'city', 'street_address', 'post_code'),
        )


class Salesperson(models.Model):
    employee = models.OneToOneField(
        Employee, on_delete=models.CASCADE, primary_key=True, db_column='Employee_id'
    )
    sales_target = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = 'salesperson'


class Manager(models.Model):
    employee = models.OneToOneField(
        Employee, on_delete=models.CASCADE, primary_key=True, db_column='Employee_id'
    )
    management_level = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        db_table = 'manager'


class PurchasePerson(models.Model):
    employee = models.OneToOneField(
        Employee, on_delete=models.CASCADE, primary_key=True, db_column='Employee_id'
    )
    purchase_section = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'purchase_person'
