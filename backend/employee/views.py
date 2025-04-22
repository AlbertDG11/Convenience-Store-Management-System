from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
import redis.exceptions
from .models import *
from .serializer import *
from ..authentication.utils import get_user_from_token, hash_password
from django.core.cache import cache
import time


USE_CACHE = True
USE_HASH = True


# Create your views here.
class EmployeeView(APIView):
    # Query employees
    def get(self, request):
        user_info = get_user_from_token(request)

        if not user_info:
            return Response({'detail': 'Unauthorized'}, status=401)

        start_time = time.time()
        if USE_CACHE:
            key = "cached_employees_full_info"
            try:
                data = cache.get(key)
                print("using cache")
                if data is not None:
                    end_time = time.time()
                    print(f"Time of using cache: {end_time - start_time:.4f}s")
                    return Response(data, status=status.HTTP_200_OK)
            except redis.exceptions.RedisError as e:
                print(f"[Redis Error] Fallback to DB: {e}")

        employee_objs = Employee.objects.all()
        employees = []

        for employee in employee_objs:
            employee_info = {
                'employee_id': employee.employee_id,
                'name': employee.name,
                'email': employee.email,
                'phone_number': employee.phone_number,
                'salary': employee.salary,
                'role': employee.role
            }
            if employee.role == 0:
                try:
                    salesperson = Salesperson.objects.get(employee=employee)
                    employee_info['sales_target'] = salesperson.sales_target
                except Salesperson.DoesNotExist:
                    employee_info['sales_target'] = None
            elif employee.role == 1:
                try:
                    purchaseperson = PurchasePerson.objects.get(employee=employee)
                    employee_info['purchase_section'] = purchaseperson.purchase_section
                except PurchasePerson.DoesNotExist:
                    employee_info['purchase_section'] = None
            elif employee.role == 2:
                try:
                    manager = Manager.objects.get(employee=employee)
                    employee_info['management_level'] = manager.management_level
                except Manager.DoesNotExist:
                    employee_info['management_level'] = None
            employees.append(employee_info)

        serialiser = WholeEmployeeSerializer(employees, many=True)

        if USE_CACHE:
            try:
                cache.set(key, serialiser.data, timeout=60 * 5)
            except redis.exceptions.RedisError as e:
                print(f"[Redis Error] Fallback to DB: {e}")

        end_time = time.time()
        print(f"Time of not using cache: {end_time - start_time:.4f}s")
        return Response(serialiser.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        user_info = get_user_from_token(request)

        if not user_info:
            return Response({'detail': 'Unauthorized'}, status=401)

        if user_info['role'] != 2:
            return Response({'detail': 'Permission denied'}, status=403)

        serialiser = WholeEmployeeSerializer(data=request.data)
        if serialiser.is_valid():
            exists_warning = False
            valid_data = serialiser.validated_data
            employee = Employee.objects.create(
                name=valid_data['name'],
                email=valid_data['email'],
                phone_number=valid_data['phone_number'],
                salary=valid_data.get('salary'),
                role=valid_data.get('role')
            )
            if USE_HASH:
                employee.login_password = hash_password(valid_data.get('password'))
            else:
                employee.login_password=valid_data.get('login_password')
            employee.save()
            
            supervisor = valid_data.get('supervisor')

            if supervisor:
                try:
                    supervisor_obj = Employee.objects.get(employee_id=supervisor)
                    employee.supervisor = supervisor_obj
                    employee.save()
                except Manager.DoesNotExist:
                    exists_warning = True
                    warning = "The supervisor is not a manager"

            for address in valid_data['addresses']:
                EmployeeAddress.objects.create(
                    employee=employee,
                    province=address['province'],
                    city=address['city'],
                    street_address=address['street_address'],
                    post_code=address['post_code']
                )
            
            if valid_data['role'] == 0:
                Salesperson.objects.create(
                    employee=employee,
                    sales_target=valid_data.get('sales_target')
                )
            
            elif valid_data['role'] == 1:
                PurchasePerson.objects.create(
                    employee=employee,
                    purchase_section=valid_data.get('purchase_section')
                )

            elif valid_data['role'] == 2:
                Manager.objects.create(
                    employee=employee,
                    management_level=valid_data.get('management_level')
                )

            if USE_CACHE:
                try:
                    cache.delete("cached_employees_full_info")
                except redis.exceptions.RedisError as e:
                    print(f"[Redis Error] Fallback to DB: {e}")
            
            if not exists_warning:
                return Response({"status": "ok"}, status=status.HTTP_200_OK)
            else:
                return Response({"warnings": warning}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Some data is empty or invalid"}, status=status.HTTP_400_BAD_REQUEST)


class EmployeeDetailView(APIView):
    def get(self, request, employee_id):
        user_info = get_user_from_token(request)

        if not user_info:
            return Response({'detail': 'Unauthorized'}, status=401)
        
        try:
            employee = Employee.objects.get(employee_id = employee_id)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

        employee_info = {
            "employee_id": employee_id,
            "name": employee.name,
            "email": employee.email,
            "phone_number": employee.phone_number,
            "salary": employee.salary,
            "role": employee.role,
            "supervisor": employee.supervisor_id
        }

        employee_info['addresses'] = []
        addresses = EmployeeAddress.objects.filter(employee=employee)
        for address in addresses:
            employee_info['addresses'].append({
                "id": address.id,
                "province": address.province,
                "city": address.city,
                "street_address": address.street_address,
                "post_code": address.post_code
            })
        
        if employee.role == 0:
            salesperson = Salesperson.objects.get(employee = employee)
            employee_info['sales_target'] = salesperson.sales_target
            if employee.supervisor:
                employee_info['management'] = [{
                    'employee_id': employee.supervisor_id,
                    'name': Employee.objects.get(employee_id = employee.supervisor_id).name
                }]
                
        elif employee.role == 1:
            purchaseperson = PurchasePerson.objects.get(employee=employee)
            employee_info["purchase_section"] = purchaseperson.purchase_section
            if employee.supervisor:
                employee_info['management'] = [{
                    'employee_id': employee.supervisor_id,
                    'name': Employee.objects.get(employee_id = employee.supervisor_id).name
                }]

        elif employee.role == 2:
            manager = Manager.objects.get(employee=employee)
            employee_info["management_level"] = manager.management_level
      
        serialiser = WholeEmployeeSerializer(employee_info)

        return Response(serialiser.data, status=status.HTTP_200_OK)
    
    def put(self, request, employee_id):
        user_info = get_user_from_token(request)

        if not user_info:
            return Response({'detail': 'Unauthorized'}, status=401)

        serialiser = WholeEmployeeSerializer(data=request.data)
        if serialiser.is_valid():
            exists_warning = False
            valid_data = serialiser.validated_data
            
            try:
                employee = Employee.objects.get(employee_id = employee_id)
            except Employee.DoesNotExist:
                return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)
            
            current_role = employee.role
            employee.name=valid_data['name']
            employee.email=valid_data['email']
            employee.phone_number=valid_data['phone_number']
            employee.salary=valid_data.get('salary')
            employee.role=valid_data.get('role')
            supervisor = valid_data.get('supervisor')
            if supervisor:
                try:
                    #manager = Manager.objects.get(employee=supervisor)
                    supervisor_obj = Employee.objects.get(employee_id=supervisor)
                    employee.supervisor = supervisor_obj
                except Manager.DoesNotExist:
                    exists_warning = True
                    warning = "The supervisor is not a manager"
            employee.save()

            updated_addresses = valid_data.get("addresses", [])
            existing_addresses = EmployeeAddress.objects.filter(employee=employee)

            updated_addresses_ids = set()
            for address in updated_addresses:
                address_id = address.get("id")
                if address_id is not None:
                    updated_addresses_ids.add(address_id)
            
            for address in updated_addresses:
                address_id = address.get("id")
                if address_id:
                    old_address = EmployeeAddress.objects.get(id=address_id)
                    old_address.province = address["province"]
                    old_address.city = address["city"]
                    old_address.street_address = address["street_address"]
                    old_address.post_code = address["post_code"]
                    old_address.save()
                else:
                    addressn = EmployeeAddress.objects.create(
                        employee=employee,
                        province=address["province"],
                        city=address["city"],
                        street_address=address["street_address"],
                        post_code=address["post_code"],
                    )
                    updated_addresses_ids.add(addressn.id)
            for address in existing_addresses:
                if address.id not in updated_addresses_ids:
                    address.delete()
            
            if current_role != employee.role:
                role_map = {
                    0: Salesperson,
                    1: PurchasePerson,
                    2: Manager
                }
                old_role = role_map.get(current_role)
                new_role = role_map.get(employee.role)
                if old_role:
                    old_role.objects.filter(employee=employee).delete()
                if new_role:
                    new_role.objects.create(
                        employee=employee
                    )

            if valid_data['role'] == 0:
                salesperson = Salesperson.objects.get(employee=employee)
                salesperson.sales_target = valid_data.get('sales_target')
                salesperson.save()
            
            elif valid_data['role'] == 1:
                salesperson = PurchasePerson.objects.get(employee=employee)
                salesperson.purchase_section = valid_data.get('purchase_section')
                salesperson.save()

            elif valid_data['role'] == 2:
                salesperson = Manager.objects.get(employee=employee)
                salesperson.management_level = valid_data.get('management_level')
                salesperson.save()

            if USE_CACHE:
                try:
                    cache.delete("cached_employees_full_info")
                except redis.exceptions.RedisError as e:
                    print(f"[Redis Error] Fallback to DB: {e}")

            if not exists_warning:
                return Response({"status": "ok"}, status=status.HTTP_200_OK)
            else:
                return Response({"status": "ok", "warnings": warning}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "The input is not valid"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, employee_id):
        user_info = get_user_from_token(request)

        if not user_info:
            return Response({'detail': 'Unauthorized'}, status=401)

        if user_info['role'] != 2:
            return Response({'detail': 'Permission denied'}, status=403)

        try:
            employee = Employee.objects.get(pk=employee_id)
            EmployeeAddress.objects.filter(employee=employee).delete()
            
            role_map = {
                0: Salesperson,
                1: PurchasePerson,
                2: Manager
            }
            role = role_map.get(employee.role)
            if role:
                role.objects.filter(employee=employee).delete()
            employee.delete()
            
            if USE_CACHE:
                try:
                    cache.delete("cached_employees_full_info")
                except redis.exceptions.RedisError as e:
                    print(f"[Redis Error] Fallback to DB: {e}")

            return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)


