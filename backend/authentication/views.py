from django.shortcuts import render
from ..employee.model import *
from rest_framework import status
from rest_framework.response import Response

# Create your views here.
class AuthenticationView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        password = request.data.get('password')

        employee = Employee.objects.get(pk=user_id)
        if employee and employee['password'] == password:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)