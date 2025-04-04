from rest_framework import serializers
from .models import *


# # Serialiser for Employee model
# class EmployeeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Employee
#         fields = ['employee_id', 'name', 'email', 'phone_number', 
#                   'salary', 'login_password']


# Serialiser for Employee Address model
class EmployeeAddressSerializer(serializers.ModelSerializer):
    employee_id = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = EmployeeAddress
        fields = ['employee_id', 'province', 'city', 'street_address', 'post_code']


# Serialiser for Whole Employee model
class WholeEmployeeSerializer(serializers.Serializer):
    employee_id = serializers.IntegerField()
    name = serializers.CharField()
    email = serializers.CharField()
    phone_number = serializers.CharField()
    salary = serializers.FloatField()
    login_password = serializers.CharField()
    addresses = EmployeeAddressSerializer(many=True)
    role = serializers.IntegerField()
    sales_target = serializers.FloatField(required=False, allow_null=True)
    purchase_section = serializers.CharField(required=False, allow_null=True)
    management_level = serializers.CharField(required=False, allow_null=True)
    management = serializers.ListField(child = serializers.IntegerField)


# # Serialiser for Salesperson model
# class SalespersonSerializer(serializers.ModelSerializer):
#     employee = EmployeeSerializer()

#     class Meta:
#         model = Salesperson
#         fields = ['employee', 'sales_target']


# # Serialiser for Purchase Person model
# class PurchasePersonSerializer(serializers.ModelSerializer):
#     employee = EmployeeSerializer()

#     class Meta:
#         model = PurchasePerson
#         fields = ['employee', 'purchase_section']


# # Serialiser for Manager model
# class ManagerSerializer(serializers.ModelSerializer):
#     employee = EmployeeSerializer()

#     class Meta:
#         model = Manager
#         fields = ['employee', 'management_level']


# # Serialiser for Salesperson Manager Management model
# class SalespersonManagerManagementSerializer(serializers.ModelSerializer):
#     salesperson = SalespersonSerializer()
#     manager = ManagerSerializer()

#     class Meta:
#         model = SalespersonManagerManagement
#         fields = ['salesperson', 'manager']


# # Serialiser for Purchaseperson Manager Management model
# class PurchasepersonManagerManagementSerializer(serializers.ModelSerializer):
#     purchaseperson = PurchasePersonSerializer()
#     manager = ManagerSerializer()

#     class Meta:
#         model = PurchasepersonManagerManagement
#         fields = ['purchaseperson', 'manager']