class SubordinateView(APIView):
    def get(self, request, manager_id):
        user_info = get_user_from_token(request)

        if not user_info:
            return Response({'detail': 'Unauthorized'}, status=401)

        if user_info['role'] != 2:
            return Response({'detail': 'Permission denied'}, status=403)
        
        manager = Employee.objects.get(employee_id=manager_id)
        employee_objs = manager.subordinates.all()
        employees = []

        for employee in employee_objs.all():
            employee_info = {
                'employee_id': employee.employee_id,
                'name': employee.name,
                'email': employee.email,
                'phone_number': employee.phone_number,
                'salary': employee.salary,
                'role': employee.role
            }
            if employee.role == 0:
                try:
                    salesperson = Salesperson.objects.get(employee=employee)
                    employee_info['sales_target'] = salesperson.sales_target
                except Salesperson.DoesNotExist:
                    employee_info['sales_target'] = None
            elif employee.role == 1:
                try:
                    purchaseperson = PurchasePerson.objects.get(employee=employee)
                    employee_info['purchase_section'] = purchaseperson.purchase_section
                except PurchasePerson.DoesNotExist:
                    employee_info['purchase_section'] = None
            elif employee.role == 2:
                try:
                    manager = Manager.objects.get(employee=employee)
                    employee_info['management_level'] = manager.management_level
                except Manager.DoesNotExist:
                    employee_info['management_level'] = None
            employees.append(employee_info)

        serialiser = WholeEmployeeSerializer(employees, many=True)

        return Response(serialiser.data, status=status.HTTP_200_OK)

    def post(self, request, manager_id):
        user_info = get_user_from_token(request)

        if not user_info:
            return Response({'detail': 'Unauthorized'}, status=401)

        if user_info['role'] != 2:
            return Response({'detail': 'Permission denied'}, status=403)

        subordinate_id = request.data.get('subordinate_id')
        supervisor_id = manager_id
        
        try:
            subordinate = Employee.objects.get(employee_id=subordinate_id)
        except Employee.DoesNotExist:
            return Response({"error": "The employee does not exist"}, status=status.HTTP_404_NOT_FOUND)

        try:
            manager = Employee.objects.get(employee_id=supervisor_id)
        except Employee.DoesNotExist:
            return Response({"error": "The supervisor does not exist"}, status=status.HTTP_404_NOT_FOUND)

        subordinate.supervisor = manager
        subordinate.save()

        if USE_CACHE:
            try:
                cache.delete("cached_employees_full_info")
            except redis.exceptions.RedisError as e:
                print(f"[Redis Error] Fallback to DB: {e}")

        return Response({"success": True}, status=status.HTTP_200_OK)

    def delete(self, request, manager_id):
        user_info = get_user_from_token(request)

        if not user_info:
            return Response({'detail': 'Unauthorized'}, status=401)

        if user_info['role'] != 2:
            return Response({'detail': 'Permission denied'}, status=403)

        subordinate_id = request.data.get('subordinate_id')
        supervisor_id = manager_id

        subordinate = Employee.objects.get(employee_id=subordinate_id)
        
        if not subordinate:
            return Response(status=status.HTTP_404_NOT_FOUND)

        manager = Employee.objects.get(employee_id=supervisor_id)
        if manager.role != 2 and subordinate.supervisor_id != supervisor_id:
            return Response(status=status.HTTP_404_NOT_FOUND)
            
        subordinate.supervisor = None
        subordinate.save()

        if USE_CACHE:
            try:
                cache.delete("cached_employees_full_info")
            except redis.exceptions.RedisError as e:
                print(f"[Redis Error] Fallback to DB: {e}")

        return Response(status=status.HTTP_204_NO_CONTENT)


