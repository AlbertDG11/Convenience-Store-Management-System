from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializer import *

# Create your views here.
from django.http import HttpResponse

def index(request):
    return HttpResponse("Employee page")


class EmployeeView(APIView):
    i = 0
    def get(self, request):
        EmployeeView.i += 1
        print("Is asking" + str(EmployeeView.i))
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)