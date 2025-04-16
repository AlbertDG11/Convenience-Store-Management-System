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

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serialiser = WholeEmployeeSerialiser(data=request.data)
        if serialiser.is_valid():
            valid_data = serialiser.validated_data
            employee = Employee.objects.create(
                employee_id=valid_data['employee_id'],
                name=valid_data['name'],
                email=valid_data['email'],
                phone_number=valid_data['phone_number'],
                salary=valid_data['salary'],
                login_password=valid_data['login_password']
            )

            for address in valid_data['address']:
                EmployeeAddress.objects.create(
                    employee=employee,
                    province=address['province'],
                    city=address['city'],
                    street_address=address['street_address']
                    post_code=address['post_code']
                )

            if valid_data['role'] == 0:
                Salesperson.objects.create(
                    employee_id=valid_data['employee_id'],
                    sales_target=valid_data.get('sales_target')
                )
                SalespersonManagerManagement.create(
                    salesperson_id=valid_data['employee_id'],
                    manager_id=valid_data.get('management')[0]
                )
            
            elif valid_data['role'] == 1:
                PurchasePerson.objects.create(
                    employee_id=valid_data['employee_id'],
                    purchase_section=valid_data.get('purchase_section')
                )
                PurchasepersonManagerManagement.create(
                    salesperson_id=valid_data['employee_id'],
                    manager_id=valid_data.get('management')[0]
                )

            elif valid_data['role'] == 2:
                Manager.objects.create(
                    employee_id=valid_data['employee_id'],
                    management_level=valid_data.get('management_level')
                )

            employee.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        serialiser = WholeEmployeeSerialiser(data=request.data)

        if serialiser.is_valid():
            data = serialiser.validated_data

            employee = Employee.objects.get(pk=data['employee_id'])

            employee['name'] = data['name'],
            employee['email'] = data['email'],
            employee['phone_number'] = data['phone_number'],
            employee['salary'] = data['salary'],
            employee['login_password'] = data['login_password']

            employee.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        serialiser = WholeEmployeeSerialiser(data=request.data)
        if serialiser.is_valid():
            data = serialiser.validated_data
            employee = Employee.objects.get(pk=data['employee_id'])
            employee.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)