class PasswordView(APIView):
    def post(self, request):
        user_info = get_user_from_token(request)

        if not user_info:
            return Response({'detail': 'Unauthorized'}, status=401)

        employee_id = request.data.get('id')
        password = request.data.get('password')

        try:
            employee = Employee.objects.get(pk=employee_id)
            if USE_HASH:
                result = (employee.login_password == hash_password(password))
            else:
                result = (employee.login_password == password)
            
            if result:
                return Response({"message": "password correct"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Incorrect user or password"}, status=status.HTTP_403_FORBIDDEN)
        except Employee.DoesNotExist:
            return Response({"error": "Incorrect user or password"}, status=status.HTTP_403_FORBIDDEN)

    def put(self, request):
        user_info = get_user_from_token(request)

        if not user_info:
            return Response({'detail': 'Unauthorized'}, status=401)

        employee_id = request.data.get('id')
        password = request.data.get('password')

        try:
            employee = Employee.objects.get(pk=employee_id)
            if USE_HASH:
                employee.login_password = hash_password(password)
            else:
                employee.login_password=password
            employee.save()

            if USE_CACHE:
                try:
                    cache.delete("cached_employees_full_info")
                except redis.exceptions.RedisError as e:
                    print(f"[Redis Error] Fallback to DB: {e}")
            
            return Response({"message": "change succeesfully"}, status=status.HTTP_200_OK)
        except Employee.DoesNotExist:
            return Response({"error": "Incorrect user or password"}, status=status.HTTP_403_FORBIDDEN)