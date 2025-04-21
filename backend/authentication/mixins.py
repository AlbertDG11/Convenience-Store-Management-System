# backend/authentication/mixins.py
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from backend.authentication.utils import get_user_from_token

class RoleRequiredMixin:
    allowed_roles = []

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        user_info = get_user_from_token(request)
        if not user_info:
            raise AuthenticationFailed('Unauthorized')
        if self.allowed_roles and user_info['role'] not in self.allowed_roles:
            raise PermissionDenied('Permission denied')
        request.user_info = user_info
