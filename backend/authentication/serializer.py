from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from ..employee.models import Employee
from rest_framework_simplejwt.tokens import RefreshToken


class AuthenticationSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        account = attrs.get("username")
        password = attrs.get("password")

        try:
            employee = Employee.objects.get(employee_id=account)
        except Employee.DoesNotExist:
            raise serializers.ValidationError("Invalid id")

        if employee.login_password != password:
            raise serializers.ValidationError("Wrong password")

        refresh = RefreshToken.for_user(employee)
        data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': employee.employee_id,
                'role': employee.role
            }
        }
        return data