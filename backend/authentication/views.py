from ..employee.models import *
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializer import AuthenticationSerializer

# Create your views here.
class AuthenticationView(APIView):
    def post(self, request):
        serializer = AuthenticationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)