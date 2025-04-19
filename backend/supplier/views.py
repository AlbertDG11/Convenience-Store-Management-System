from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from backend.employee.permissions import IsPurchasePersonOrManager
from .models import Supplier
from .serializer import SupplierSerializer
from .models import SupplierAddress
from .serializer import SupplierAddressSerializer

class SupplierViewSet(viewsets.ViewSet):
    
    """
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    """
    #permission_classes = [IsAuthenticated, IsPurchasePersonOrManager]
    
    def list(self, request):
        suppliers = Supplier.objects.all()
        serializer = SupplierSerializer(suppliers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        supplier = get_object_or_404(Supplier, pk=pk)
        serializer = SupplierSerializer(supplier)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = SupplierSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        supplier = get_object_or_404(Supplier, pk=pk)
        serializer = SupplierSerializer(supplier, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        supplier = get_object_or_404(Supplier, pk=pk)
        serializer = SupplierSerializer(supplier, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        supplier = get_object_or_404(Supplier, pk=pk)
        supplier.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class SupplieraddressViewSet(viewsets.ModelViewSet):
    queryset = SupplierAddress.objects.all()
    serializer_class = SupplierAddressSerializer
