from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from ..employee.models import Employee
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime, timedelta
import jwt
from django.conf import settings


class AuthenticationSerializer(TokenObtainPairSerializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        account = attrs.get("username")
        password = attrs.get("password")

        try:
            employee = Employee.objects.get(employee_id=account)
        except Employee.DoesNotExist:
            raise serializers.ValidationError("Invalid id")

        if employee.login_password != password:
            raise serializers.ValidationError("Wrong password")

        payload = {
            "user_id": employee.employee_id,
            "role": employee.role,
            "exp": datetime.utcnow() + timedelta(minutes=300),
            "iat": datetime.utcnow(),
        }

        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

        return {
            "access": token,
            "user": {
                "id": employee.employee_id,
                "role": employee.role,
            }
        }