from django.db import models

# Create your models here.
# Table Employee
class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    salary = models.FloatField(null=True, blank=True)
    login_password = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'employee'
        managed = False

    def __str__(self):
        return self.name


# Table Employee Address
class EmployeeAddress(models.Model):
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE
    )
    province = models.CharField(max_length=20)
    city = models.CharField(max_length=20)
    street_address = models.CharField(max_length=255)
    post_code = models.CharField(max_length=7)

    class Meta:
        unique_together = ('employee', 'province', 'city', 'street_address', 'post_code')
        db_table = 'employee_address'
        managed = False


# Table Salesperson
class Salesperson(models.Model):
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        primary_key=True
    )
    sales_target = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = 'salesperson'
        managed = False


# Table Manager
class Manager(models.Model):
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        primary_key=True
    )
    management_level = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        db_table = 'manager'
        managed = False


# Table Purchase Person
class PurchasePerson(models.Model):
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        primary_key=True
    )
    Purchase_section = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'purchase_person'
        managed = False


# Table Salesperson Manager Management
class SalespersonManagerManagement(models.Model):
    salesperson = models.ForeignKey(
        Salesperson,
        on_delete=models.PROTECT)
    manager = models.ForeignKey(
        Manager,
        on_delete=models.PROTECT
        )

    class Meta:
        unique_together = ('salesperson', 'manager')
        db_table = 'salesperson_manager_management'
        managed = False


# Table Purchaseperson Manager Management
class PurchasepersonManagerManagement(models.Model):
    purchaseperson = models.ForeignKey(
        PurchasePerson,
        on_delete=models.PROTECT
        )
    manager = models.ForeignKey(
        Manager,
        on_delete=models.PROTECT
        )

    class Meta:
        unique_together = ('purchaseperson', 'manager')
        db_table = 'purchaseperson_manager_management'
        managed = False