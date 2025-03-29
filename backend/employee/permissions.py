from rest_framework import permissions
from models import Salesperson, Manager


class IsSalesPersonOrManager(permissions.BasePermission):
    """
    Only allow sales person or manager permission.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        employee = getattr(request.user, 'employee', None)
        if not employee:
            return False

        return isinstance(employee, (Salesperson, Manager))