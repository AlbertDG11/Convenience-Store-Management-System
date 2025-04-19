from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializer import *
#from collections import defaultdict
from django.http import HttpResponse

# Create your views here.
class EmployeeView(APIView):
    # Query employees
    def get(self, request):
        salespersons = Salesperson.objects.all()
        purchasepersons = PurchasePerson.objects.all()
        managers = Manager.objects.all()

        employees = []
        for salesperson in salespersons:
            employees.append({
                'employee_id': salesperson.employee_id.employee_id,
                'name': salesperson.employee_id.name,
                'email': salesperson.employee_id.email,
                'phone_number': salesperson.employee_id.phone_number,
                'salary': salesperson.employee_id.salary,
                'sales_target': salesperson.sales_target,
                'role': 0,
            })
        
        for purchaseperson in purchasepersons:
            employees.append({
                'employee_id': purchaseperson.employee_id.employee_id,
                'name': purchaseperson.employee_id.name,
                'email': purchaseperson.employee_id.email,
                'phone_number': purchaseperson.employee_id.phone_number,
                'salary': purchaseperson.employee_id.salary,
                'purchase_section': purchaseperson.purchase_section,
                'role': 1
            })

        for manager in managers:
            employees.append({
                'employee_id': manager.employee_id.employee_id,
                'name': manager.employee_id.name,
                'email': manager.employee_id.email,
                'phone_number': manager.employee_id.phone_number,
                'salary': manager.employee_id.salary,
                'management_level': manager.management_level,
                'role': 2
            })

        serialiser = WholeEmployeeSerializer(employees, many=True)

        return Response(serialiser.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serialiser = WholeEmployeeSerializer(data=request.data)
        if serialiser.is_valid():
            valid_data = serialiser.validated_data
            employee = Employee.objects.create(
                #employee_id=valid_data['employee_id'],
                name=valid_data['name'],
                email=valid_data['email'],
                phone_number=valid_data['phone_number'],
                salary=valid_data.get('salary'),
                login_password=valid_data.get('login_password')
            )
            employee_id = employee.pk

            # for address in valid_data['addresses']:
            #     addressObj = EmployeeAddress.objects.create(
            #         employee=employee,
            #         province=address['province'],
            #         city=address['city'],
            #         street_address=address['street_address'],
            #         post_code=address['post_code']
            #     )
            #     addressObj.save()

            if valid_data['role'] == 0:
                salesperson = Salesperson.objects.create(
                    employee_id=employee,
                    sales_target=valid_data.get('sales_target')
                )
                # salespersonManagement = SalespersonManagerManagement.create(
                #     salesperson_id=valid_data['employee_id'],
                #     manager_id=valid_data.get('management')[0]
                # )
                # salespersonManagement.save()
            
            elif valid_data['role'] == 1:
                purchaseperson = PurchasePerson.objects.create(
                    employee_id=employee,
                    purchase_section=valid_data.get('purchase_section')
                )
                # purchasepersonManament = PurchasepersonManagerManagement.create(
                #     salesperson_id=valid_data['employee_id'],
                #     manager_id=valid_data.get('management')[0]
                # )
                # purchasepersonManament.save()

            elif valid_data['role'] == 2:
                Manager.objects.create(
                    employee_id=employee,
                    management_level=valid_data.get('management_level')
                )
                
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class EmployeeDetailView(APIView):
    def get(self, request, employee_id):
        employee_info = {}
        is_found = False

        try:
            salesperson = Salesperson.objects.get(employee_id=employee_id)
            employee = salesperson.employee_id
            employee_info = {
                "role": 0,
                "name": employee.name,
                "email": employee.email,
                "sales_target": salesperson.sales_target,
                "phone_number": employee.phone_number,
                "salary": employee.salary,
            }
            is_found = True
        except Salesperson.DoesNotExist:
            is_found = False

        if not is_found:
            try:
                purchaseperson = PurchasePerson.objects.get(employee_id=employee_id)
                employee = purchaseperson.employee_id
                employee_info = {
                    "role": 1,
                    "name": employee.name,
                    "email": employee.email,
                    "purchase_section": purchaseperson.purchase_section,
                    "phone_number": employee.phone_number,
                    "salary": employee.salary,
                }
                is_found = True
            except PurchasePerson.DoesNotExist:
                is_found = False

        if not is_found:
            try:
                manager = Manager.objects.get(employee_id=employee_id)
                employee = manager.employee_id
                employee_info = {
                    "role": 2,
                    "name": employee.name,
                    "email": employee.email,
                    "management_level": manager.management_level,
                    "phone_number": employee.phone_number,
                    "salary": employee.salary,
                }
                is_found = True
            except Manager.DoesNotExist:
                return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # employee_info['addresses'] = []
        # addresses = EmployeeAddress.objects.filter(employee_id=employee_id)

        # for address in addresses:
        #     employee_info['addresses'].append({
        #         "province": address['province'],
        #         "city": address['city'],
        #         "street_address": address['street_address'],
        #         "post_code": address['post_code']
        #     })
        
        employee_info['management'] = []
        if employee_info['role'] == 0:
            saleperson_manager_relations = SalespersonManagerManagement.objects.values_list('salesperson_id', 'manager_id')
            if saleperson_manager_relations:
                for salesperson_id, manager_id in saleperson_manager_relations:
                    if salesperson_id == employee_id:
                        employee = Employee.objects.get(pk=manager_id)
                        employee_info['management'].append({
                            'employee_id': manager_id,
                            'name': employee.name
                        })
        
        elif employee_info['role'] == 1:
            purchaseperson_manager_relations = PurchasepersonManagerManagement.objects.values_list('purchaseperson_id', 'manager_id')
            if purchaseperson_manager_relations:
                for purchaseperson_id, manager_id in purchaseperson_manager_relations:
                    if purchaseperson_id == employee_id:
                        employee = Employee.objects.get(pk=manager_id)
                        employee_info['management'].append({
                            'employee_id': manager_id,
                            'name': employee.name
                        })

        elif employee_info['role'] == 2:
            saleperson_manager_relations = SalespersonManagerManagement.objects.values_list('salesperson_id', 'manager_id')
            if saleperson_manager_relations:
                for salesperson_id, manager_id in saleperson_manager_relations:
                    if manager_id == employee_id:
                        employee = Employee.objects.get(pk=salesperson_id)
                        employee_info['management'].append({
                            'employee_id': salesperson_id,
                            'name': employee.name,
                            'role': 0
                        })
            
            purchaseperson_manager_relations = PurchasepersonManagerManagement.objects.values_list('purchaseperson_id', 'manager_id')
            if purchaseperson_manager_relations:
                for purchaseperson_id, manager_id in purchaseperson_manager_relations:
                    if manager_id == employee_id:
                        employee = Employee.objects.get(pk=purchaseperson_id)
                        employee_info['management'].append({
                            'employee_id': purchaseperson_id,
                            'name': employee.name,
                            'role': 1
                        })
        
        serialiser = WholeEmployeeSerializer(employee_info)

        return Response(serialiser.data, status=status.HTTP_200_OK)
    
    def put(self, request, employee_id):
        serialiser = WholeEmployeeSerializer(data=request.data)

        if serialiser.is_valid():
            data = serialiser.validated_data
            employee = Employee.objects.get(pk=employee_id)

            employee.name = data['name']
            employee.email = data['email']
            employee.phone_number = data['phone_number']
            employee.salary = data['salary']
            employee.login_password = data['login_password']

            employee.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, employee_id):
        try:
            employee = Employee.objects.get(pk=employee_id)
            employee.delete()
            return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)