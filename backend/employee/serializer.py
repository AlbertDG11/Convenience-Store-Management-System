from rest_framework import serializers
from .models import *


# Serialiser for Employee Address
class EmployeeAddressSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    employee_id = serializers.IntegerField(required=False, allow_null=True)
    province = serializers.CharField(required=False, allow_null=True)
    city = serializers.CharField(required=False, allow_null=True)
    street_address = serializers.CharField(required=False, allow_null=True)
    post_code = serializers.CharField(required=False, allow_null=True)


class ManagementRelationSerializer(serializers.Serializer):
    employee_id = serializers.IntegerField(required=False, allow_null=True)
    name = serializers.CharField(required=False, allow_null=True)
    role = serializers.IntegerField(required=False, allow_null=True)


# Serialiser for Whole Employee model
class WholeEmployeeSerializer(serializers.Serializer):
    employee_id = serializers.IntegerField(required=False, allow_null=True)
    name = serializers.CharField(required=False, allow_null=True)
    email = serializers.CharField(required=False, allow_null=True)
    phone_number = serializers.CharField(required=False, allow_null=True)
    salary = serializers.FloatField(required=False, allow_null=True)
    login_password = serializers.CharField(required=False, allow_null=True)
    addresses = EmployeeAddressSerializer(many=True, required=False, allow_null=True)
    role = serializers.IntegerField(required=False, allow_null=True)
    supervisor = serializers.IntegerField(required=False, allow_null=True)
    sales_target = serializers.FloatField(required=False, allow_null=True)
    purchase_section = serializers.CharField(required=False, allow_null=True)
    management_level = serializers.CharField(required=False, allow_null=True)
    #management = serializers.ListField(child = serializers.IntegerField(), required=False, allow_null=True)
    management = ManagementRelationSerializer(many=True, required=False, allow_null=True)