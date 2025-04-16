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
        # salespersons = Salesperson.objects.values(
        #     'employee_id',
        #     'employee_id__name',
        #     'employee_id__email',
        #     'employee_id__phone_number',
        #     'employee_id__salary'
        # )
        salespersons = Salesperson.objects.all()
        #salespersons_serializer = SalespersonSerializer(salespersons, many=True)
        purchasepersons = PurchasePerson.objects.all()
        #purchasepersons_serializer = PurchasePersonSerializer(purchasepersons, many=True)
        managers = Manager.objects.all()
        #managers_serializer = ManagerSerializer(managers, many=True)

        employees = []
        for salesperson in salespersons:
            employees.append({
                'employee_id': salesperson.employee_id.employee_id,
                'name': salesperson.employee_id.name,
                'email': salesperson.employee_id.email,
                'phone': salesperson.employee_id.phone_number,
                'salary': salesperson.employee_id.salary,
                'sales_target': salesperson.sales_target,
                'role': 0,
            })
        
        for purchaseperson in purchasepersons:
            employees.append({
                'employee_id': purchaseperson.employee_id.employee_id,
                'name': purchaseperson.employee_id.name,
                'email': purchaseperson.employee_id.email,
                'phone': purchaseperson.employee_id.phone_number,
                'salary': purchaseperson.employee_id.salary,
                'purchase_section': purchaseperson.purchase_section,
                'role': 1
            })

        for manager in managers:
            employees.append({
                'employee_id': manager.employee_id.employee_id,
                'name': manager.employee_id.name,
                'email': manager.employee_id.email,
                'phone': manager.employee_id.phone_number,
                'salary': manager.employee_id.salary,
                'management_level': manager.management_level,
                'role': 2
            })        

        #employees = list(salespersons) + list(purchasepersons) + list(managers)
        
        saleperson_manager_relations = SalespersonManagerManagement.objects.values_list('salesperson_id', 'manager_id')
        purchaseperson_manager_relations = PurchasepersonManagerManagement.objects.values_list('purchaseperson_id', 'manager_id')

        managers_to_salepersons = defaultdict(list)
        salepersons_to_managers = defaultdict(list)
        managers_to_purchasepersons = defaultdict(list)
        purchasepersons_to_managers = defaultdict(list)

        for salesperson_id, manager_id in saleperson_manager_relations:
            managers_to_salepersons[manager_id].append(salesperson_id)
            salepersons_to_managers[salesperson_id].append(manager_id)
        
        for purchaseperson_id, manager_id in purchaseperson_manager_relations:
            managers_to_purchasepersons[manager_id].append(purchaseperson_id)
            purchasepersons_to_managers[purchaseperson_id].append(manager_id)

        for emp in employees:
            if emp['role'] == 0:
                emp['management'] = salepersons_to_managers.get(emp['employee_id'], [])
            elif emp['role'] == 1:
                emp['management'] = purchasepersons_to_managers.get(emp['employee_id'], [])
            elif emp['role'] == 2:
                emp['management'] = managers_to_salepersons.get(emp['employee_id'], [])
                emp['management'] += managers_to_purchasepersons.get(emp['employee_id'], [])
        
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
                    street_address=address['street_address'],
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