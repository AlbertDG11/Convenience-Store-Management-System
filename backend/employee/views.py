#from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializer import *
from collections import defaultdict

# Create your views here.
from django.http import HttpResponse

# def index(request):
#     return HttpResponse("Employee page")


class EmployeeView(APIView):
    # i = 0
    
    # Query employees
    def get(self, request):
        # EmployeeView.i += 1
        # print("Is asking" + str(EmployeeView.i))
        salespersons = Salesperson.objects.all()
        #salespersons_serializer = SalespersonSerializer(salespersons, many=True)
        purchasepersons = PurchasePerson.objects.all()
        #purchasepersons_serializer = PurchasePersonSerializer(purchasepersons, many=True)
        managers = Manager.objects.all()
        #managers_serializer = ManagerSerializer(managers, many=True)

        employees = salespersons + purchasepersons + managers
        
        saleperson_manager_relations = SalespersonManagerManagement.objects.all()
        purchaseperson_manager_relations = PurchasepersonManagerManagement.objects.all()

        managers_to_salepersons = defaultdict(list)
        salepersons_to_managers = defaultdict(list)
        managers_to_purchasepersons = defaultdict(list)
        purchasepersons_to_managers = defaultdict(list)

        for rel in saleperson_manager_relations:
            managers_to_salepersons[rel.manager_id].append(rel.salesperson_id)
            salepersons_to_managers[rel.salesperson_id].append(rel.manager_id)
        
        for rel in purchaseperson_manager_relations:
            managers_to_purchasepersons[rel.manager_id].append(rel.purchaseperson_id)
            purchasepersons_to_managers[rel.purchaseperson_id].append(rel.manager_id)

        for emp in employees:
            if isinstance(emp, Salesperson):
                emp.management = salepersons_to_managers.get(emp.employee_id, [])
            elif isinstance(emp, PurchasePerson):
                emp.management = purchasepersons_to_managers.get(emp.employee_id, [])
            else:
                emp.management = managers_to_salepersons.get(emp.employee_id, [])
                emp.management += managers_to_purchasepersons.get(emp.employee_id, [])
        
        serializer = WholeEmployeeSerializer(employees, many=True)

        return Response(serializer.data)
    
    def post(self, request):
        print("POST received with data:", request.data)
        # serializer = EmployeeSerializer(data=request.data)
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response({"message": "Employee added successfully"}, status=status.HTTP_201_CREATED)
        # else:
        #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)