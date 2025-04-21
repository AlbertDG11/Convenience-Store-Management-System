from django.shortcuts import render
from ..employee.models import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.
# class AuthenticationView(APIView):
#     def post(self, request):
#         user_id = request.data.get('account')
#         password = request.data.get('password')

#         try:
#             employee = Employee.objects.get(pk=user_id)
#             if employee.login_password == password:
#                 return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
#             else:
#                 return Response({"error": "Incorrect user or password"}, status=status.HTTP_403_FORBIDDEN)
#         except Employee.DoesNotExist:
#             return Response({"error": "Incorrect user or password"}, status=status.HTTP_403_FORBIDDEN)

#from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import AuthenticationSerializer


class AuthenticationView(APIView):
    def post(self, request):
        serializer = AuthenticationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)