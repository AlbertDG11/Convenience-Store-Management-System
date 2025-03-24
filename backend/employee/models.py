from django.db import models

# Create your models here.
class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    salary = models.FloatField(null=True, blank=True)
    login_password = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'EMPLOYEE'
        managed = False

    def __str__(self):
        return self.name