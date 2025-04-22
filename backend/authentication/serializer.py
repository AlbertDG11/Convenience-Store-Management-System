from rest_framework import serializers
from ..employee.models import Employee
from datetime import datetime, timedelta
import jwt
from django.conf import settings
from .utils import hash_password


USE_HASH = True

class AuthenticationSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        account = attrs.get("username")
        password = attrs.get("password")

        try:
            employee = Employee.objects.get(employee_id=account)
        except Employee.DoesNotExist:
            raise serializers.ValidationError("Invalid id")
        
        if USE_HASH:
            result = (employee.login_password == hash_password(password))
        else:
            result = (employee.login_password == password)

        if not result:
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