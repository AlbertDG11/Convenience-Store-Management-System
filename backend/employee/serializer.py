from rest_framework import serializers
from .models import *

# Serialiser for Employee model
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['employee_id', 'name', 'email', 'phone_number', 
                  'salary', 'login_password']


# Serialiser for Employee Address model
class EmployeeAddressSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer()

    class Meta:
        model = EmployeeAddress
        fields = ['employee', 'province', 'city', 'street_address', 'post_code']


# Serialiser for Salesperson model
class SalespersonSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer()

    class Meta:
        model = Salesperson
        fields = ['employee', 'sales_target']


# Serialiser for Purchase Person model
class PurchasePersonSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer()

    class Meta:
        model = PurchasePerson
        fields = ['employee', 'purchase_section']


# Serialiser for Manager model
class ManagerSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer()

    class Meta:
        model = Manager
        fields = ['employee', 'management_level']


# Serialiser for Salesperson Manager Management model
class SalespersonManagerManagementSerializer(serializers.ModelSerializer):
    salesperson = SalespersonSerializer()
    manager = ManagerSerializer()

    class Meta:
        model = SalespersonManagerManagement
        fields = ['salesperson', 'manager']


# Serialiser for Purchaseperson Manager Management model
class PurchasepersonManagerManagementSerializer(serializers.ModelSerializer):
    purchaseperson = PurchasePersonSerializer()
    manager = ManagerSerializer()

    class Meta:
        model = PurchasepersonManagerManagement
        fields = ['purchaseperson', 'manager']